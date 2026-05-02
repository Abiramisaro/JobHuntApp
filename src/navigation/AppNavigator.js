import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";

import { useFlow } from "../context/FlowContext";
import ProfileStrp from "../screens/ProfileStep";
import JobTypeStep from "../screens/JobTypeStep";
import CustomRequirementsStep from "../screens/CustomRequirementsStep";
import LocationStep from "../screens/LocationStep";
import SalaryStep from "../screens/SalaryStep";
import SkillsStep from "../screens/SkillsStep";
import SummaryScreen from "../screens/SummaryScreen";
import * as C from "../constants/colors"
import ProfileStep from "../screens/ProfileStep";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isLoading } = useFlow();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: C.WHITE }}>
        <ActivityIndicator size="large" color={C.PRIMARY} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,       // All screens use custom Header component
          animation: "slide_from_right",
          contentStyle: { backgroundColor: C.WHITE },
        }}
      >
        <Stack.Screen name="ProfileStep" component={ProfileStep} />
        <Stack.Screen name="JobTypeStep" component={JobTypeStep} />
        <Stack.Screen name="CustomRequirementsStep" component={CustomRequirementsStep} />
        <Stack.Screen name="LocationStep" component={LocationStep} />
        <Stack.Screen name="SalaryStep" component={SalaryStep} />
        <Stack.Screen name="SkillsStep" component={SkillsStep} />
        <Stack.Screen
          name="SummaryScreen"
          component={SummaryScreen}
          options={{ animation: "slide_from_bottom" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
