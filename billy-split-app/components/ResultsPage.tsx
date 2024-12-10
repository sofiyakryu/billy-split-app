import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App"; // Adjust the path if necessary

interface ResultsPageProps {
  route: RouteProp<RootStackParamList, "ResultsPage">;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ route }) => {
  const { receiptData, total: initialTotal } = route.params;

  // Create state to manage the editable receipt data
  const [editableData, setEditableData] = useState(receiptData);
  const [isEditing, setIsEditing] = useState<number | null>(null); // Track which item is being edited
  const [tempData, setTempData] = useState<Record<number, any>>({}); // Store temporary changes per item
  const [tempTotal, setTempTotal] = useState<string>(initialTotal ? initialTotal.toFixed(2) : ""); // Temporary total value
  const [isEditingTotal, setIsEditingTotal] = useState(false); // Track whether the total is being edited
  const [total, setTotal] = useState<number | null>(initialTotal || null);  // State to hold the updated total value

  useEffect(() => {
    console.log("Editable Data on Render:", editableData);
  }, [editableData]);

  // Handle changes in input fields (but only update tempData, not editableData yet)
  const handleTempEdit = (index: number, field: keyof typeof editableData[0], value: string) => {
    console.log(`Editing ${field} for index ${index}: ${value}`);
    setTempData((prevTempData) => ({
      ...prevTempData,
      [index]: {
        ...prevTempData[index],
        [field]: value,
      },
    }));
  };

  // Handle changes to the total value
  const handleTotalEdit = (value: string) => {
    setTempTotal(value);
  };

  // Toggle edit mode and save the data
  const toggleEdit = (index: number) => {
    console.log(`Toggling Edit for item ${index}`);
    if (isEditing === index) {
      // If already editing, save the changes
      console.log("Saving changes...");
      const updatedData = [...editableData];
      const itemTempData = tempData[index] || {};

      // Ensure the data is properly merged, converting quantity and price to their correct types
      updatedData[index] = {
        ...updatedData[index],
        dishName: itemTempData.dishName,
        quantity: itemTempData.quantity !== undefined ? parseInt(itemTempData.quantity, 10) : updatedData[index].quantity, // If empty, keep the old value
        price: itemTempData.price !== undefined ? parseFloat(itemTempData.price) : updatedData[index].price, // If empty, keep the old value
      };

      console.log("Updated Data:", updatedData);

      // Update the state with the merged data
      setEditableData(updatedData);

      // Reset edit mode
      setIsEditing(null);
      setTempData((prev) => ({ ...prev, [index]: {} })); // Reset tempData for that index
    } else {
      // Start editing this item
      setIsEditing(index);
      setTempData((prevTempData) => ({
        ...prevTempData,
        [index]: {
          dishName: editableData[index].dishName,
          quantity: editableData[index].quantity.toString(), // Convert to string for input field
          price: editableData[index].price.toFixed(2), // Convert to string for input field
        },
      }));
    }
  };

  // Save the total value when the user clicks Save
  const saveTotal = () => {
    const updatedTotal = parseFloat(tempTotal);
    if (!isNaN(updatedTotal)) {
      console.log("Saving Total:", updatedTotal);
      // Update the total in state
      setTotal(updatedTotal); // Save the updated total to the state
      setIsEditingTotal(false); // Stop editing the total
    }
  };

  // Format total for display
  const formattedTotal = total ? Number(total).toFixed(2) : "N/A";

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: "#fff", position: 'absolute', width: '100%' }}>
      <Text style={styles.header}>Receipt Items</Text>
      <Text>Please check if the receipt items and total are correct. Edit if necessary</Text>
      {editableData && editableData.length > 0 ? (
        editableData.map((item, index) => (
          <View key={`${item.dishName}-${index}`} style={styles.itemContainer}>
            <Text style={styles.itemText}>
              <Text style={styles.label}>Dish: </Text>
              {isEditing === index ? (
                <TextInput
                  style={styles.input}
                  value={tempData[index]?.dishName || ""} // Allow empty field until the user types
                  onChangeText={(text) => handleTempEdit(index, "dishName", text)}
                />
              ) : (
                item.dishName
              )}
            </Text>

            <Text style={styles.itemText}>
              <Text style={styles.label}>Quantity: </Text>
              {isEditing === index ? (
                <TextInput
                  style={styles.input}
                  value={tempData[index]?.quantity || ""} // Allow empty field until the user types
                  keyboardType="numeric"
                  onChangeText={(text) => handleTempEdit(index, "quantity", text)}
                />
              ) : (
                item.quantity
              )}
            </Text>

            <Text style={styles.itemText}>
              <Text style={styles.label}>Price: </Text>
              {isEditing === index ? (
                <TextInput
                  style={styles.input}
                  value={tempData[index]?.price || ""} // Allow empty field until the user types
                  keyboardType="numeric"
                  onChangeText={(text) => handleTempEdit(index, "price", text)}
                />
              ) : (
                `$${item.price.toFixed(2)}`
              )}
            </Text>

            <TouchableOpacity onPress={() => toggleEdit(index)} style={styles.editButton}>
              <Text style={styles.editButtonText}>{isEditing === index ? "Save" : "Edit"}</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No receipt items found.</Text>
      )}

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          <Text style={styles.label}>Total: </Text>
          {isEditingTotal ? (
            <TextInput
              style={styles.input}
              value={tempTotal} // Pre-populated with the current total
              keyboardType="numeric"
              onChangeText={handleTotalEdit} // Allow changes to the total
            />
          ) : (
            `$${formattedTotal}` // Display the formatted total when not in editing mode
          )}
        </Text>

        {isEditingTotal ? (
          <TouchableOpacity onPress={saveTotal} style={styles.editButton}>
            <Text style={styles.editButtonText}>Save Total</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsEditingTotal(true)} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Total</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  itemContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    marginVertical: 2,
  },
  label: {
    fontWeight: "bold",
  },
  input: {
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 4,
    marginTop: 10,
    alignItems: "center",
    alignSelf: 'flex-end'
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  totalContainer: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#e9f7e9",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});

export default ResultsPage;
