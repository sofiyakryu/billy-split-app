import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";

const NameListComponent: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState<string>(""); // State to store the current input value
  const [nameList, setNameList] = useState<string[]>([]); // State to store the list of names

  // Get the screen width to set dynamic sizes
  const screenWidth = Dimensions.get("window").width;

  // Function to add a name to the list
  const addNameToList = (): void => {
    if (name.trim() === "") {
      return; // Ignore empty names
    }
    setNameList((prevList) => [...prevList, name.trim()]);
    setName(""); // Clear the input field
  };

  const goToNextPage = () => {
    navigation.navigate("ScanReceipt", { names: nameList });
  };

  return (
    <View style={styles.container}>
      {/* Display the List of Names */}
      <FlatList
        data={nameList}
        keyExtractor={(item, index) => index.toString()}
        style={[styles.nameContainer, { maxWidth: screenWidth * 0.8 }]} // Limit to 80% of screen width
        columnWrapperStyle={styles.rowWrapper}
        numColumns={4} // Allows items to wrap like a grid
        renderItem={({ item }) => (
          <View style={styles.nameItem}>
            <Text style={styles.nameText}>{item}</Text>
          </View>
        )}
      />

      {/* Input Field and Add Button */}
      <View>
        <TextInput
          style={styles.input}
          placeholder="Enter a name"
          value={name}
          onChangeText={setName}
        />
        <Button title="Add Name" onPress={addNameToList} />
      </View>
      {nameList.length >= 2 &&
        <Button title="Next Page" onPress={goToNextPage} color="#007BFF" />
      }
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center", // Center the content for better alignment
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: 200, // Fixed width for the input field
  },
  nameContainer: {
    flexGrow: 0,
    marginBottom: 20,
  },
  rowWrapper: {
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  nameItem: {
    backgroundColor: "#fafafa",
    padding: 5,
    margin: 5,
    borderRadius: 5,
    alignSelf: "flex-start", // Auto width for the item
  },
  nameText: {
    fontSize: 18,
  },
});

export default NameListComponent;