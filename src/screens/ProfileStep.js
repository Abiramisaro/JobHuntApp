import React, { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Header from "../components/Header";
import ProgressBar from "../components/ProgressBar";
import StyledInput from "../components/StyledInput";
import ExperienceChip from "../components/ExperienceChip";
import Dropdown from "../components/Dropdown";
import PrimaryButton from "../components/PrimaryButton";
import SyncIndicator from "../components/SyncIndicator";
import { useFlow } from "../context/FlowContext";
import { useStepValidation } from "../hooks/useStepValidation";
import {
  EXPERIENCE_LEVELS,
  YEARS_OPTIONS,
  STEP_IDS,
} from "../constants/flowConfig";
import * as C from "../constants/colors";
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../constants/layout";

const REQUIRED = ["desiredRole", "experienceLevel"];

export default function ProfileStep({ navigation }) {
  const { answers, setAnswer, goNext, syncStatus, retrySave, getStepLabel } =
    useFlow();
  const isValid = useStepValidation(REQUIRED, answers);
  const stepInfo = getStepLabel(STEP_IDS.PROFILE);

  const handleNext = useCallback(
    () => goNext(navigation),
    [goNext, navigation]
  );

  return (
    <ScrollView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* ── Header ── */}
      <Header
        title="JobHunt"
        showLogo
        stepLabel={stepInfo ? `Step ${stepInfo.current} of ${stepInfo.total}` : ""}
      />
      <ProgressBar current={stepInfo?.current ?? 1} total={stepInfo?.total ?? 5} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Title ── */}
        <Text style={styles.heading}>Professional Profile</Text>
        <Text style={styles.sub}>
          Let's start with the basics of your career journey.
        </Text>

        {/* ── Desired Role ── */}
        <Text style={styles.fieldLabel}>
          Desired Role <Text style={styles.required}>*</Text>
        </Text>
        <StyledInput
          iconName="briefcase-outline"
          placeholder="e.g. Full Stack Developer"
          value={answers.desiredRole}
          onChangeText={(v) => setAnswer("desiredRole", v)}
          hint="Enter the specific job title you are targeting."
        />

        {/* ── Experience Level ── */}
        <Text style={[styles.fieldLabel, { marginTop: SPACING.lg }]}>
          Experience Level <Text style={styles.required}>*</Text>
        </Text>
        <ExperienceChip
          options={EXPERIENCE_LEVELS}
          value={answers.experienceLevel}
          onChange={(v) => setAnswer("experienceLevel", v)}
        />

        {/* ── Years of Experience ── */}
        <Text style={[styles.fieldLabel, { marginTop: SPACING.lg }]}>
          Years of Experience
        </Text>
        <Dropdown
          placeholder="Select years (optional)"
          options={YEARS_OPTIONS}
          value={answers.yearsOfExperience}
          onChange={(v) => setAnswer("yearsOfExperience", v)}
        />

        {/* ── Profile Strength tip ── */}
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Text style={styles.tipIconText}>⚡</Text>
          </View>
          <View style={styles.tipText}>
            <Text style={styles.tipTitle}>Profile Strength</Text>
            <Text style={styles.tipBody}>
              Completing this step accurately helps our AI match you with the
              most relevant opportunities.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <SyncIndicator status={syncStatus} onRetry={retrySave} />
        <PrimaryButton
          label="Continue"
          onPress={handleNext}
          disabled={!isValid}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: C.WHITE },
  scroll: { padding: SPACING.md, paddingBottom: SPACING.xl },
  heading: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: C.TEXT_PRIMARY,
    marginBottom: 6,
    marginTop: SPACING.md,
  },
  sub: {
    fontSize: FONT_SIZE.base,
    color: C.TEXT_SECONDARY,
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  fieldLabel: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: C.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
  },
  required: { color: C.DANGER },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.md,
    backgroundColor: C.PRIMARY_LIGHT,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.xl,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: C.PRIMARY_MID,
    alignItems: "center",
    justifyContent: "center",
  },
  tipIconText: { fontSize: 16 },
  tipText: { flex: 1 },
  tipTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: C.TEXT_PRIMARY,
    marginBottom: 4,
  },
  tipBody: {
    fontSize: FONT_SIZE.sm,
    color: C.TEXT_SECONDARY,
    lineHeight: 20,
  },
  footer: {
    padding: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: C.WHITE,
    borderTopWidth: 1,
    borderTopColor: C.BORDER,
    gap: SPACING.sm,
  },
});
