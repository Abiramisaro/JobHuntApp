import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Switch, KeyboardAvoidingView, Platform } from "react-native";
import Header         from "../components/Header";
import ProgressBar    from "../components/ProgressBar";
import NetworkBanner  from "../components/NetworkBanner";
import NetworkBlocker from "../components/NetworkBlocker";
import SectionLabel   from "../components/SectionLabel";
import StyledInput    from "../components/StyledInput";
import PrimaryButton  from "../components/PrimaryButton";
import SyncIndicator  from "../components/SyncIndicator";
import { useFlow }    from "../context/FlowContext";
import { useStepValidation } from "../hooks/useStepValidation";
import { useNetworkStatus }  from "../hooks/useNetworkStatus";
import { STEP_IDS }   from "../constants/flowConfig";
import * as C         from "../constants/colors";
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../constants/layout";

const REQUIRED = ["customRequirements"];

export default function CustomRequirementsStep({ navigation }) {
  const { answers, setAnswer, goNext, goBack, syncStatus, retrySave, getStepLabel } = useFlow();
  const { isOffline } = useNetworkStatus();
  const isValid  = useStepValidation(REQUIRED, answers);
  const stepInfo = getStepLabel(STEP_IDS.CUSTOM_REQUIREMENTS);
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
      <ProgressBar current={stepInfo?.current ?? 3} total={stepInfo?.total ?? 6} />
      <NetworkBanner onRetry={retrySave} />

      <ScrollView style={styles.flex} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Custom Requirements</Text>
        <Text style={styles.sub}>
          Since you selected 'Other', please describe your specific job needs so we can find the perfect match.
        </Text>
        <SectionLabel label="Detailed Requirements" required />
        <StyledInput
          placeholder="E.g., I'm looking for a 4-day work week, specifically in the sustainable energy sector..."
          value={answers.customRequirements}
          onChangeText={(v) => setAnswer("customRequirements", v)}
          multiline maxLength={500}
        />
        <View style={styles.toggleCard}>
          <View style={styles.toggleIcon}><Text style={{ fontSize: 16 }}>⚡</Text></View>
          <View style={styles.toggleText}>
            <Text style={styles.toggleTitle}>Priority Match</Text>
            <Text style={styles.toggleSub}>Flag this request as urgent to get matching roles sent to your inbox immediately.</Text>
          </View>
          <Switch
            value={!!answers.priorityMatch}
            onValueChange={(v) => setAnswer("priorityMatch", v)}
            trackColor={{ false: C.BORDER, true: C.PRIMARY }}
            thumbColor={C.WHITE}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <SyncIndicator status={syncStatus} onRetry={retrySave} />
        <View style={styles.btnRow}>
          <PrimaryButton label="Back" onPress={handleBack} variant="outline" />
          <PrimaryButton label="Continue to Location" onPress={handleNext} disabled={!isValid} />
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
  scroll: { padding: SPACING.md, paddingBottom: SPACING.xl },
  heading: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: C.TEXT_PRIMARY, marginBottom: 6, marginTop: SPACING.md },
  sub: { fontSize: FONT_SIZE.base, color: C.TEXT_SECONDARY, marginBottom: SPACING.lg, lineHeight: 22 },
  toggleCard: { flexDirection: "row", alignItems: "center", gap: SPACING.md, backgroundColor: C.BG, borderRadius: RADIUS.lg, padding: SPACING.md, marginTop: SPACING.lg },
  toggleIcon: { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: C.PRIMARY_MID, alignItems: "center", justifyContent: "center" },
  toggleText: { flex: 1 },
  toggleTitle: { fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: C.TEXT_PRIMARY, marginBottom: 2 },
  toggleSub: { fontSize: FONT_SIZE.sm, color: C.TEXT_SECONDARY, lineHeight: 18 },
  footer: { padding: SPACING.md, paddingBottom: SPACING.lg, backgroundColor: C.WHITE, borderTopWidth: 1, borderTopColor: C.BORDER, gap: SPACING.sm },
  btnRow: { flexDirection: "row", gap: SPACING.sm },
});
