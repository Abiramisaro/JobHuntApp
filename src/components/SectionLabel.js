import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as C from "../constants/colors";
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../constants/layout";

/**
 * SectionLabel
 * Renders the "Key Skills  [REQUIRED]" row found throughout the designs.
 *
 * Props:
 *  label     – section title
 *  required  – show required badge
 */
export default function SectionLabel({ label, required = false }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {required && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>REQUIRED</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: C.TEXT_PRIMARY,
  },
  badge: {
    backgroundColor: C.REQUIRED_BG,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: C.REQUIRED_TEXT,
    letterSpacing: 0.5,
  },
});
