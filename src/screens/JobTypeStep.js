import React, { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import Header from "../components/Header";
import ProgressBar from "../components/ProgressBar";
import RadioCard from "../components/RadioCard";
import PrimaryButton from "../components/PrimaryButton";
import SyncIndicator from "../components/SyncIndicator";
import { useFlow } from "../context/FlowContext";
import { useStepValidation } from "../hooks/useStepValidation";
import { JOB_TYPE_OPTIONS, STEP_IDS } from "../constants/flowConfig";
import * as C from "../constants/colors";
import { SPACING, FONT_SIZE, FONT_WEIGHT } from "../constants/layout";

const REQUIRED = ["jobType"];

export default function JobTypeStep({ navigation }) {
  const { answers, setAnswer, goNext, goBack, syncStatus, retrySave, getStepLabel } =
    useFlow();
  const isValid = useStepValidation(REQUIRED, answers);
  const stepInfo = getStepLabel(STEP_IDS.JOB_TYPE);

  const handleNext = useCallback(() => goNext(navigation), [goNext, navigation]);
  const handleBack = useCallback(() => goBack(navigation), [goBack, navigation]);

  return (
    <View style={styles.flex}>
      <Header
        title="JobHunt"
        showLogo
        stepLabel={stepInfo ? `Step ${stepInfo.current} of ${stepInfo.total}` : ""}
        onBack={handleBack}
      />
      <ProgressBar current={stepInfo?.current ?? 2} total={stepInfo?.total ?? 5} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>
          What type of job are you looking for?
        </Text>
        <Text style={styles.sub}>
          Select all that apply to your current search goals.
        </Text>

        {JOB_TYPE_OPTIONS.map((opt) => (
          <RadioCard
            key={opt.value}
            icon={opt.icon}
            label={opt.label}
            sub={opt.sub}
            selected={answers.jobType === opt.value}
            onPress={() => setAnswer("jobType", opt.value)}
          />
        ))}

        {!answers.jobType && (
          <Text style={styles.hint}>Selection required to continue</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <SyncIndicator status={syncStatus} onRetry={retrySave} />
        <View style={styles.btnRow}>
          <PrimaryButton label="Back" onPress={handleBack} variant="outline" />
          <PrimaryButton label="Continue" onPress={handleNext} disabled={!isValid} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: C.WHITE },
  scroll: { padding: SPACING.md, paddingBottom: SPACING.xl, gap: SPACING.sm },
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
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  hint: {
    fontSize: FONT_SIZE.sm,
    color: C.TEXT_MUTED,
    textAlign: "center",
    marginTop: SPACING.sm,
  },
  footer: {
    padding: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: C.WHITE,
    borderTopWidth: 1,
    borderTopColor: C.BORDER,
    gap: SPACING.sm,
  },
  btnRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
});
