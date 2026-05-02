import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as C from "../constants/colors";
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../constants/layout";

/**
 * RadioCard
 * A tappable card row with icon + label + subtitle + checkmark.
 * Matches the Job Type and Location screens in the design.
 *
 * Props:
 *  icon      – Ionicons name string
 *  label     – main text
 *  sub       – subtitle text (optional)
 *  selected  – boolean
 *  onPress   – handler
 */
export default function RadioCard({ icon, label, sub, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Icon box */}
      <View style={[styles.iconBox, selected && styles.iconBoxSelected]}>
        <Ionicons
          name={icon}
          size={18}
          color={selected ? C.PRIMARY : C.TEXT_SECONDARY}
        />
      </View>

      {/* Text */}
      <View style={styles.textBlock}>
        <Text style={[styles.label, selected && styles.labelSelected]}>
          {label}
        </Text>
        {sub ? (
          <Text style={styles.sub} numberOfLines={2}>
            {sub}
          </Text>
        ) : null}
      </View>

      {/* Checkmark */}
      {selected && (
        <Ionicons
          name="checkmark-circle"
          size={22}
          color={C.PRIMARY}
          style={styles.check}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.WHITE,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: C.BORDER,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  cardSelected: {
    borderColor: C.PRIMARY,
    backgroundColor: C.PRIMARY_LIGHT,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: C.CHIP_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxSelected: {
    backgroundColor: C.PRIMARY_MID,
  },
  textBlock: {
    flex: 1,
  },
  label: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: C.TEXT_PRIMARY,
    marginBottom: 2,
  },
  labelSelected: {
    color: C.PRIMARY,
  },
  sub: {
    fontSize: FONT_SIZE.sm,
    color: C.TEXT_SECONDARY,
    lineHeight: 18,
  },
  check: {
    marginLeft: SPACING.xs,
  },
});
