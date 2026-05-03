import React, { useState, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";

import { useFlow }          from "../context/FlowContext";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

import ProfileStep            from "../screens/ProfileStep";
import JobTypeStep            from "../screens/JobTypeStep";
import CustomRequirementsStep from "../screens/CustomRequirementsStep";
import LocationStep           from "../screens/LocationStep";
import SalaryStep             from "../screens/SalaryStep";
import SkillsStep             from "../screens/SkillsStep";
import SummaryScreen          from "../screens/SummaryScreen";
import NoInternetScreen       from "../screens/NoInternetScreen";
import * as C                 from "../constants/colors";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  // ─────────────────────────────────────────────────────────────────────────
  // ALL hooks must be declared here, BEFORE any conditional return.
  // Violating this rule causes "Rendered more hooks than during previous render".
  // ─────────────────────────────────────────────────────────────────────────
  const { isLoading }                     = useFlow();
  const { isOffline, determined, checkNow } = useNetworkStatus();
  const [retryChecking, setRetryChecking] = useState(false);

  // useCallback must also be here — never below a conditional return
  const handleRetry = useCallback(async () => {
    setRetryChecking(true);
    await checkNow();
    setRetryChecking(false);
  }, [checkNow]);

  // ── Conditional RENDERS (not hook calls) go below all hooks ──────────────

  // 1. Still reading AsyncStorage or waiting for NetInfo first response
  if (isLoading || !determined) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={C.PRIMARY} />
      </View>
    );
  }

  // 2. Hard offline at cold launch → full-page wall
  //    Mid-session drops are handled by NetworkBanner inside each step screen.
  if (isOffline) {
    return <NoInternetScreen onRetry={handleRetry} checking={retryChecking} />;
  }

  // 3. Online → normal navigation flow
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: C.WHITE },
        }}
      >
        <Stack.Screen name="ProfileStep"            component={ProfileStep} />
        <Stack.Screen name="JobTypeStep"            component={JobTypeStep} />
        <Stack.Screen name="CustomRequirementsStep" component={CustomRequirementsStep} />
        <Stack.Screen name="LocationStep"           component={LocationStep} />
        <Stack.Screen name="SalaryStep"             component={SalaryStep} />
        <Stack.Screen name="SkillsStep"             component={SkillsStep} />
        <Stack.Screen
          name="SummaryScreen"
          component={SummaryScreen}
          options={{ animation: "slide_from_bottom" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = {
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" },
};
