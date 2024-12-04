import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import NameForm from "./components/NameForm";
import ReceiptScanner from "./components/ReceiptScanner";
import ResultsPage from "./components/ResultsPage";

// Optional: Define navigation param types
export type RootStackParamList = {
  "EnterNames": undefined; // No parameters for NameForm
  "ScanReceipt": undefined; // No parameters for ReceiptScanner
  ResultsPage: { receiptData: Array<{ quantity: number; dishName: string; price: number }> }; // Pass parsed receipt data to ResultsPage
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="EnterNames">
        <Stack.Screen 
          name="EnterNames" 
          component={NameForm} 
          options={{ title: "Enter Names" }} 
        />
        <Stack.Screen 
          name="ScanReceipt" 
          component={ReceiptScanner} 
          options={{ title: "Scan Receipt" }} 
        />
        <Stack.Screen 
          name="ResultsPage" 
          component={ResultsPage} 
          options={{ title: "Receipt Results" }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 15,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default App;