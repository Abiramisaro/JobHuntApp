import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PrimaryButton from "../components/PrimaryButton";
import { useFlow } from "../context/FlowContext";
import { STEP_IDS, STEP_SCREEN } from "../constants/flowConfig";
import * as C from "../constants/colors";
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../constants/layout";

// Helper to format array values
const fmt = (val) => {
  if (!val) return "—";
  if (Array.isArray(val)) return val.length ? val.join(", ") : "—";
  return String(val);
};

// Collapsible section card
function SummarySection({ icon, title, stepId, fields, navigation }) {
  const [expanded, setExpanded] = useState(true);
  const { goToStep } = useFlow();

  return (
    <View style={styles.section}>
      {/* Section header */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.8}
      >
        <View style={styles.sectionLeft}>
          <View style={styles.sectionIcon}>
            <Ionicons name={icon} size={16} color={C.PRIMARY} />
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.sectionRight}>
          <TouchableOpacity
            onPress={() => goToStep(stepId, navigation)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.editBtn}
          >
            <Ionicons name="pencil-outline" size={13} color={C.PRIMARY} />
            <Text style={styles.editLabel}>EDIT</Text>
          </TouchableOpacity>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={C.TEXT_MUTED}
          />
        </View>
      </TouchableOpacity>

      {/* Fields */}
      {expanded && (
        <View style={styles.sectionBody}>
          {fields.map((f) => (
            <View key={f.label} style={styles.field}>
              <Text style={styles.fieldLabel}>{f.label}</Text>
              <Text style={styles.fieldValue}>{fmt(f.value)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function SummaryScreen({ navigation }) {
  const { answers, completeFlow, resetFlow } = useFlow();
  const insets = useSafeAreaInsets();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleConfirm = useCallback(async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200)); // simulate API call
    await completeFlow();
    setSubmitting(false);
    setDone(true);
  }, [completeFlow]);

  if (done) {
    return (
      <View style={[styles.doneWrap, { paddingTop: insets.top }]}>
        <View style={styles.doneIcon}>
          <Ionicons name="checkmark-circle" size={72} color={C.SUCCESS} />
        </View>
        <Text style={styles.doneTitle}>You're all set! 🎉</Text>
        <Text style={styles.doneSub}>
          We'll start matching you with relevant open roles and send them to your
          inbox.
        </Text>
        <TouchableOpacity
          onPress={() => resetFlow(navigation)}
          style={styles.restartBtn}
        >
          <Text style={styles.restartLabel}>Start over</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={22} color={C.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Summary</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroIcon}>
            <Ionicons name="checkmark-circle" size={28} color={C.PRIMARY} />
            <Text style={styles.heroSparkle}>✨</Text>
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Profile Ready!</Text>
            <Text style={styles.heroSub}>
              Everything looks great. Review your details below before
              finalizing your hunt.
            </Text>
          </View>
        </View>

        {/* Sections label */}
        <Text style={styles.profileLabel}>YOUR PROFESSIONAL PROFILE</Text>

        {/* Role & Experience */}
        <SummarySection
          icon="briefcase-outline"
          title="Role & Experience"
          stepId={STEP_IDS.PROFILE}
          navigation={navigation}
          fields={[
            { label: "DESIRED ROLE", value: answers.desiredRole },
            { label: "LEVEL", value: answers.experienceLevel },
            { label: "YEARS", value: answers.yearsOfExperience },
          ]}
        />

        {/* Job Type */}
        <SummarySection
          icon="time-outline"
          title="Job Type"
          stepId={STEP_IDS.JOB_TYPE}
          navigation={navigation}
          fields={[{ label: "TYPE", value: answers.jobType }]}
        />

        {/* Location */}
        <SummarySection
          icon="location-outline"
          title="Location"
          stepId={STEP_IDS.LOCATION}
          navigation={navigation}
          fields={[
            { label: "WORKING STYLE", value: answers.workingStyle },
            { label: "CITIES", value: answers.preferredCities },
          ]}
        />

        {/* Compensation */}
        <SummarySection
          icon="cash-outline"
          title="Compensation"
          stepId={STEP_IDS.SALARY}
          navigation={navigation}
          fields={[
            {
              label: "SALARY RANGE",
              value:
                answers.salaryMin && answers.salaryMax
                  ? `$${answers.salaryMin} – $${answers.salaryMax}`
                  : null,
            },
            { label: "AVAILABILITY", value: answers.availability },
          ]}
        />

        {/* Skills & Culture */}
        <SummarySection
          icon="settings-outline"
          title="Skills & Culture"
          stepId={STEP_IDS.SKILLS}
          navigation={navigation}
          fields={[
            { label: "CORE COMPETENCIES", value: answers.skills },
            { label: "COMPANY SIZE", value: answers.companySize },
            { label: "CULTURE FIT", value: answers.cultureTags },
          ]}
        />

        {/* Tip */}
        <View style={styles.tipCard}>
          <Ionicons name="sparkles-outline" size={18} color={C.PRIMARY} />
          <Text style={styles.tipText}>
            Tip: You can change any response before saving. Once confirmed,
            we'll start matching you with relevant open roles.
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md }]}>
        <View style={styles.btnRow}>
          <PrimaryButton
            label="Back"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
          <PrimaryButton
            label="Confirm & Save"
            onPress={handleConfirm}
            loading={submitting}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: C.BG },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: C.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: C.BORDER,
  },
  headerTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: C.TEXT_PRIMARY,
  },
  scroll: { padding: SPACING.md, paddingBottom: SPACING.xl, gap: SPACING.md },
  heroBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.md,
    backgroundColor: C.PRIMARY_LIGHT,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  heroIcon: {
    position: "relative",
    width: 40,
    alignItems: "center",
  },
  heroSparkle: {
    position: "absolute",
    top: -6,
    right: -6,
    fontSize: 12,
  },
  heroText: { flex: 1 },
  heroTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: C.TEXT_PRIMARY,
    marginBottom: 4,
  },
  heroSub: {
    fontSize: FONT_SIZE.sm,
    color: C.TEXT_SECONDARY,
    lineHeight: 20,
  },
  profileLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: C.TEXT_MUTED,
    letterSpacing: 1,
    marginTop: SPACING.xs,
  },
  section: {
    backgroundColor: C.WHITE,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: C.BORDER,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.md,
  },
  sectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: C.PRIMARY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: C.TEXT_PRIMARY,
  },
  sectionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  editLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: C.PRIMARY,
    letterSpacing: 0.5,
  },
  sectionBody: {
    borderTopWidth: 1,
    borderTopColor: C.BORDER,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  field: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: C.BORDER,
  },
  fieldLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: C.TEXT_MUTED,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  fieldValue: {
    fontSize: FONT_SIZE.base,
    color: C.TEXT_PRIMARY,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    backgroundColor: C.PRIMARY_LIGHT,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  tipText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: C.TEXT_SECONDARY,
    lineHeight: 20,
  },
  footer: {
    padding: SPACING.md,
    backgroundColor: C.WHITE,
    borderTopWidth: 1,
    borderTopColor: C.BORDER,
  },
  btnRow: { flexDirection: "row", gap: SPACING.sm },
  // Done screen
  doneWrap: {
    flex: 1,
    backgroundColor: C.WHITE,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  doneIcon: { marginBottom: SPACING.lg },
  doneTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: C.TEXT_PRIMARY,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  doneSub: {
    fontSize: FONT_SIZE.base,
    color: C.TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  restartBtn: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: C.BORDER,
  },
  restartLabel: {
    fontSize: FONT_SIZE.base,
    color: C.TEXT_SECONDARY,
    fontWeight: FONT_WEIGHT.medium,
  },
});
