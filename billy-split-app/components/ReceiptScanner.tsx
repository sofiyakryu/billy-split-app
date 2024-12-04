import React, { useState } from "react";
import { View, Button, StyleSheet, Image, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Tesseract from "tesseract.js";

// Define the structure of the parsed data (receipt items)
interface ReceiptItem {
  quantity: number;
  dishName: string;
  price: number;
}

const ReceiptScanner: React.FC = ({ navigation }: any) => {
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ReceiptItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // Loader state

  // Function to request permissions for the media library and camera
  const requestPermissions = async (): Promise<boolean> => {
    try {
      // Request permission for the media library
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaLibraryPermission.status !== "granted") {
        Alert.alert("Permission required", "Media library permissions are required.");
        return false;
      }

      // Request permission for the camera
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== "granted") {
        Alert.alert("Permission required", "Camera permissions are required.");
        return false;
      }

      return true; // All permissions granted
    } catch (error) {
      console.error("Error requesting permissions:", error);
      Alert.alert("Permission error", "An error occurred while requesting permissions.");
      return false;
    }
  };

  // Function to pick an image from the gallery or camera
  const pickImage = async () => {
    const permissionsGranted = await requestPermissions();
    if (!permissionsGranted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setScannedImage(result.assets[0].uri);
      processReceipt(result.assets[0].uri);
    }
  };

  // Function to process the receipt image using Tesseract.js
  const processReceipt = async (image: string): Promise<void> => {
    setIsProcessing(true); // Start loader
    try {
      const { data: { text } } = await Tesseract.recognize(image, "eng");
      console.log("Raw OCR Text:", text);
      const extractedItems = parseReceiptText(text);
      console.log('extractedItems', extractedItems);
      
      setParsedData(extractedItems);
    } catch (error) {
      Alert.alert("Error", "OCR failed. Please try again.");
      console.error(error);
    } finally {
      setIsProcessing(false); // Stop loader once done
    }
  };

  // Function to parse the OCR text and extract the relevant information
  const parseReceiptText = (rawText: string): Array<{ quantity: number; dishName: string; price: number }> => {
    const lines = rawText.split("\n"); // Split the OCR text into lines
    const items: Array<{ quantity: number; dishName: string; price: number }> = [];
  
    for (const line of lines) {
      console.log("Processing Line:", line); // Log each line being processed
      // Regex for matching "quantity dishName price" format (with optional spaces)
      const match = line.match(/(\d+)\s+([a-zA-Z\s]+)\s+\$?([\d,]+\.\d{2})/); 
  
      if (match) {
        console.log("Matched Line:", line); // Log the matched line
  
        // Extract quantity, dish name, and price
        const quantity = parseInt(match[1], 10);
        const dishName = match[2].trim();
        const price = parseFloat(match[3].replace(',', ''));
  
        items.push({ quantity, dishName, price });
      }
    }
  
    return items;
  };

  // Navigate to ResultsPage and pass the parsed data
  const goToResultsPage = (): void => {
    if (parsedData.length > 0) {
        navigation.navigate("ResultsPage", { receiptData: parsedData });
    } else {
        Alert.alert("Error", "No items detected in the receipt.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick a Receipt Image" onPress={pickImage} />
      {scannedImage && (
        <>
          <Image source={{ uri: scannedImage }} style={styles.image} />
          
          {/* Display a loader if the receipt is being processed */}
          {isProcessing ? (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
          ) : (
            <Button title="Proceed to Results" onPress={goToResultsPage} disabled={parsedData.length === 0} />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: 300,
    height: 400,
    marginVertical: 20,
    resizeMode: "contain",
  },
  loader: {
    marginVertical: 20,
  },
});

export default ReceiptScanner;
