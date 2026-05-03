import React from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { FlowProvider } from "./src/context/FlowContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FlowProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </FlowProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
