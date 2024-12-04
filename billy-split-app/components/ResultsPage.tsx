import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App"; // Adjust the path if necessary

interface ResultsPageProps {
  route: RouteProp<RootStackParamList, "ResultsPage">;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ route }) => {
  const { receiptData } = route.params;

  console.log('receipt data', receiptData);
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Receipt Items</Text>
      {receiptData && receiptData.length > 0 ? (
        <FlatList
          data={receiptData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>
                <Text style={styles.label}>Dish: </Text>
                {item.dishName}
              </Text>
              <Text style={styles.itemText}>
                <Text style={styles.label}>Quantity: </Text>
                {item.quantity}
              </Text>
              <Text style={styles.itemText}>
                <Text style={styles.label}>Price: </Text>${item.price.toFixed(2)}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No receipt items found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
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
  noDataText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});

export default ResultsPage;
