import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Header from "../components/Header";
import ProgressBar from "../components/ProgressBar";
import RadioCard from "../components/RadioCard";
import SectionLabel from "../components/SectionLabel";
import StyledInput from "../components/StyledInput";
import PrimaryButton from "../components/PrimaryButton";
import SyncIndicator from "../components/SyncIndicator";
import { useFlow } from "../context/FlowContext";
import { useStepValidation } from "../hooks/useStepValidation";
import {
  WORKING_STYLES,
  CITY_SUGGESTIONS,
  STEP_IDS,
} from "../constants/flowConfig";
import * as C from "../constants/colors";
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../constants/layout";

const REQUIRED = ["workingStyle", "preferredCities"];

export default function LocationStep({ navigation }) {
  const { answers, setAnswer, goNext, goBack, syncStatus, retrySave, getStepLabel } =
    useFlow();
  const isValid = useStepValidation(REQUIRED, answers);
  const stepInfo = getStepLabel(STEP_IDS.LOCATION);

  const [cityInput, setCityInput] = useState("");

  const selectedCities = answers.preferredCities || [];

  const addCity = (city) => {
    if (!selectedCities.includes(city)) {
      setAnswer("preferredCities", [...selectedCities, city]);
    }
    setCityInput("");
  };

  const removeCity = (city) => {
    setAnswer(
      "preferredCities",
      selectedCities.filter((c) => c !== city)
    );
  };

  const handleNext = useCallback(() => goNext(navigation), [goNext, navigation]);
  const handleBack = useCallback(() => goBack(navigation), [goBack, navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header
        title="JobHunt"
        showLogo
        stepLabel={stepInfo ? `Step ${stepInfo.current} of ${stepInfo.total}` : ""}
        onBack={handleBack}
      />
      <ProgressBar current={stepInfo?.current ?? 3} total={stepInfo?.total ?? 5} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Location Preference</Text>
        <Text style={styles.sub}>Where would you like to do your best work?</Text>

        {/* Working Style */}
        <Text style={styles.sectionTitle}>WORKING STYLE</Text>
        {WORKING_STYLES.map((opt) => (
          <RadioCard
            key={opt.value}
            icon={opt.icon}
            label={opt.label}
            sub={opt.sub}
            selected={answers.workingStyle === opt.value}
            onPress={() => setAnswer("workingStyle", opt.value)}
          />
        ))}

        {/* Preferred Cities */}
        <View style={{ marginTop: SPACING.lg }}>
          <SectionLabel label="Preferred Cities" required />
          <StyledInput
            iconName="search-outline"
            placeholder="Search by city or country..."
            value={cityInput}
            onChangeText={setCityInput}
          />

          {/* Selected cities chips */}
          {selectedCities.length > 0 && (
            <View style={styles.chipRow}>
              {selectedCities.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={styles.cityChip}
                  onPress={() => removeCity(city)}
                >
                  <Text style={styles.cityChipText}>{city}  ×</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Suggestions */}
          <Text style={styles.suggestionsLabel}>SUGGESTIONS</Text>
          <View style={styles.suggestionsRow}>
            {CITY_SUGGESTIONS.filter((c) => !selectedCities.includes(c)).map(
              (city) => (
                <TouchableOpacity
                  key={city}
                  style={styles.suggestionChip}
                  onPress={() => addCity(city)}
                >
                  <Text style={styles.suggestionText}>{city}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <SyncIndicator status={syncStatus} onRetry={retrySave} />
        <View style={styles.btnRow}>
          <PrimaryButton label="Back" onPress={handleBack} variant="outline" />
          <PrimaryButton label="Continue" onPress={handleNext} disabled={!isValid} />
        </View>
      </View>
    </KeyboardAvoidingView>
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
  sectionTitle: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: C.TEXT_MUTED,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  cityChip: {
    backgroundColor: C.PRIMARY,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
  },
  cityChipText: {
    fontSize: FONT_SIZE.sm,
    color: C.WHITE,
    fontWeight: FONT_WEIGHT.medium,
  },
  suggestionsLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: C.TEXT_MUTED,
    letterSpacing: 1,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  suggestionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  suggestionChip: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: C.BORDER,
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    backgroundColor: C.WHITE,
  },
  suggestionText: {
    fontSize: FONT_SIZE.sm,
    color: C.TEXT_SECONDARY,
  },
  footer: {
    padding: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: C.WHITE,
    borderTopWidth: 1,
    borderTopColor: C.BORDER,
    gap: SPACING.sm,
  },
  btnRow: { flexDirection: "row", gap: SPACING.sm },
});
