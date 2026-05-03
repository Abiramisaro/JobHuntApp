import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import Header         from "../components/Header";
import ProgressBar    from "../components/ProgressBar";
import NetworkBanner  from "../components/NetworkBanner";
import NetworkBlocker from "../components/NetworkBlocker";
import SectionLabel   from "../components/SectionLabel";
import StyledInput    from "../components/StyledInput";
import RadioCard      from "../components/RadioCard";
import { SkillChip, SuggestedSkillChip, CultureTag } from "../components/SkillChip";
import PrimaryButton  from "../components/PrimaryButton";
import SyncIndicator  from "../components/SyncIndicator";
import { useFlow }    from "../context/FlowContext";
import { useStepValidation } from "../hooks/useStepValidation";
import { useNetworkStatus }  from "../hooks/useNetworkStatus";
import { SUGGESTED_SKILLS, COMPANY_SIZES, CULTURE_TAGS, STEP_IDS } from "../constants/flowConfig";
import * as C         from "../constants/colors";
import { SPACING, FONT_SIZE, FONT_WEIGHT } from "../constants/layout";

const REQUIRED = ["skills", "companySize"];

export default function SkillsStep({ navigation }) {
  const { answers, setAnswer, goNext, goBack, syncStatus, retrySave, getStepLabel } = useFlow();
  const { isOffline } = useNetworkStatus();
  const isValid  = useStepValidation(REQUIRED, answers);
  const stepInfo = getStepLabel(STEP_IDS.SKILLS);
  const [blockerVisible, setBlockerVisible] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const skills      = answers.skills || [];
  const cultureTags = answers.cultureTags || [];
  const addSkill    = (s) => { if (!skills.includes(s)) setAnswer("skills", [...skills, s]); setSkillInput(""); };
  const removeSkill = (s) => setAnswer("skills", skills.filter((x) => x !== s));
  const toggleCulture = (t) => {
    const next = cultureTags.includes(t) ? cultureTags.filter((x) => x !== t) : [...cultureTags, t];
    setAnswer("cultureTags", next);
  };
  const suggestedVisible = SUGGESTED_SKILLS.filter((s) => !skills.includes(s));

  const handleNext = useCallback(() => {
    if (isOffline) { setBlockerVisible(true); return; }
    goNext(navigation);
  }, [isOffline, goNext, navigation]);

  const handleBack = useCallback(() => goBack(navigation), [goBack, navigation]);

  return (
    <ScrollView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Header title="JobHunt" showLogo onBack={handleBack}
        stepLabel={stepInfo ? `Step ${stepInfo.current} of ${stepInfo.total}` : ""} />
      <ProgressBar current={stepInfo?.current ?? 5} total={stepInfo?.total ?? 5} />
      <NetworkBanner onRetry={retrySave} />

      <ScrollView style={styles.flex} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Skills & Culture</Text>
        <Text style={styles.sub}>Finalize your profile by telling us what you bring to the table and what kind of team you're looking for.</Text>

        <SectionLabel label="Key Skills" required />
        <StyledInput iconName="search-outline" placeholder="Search skills (e.g. React)"
          value={skillInput} onChangeText={setSkillInput} />
        {skills.length > 0 && (
          <View style={styles.chipRow}>
            {skills.map((s) => <SkillChip key={s} label={s} onRemove={() => removeSkill(s)} />)}
          </View>
        )}
        {suggestedVisible.length > 0 && (
          <>
            <Text style={styles.suggestionsLabel}>SUGGESTED SKILLS</Text>
            <View style={styles.chipRow}>
              {suggestedVisible.map((s) => <SuggestedSkillChip key={s} label={s} onAdd={() => addSkill(s)} />)}
            </View>
          </>
        )}

        <View style={{ marginTop: SPACING.lg }}>
          <Text style={styles.sectionHeading}>Company Size Preference</Text>
          {COMPANY_SIZES.map((opt) => (
            <RadioCard key={opt.value} icon={opt.icon} label={opt.label} sub={opt.sub}
              selected={answers.companySize === opt.value}
              onPress={() => setAnswer("companySize", opt.value)} />
          ))}
        </View>

        <View style={{ marginTop: SPACING.lg }}>
          <Text style={styles.sectionHeading}>Culture Fit Tags</Text>
          <Text style={styles.cultureSub}>Select what matters most to your workplace experience.</Text>
          <View style={styles.chipRow}>
            {CULTURE_TAGS.map((tag) => (
              <CultureTag key={tag.value} label={tag.label}
                selected={cultureTags.includes(tag.value)}
                onPress={() => toggleCulture(tag.value)} />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <SyncIndicator status={syncStatus} onRetry={retrySave} />
        <PrimaryButton label="Review Summary" onPress={handleNext} disabled={!isValid} />
      </View>

      <NetworkBlocker
        visible={blockerVisible}
        onDismiss={() => { setBlockerVisible(false); goNext(navigation); }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: C.WHITE },
  scroll: { padding: SPACING.md, paddingBottom: SPACING.xl, gap: SPACING.sm },
  heading: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: C.TEXT_PRIMARY, marginBottom: 6, marginTop: SPACING.md },
  sub: { fontSize: FONT_SIZE.base, color: C.TEXT_SECONDARY, lineHeight: 22, marginBottom: SPACING.sm },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm, marginTop: SPACING.sm },
  suggestionsLabel: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold, color: C.TEXT_MUTED, letterSpacing: 1, marginTop: SPACING.md },
  sectionHeading: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: C.TEXT_PRIMARY, marginBottom: SPACING.md },
  cultureSub: { fontSize: FONT_SIZE.sm, color: C.TEXT_SECONDARY, marginBottom: SPACING.sm },
  footer: { padding: SPACING.md, paddingBottom: SPACING.lg, backgroundColor: C.WHITE, borderTopWidth: 1, borderTopColor: C.BORDER },
});
