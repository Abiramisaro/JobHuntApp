import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import Header         from "../components/Header";
import ProgressBar    from "../components/ProgressBar";
import NetworkBanner  from "../components/NetworkBanner";
import NetworkBlocker from "../components/NetworkBlocker";
import StyledInput    from "../components/StyledInput";
import Dropdown       from "../components/Dropdown";
import PrimaryButton  from "../components/PrimaryButton";
import SyncIndicator  from "../components/SyncIndicator";
import InfoCard       from "../components/InfoCard";
import { useFlow }    from "../context/FlowContext";
import { useStepValidation } from "../hooks/useStepValidation";
import { useNetworkStatus }  from "../hooks/useNetworkStatus";
import { AVAILABILITY_OPTIONS, STEP_IDS } from "../constants/flowConfig";
import * as C         from "../constants/colors";
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../constants/layout";

const REQUIRED = ["salaryMin", "salaryMax", "availability"];

export default function SalaryStep({ navigation }) {
  const { answers, setAnswer, goNext, goBack, syncStatus, retrySave, getStepLabel } = useFlow();
  const { isOffline } = useNetworkStatus();
  const isValid  = useStepValidation(REQUIRED, answers);
  const stepInfo = getStepLabel(STEP_IDS.SALARY);
  const [blockerVisible, setBlockerVisible] = useState(false);

  const handleNext = useCallback(() => {
    if (isOffline) { setBlockerVisible(true); return; }
    goNext(navigation);
  }, [isOffline, goNext, navigation]);

  const handleBack = useCallback(() => goBack(navigation), [goBack, navigation]);

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Header title="JobHunt" showLogo onBack={handleBack}
        stepLabel={stepInfo ? `Step ${stepInfo.current} of ${stepInfo.total}` : ""} />
      <ProgressBar current={stepInfo?.current ?? 4} total={stepInfo?.total ?? 5} />
      <NetworkBanner onRetry={retrySave} />

      <ScrollView style={styles.flex} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Salary & Availability</Text>
        <Text style={styles.sub}>Be transparent about your expectations to find the best match.</Text>

        <View style={styles.sectionHeader}>
          <Ionicons name="card-outline" size={18} color={C.PRIMARY} />
          <Text style={styles.sectionTitle}>Desired Salary Range (USD)</Text>
        </View>
        <View style={styles.salaryRow}>
          <View style={styles.salaryField}>
            <Text style={styles.salaryLabel}>MIN / YEAR</Text>
            <View style={styles.salaryInput}>
              <Text style={styles.currencySymbol}>$</Text>
              <StyledInput placeholder="70,000" value={answers.salaryMin}  inlineStyle={{width: "140"}}
                onChangeText={(v) => setAnswer("salaryMin", v)} keyboardType="numeric" />
            </View>
          </View>
          <View style={styles.salaryField}>
            <Text style={styles.salaryLabel}>MAX / YEAR</Text>
            <View style={styles.salaryInput}>
              <Text style={styles.currencySymbol}>$</Text>
              <StyledInput placeholder="120,000" value={answers.salaryMax}  inlineStyle={{width: "140"}}
                onChangeText={(v) => setAnswer("salaryMax", v)} keyboardType="numeric" />
            </View>
          </View>
        </View>
        <Text style={styles.salaryTip}>Tip: Most candidates in this role expect between $85k - $110k.</Text>

        <View style={[styles.sectionHeader, { marginTop: SPACING.xl }]}>
          <Ionicons name="calendar-outline" size={18} color={C.PRIMARY} />
          <Text style={styles.sectionTitle}>When can you start?</Text>
        </View>
        <Dropdown placeholder="Select your availability" options={AVAILABILITY_OPTIONS}
          value={answers.availability} onChange={(v) => setAnswer("availability", v)} />
        <InfoCard text="Your availability helps recruiters prioritize your application if the role is urgent." />
      </ScrollView>

      <View style={styles.footer}>
        <SyncIndicator status={syncStatus} onRetry={retrySave} />
        <View style={styles.btnRow}>
          <PrimaryButton label="Back" onPress={handleBack} variant="outline" />
          <PrimaryButton label="Continue to Skills" onPress={handleNext} disabled={!isValid} />
        </View>
      </View>

      <NetworkBlocker
        visible={blockerVisible}
        onDismiss={() => { setBlockerVisible(false); goNext(navigation); }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: C.WHITE },
  scroll: { padding: SPACING.md, paddingBottom: SPACING.xl, gap: SPACING.md },
  heading: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: C.TEXT_PRIMARY, marginBottom: 6, marginTop: SPACING.md },
  sub: { fontSize: FONT_SIZE.base, color: C.TEXT_SECONDARY, lineHeight: 22 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  sectionTitle: { fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: C.TEXT_PRIMARY },
  salaryRow: { flexDirection: "row", gap: SPACING.sm },
  salaryField: { flex: 1, gap: SPACING.xs },
  salaryLabel: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold, color: C.TEXT_MUTED, letterSpacing: 0.5 },
  salaryInput: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: C.BORDER, borderRadius: RADIUS.md, paddingHorizontal: SPACING.sm, height: 50, backgroundColor: C.WHITE },
  currencySymbol: { fontSize: FONT_SIZE.base, color: C.TEXT_SECONDARY, marginRight: 4 },
  salaryTip: { fontSize: FONT_SIZE.xs, color: C.TEXT_MUTED, marginTop: -SPACING.xs },
  footer: { padding: SPACING.md, paddingBottom: SPACING.lg, backgroundColor: C.WHITE, borderTopWidth: 1, borderTopColor: C.BORDER, gap: SPACING.sm },
  btnRow: { flexDirection: "row", gap: SPACING.sm },
});
