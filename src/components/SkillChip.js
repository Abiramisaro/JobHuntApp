import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as C from "../constants/colors";
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../constants/layout";

/**
 * SkillChip – active chip (blue, with ×)
 */
export function SkillChip({ label, onRemove }) {
  return (
    <View style={styles.active}>
      <Text style={styles.activeLabel}>{label}</Text>
      <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="close" size={14} color={C.WHITE} />
      </TouchableOpacity>
    </View>
  );
}

/**
 * SuggestedSkillChip – ghost chip with + prefix
 */
export function SuggestedSkillChip({ label, onAdd }) {
  return (
    <TouchableOpacity style={styles.suggested} onPress={onAdd} activeOpacity={0.75}>
      <Text style={styles.suggestedLabel}>+ {label}</Text>
    </TouchableOpacity>
  );
}

/**
 * CultureTag – toggleable culture fit tag
 */
export function CultureTag({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.tag, selected && styles.tagSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {selected && (
        <Ionicons name="checkmark" size={13} color={C.WHITE} style={{ marginRight: 4 }} />
      )}
      <Text style={[styles.tagLabel, selected && styles.tagLabelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  active: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.PRIMARY,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
  },
  activeLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: C.WHITE,
  },
  suggested: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: C.BORDER,
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    backgroundColor: C.WHITE,
  },
  suggestedLabel: {
    fontSize: FONT_SIZE.sm,
    color: C.TEXT_SECONDARY,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: C.BORDER,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    backgroundColor: C.WHITE,
  },
  tagSelected: {
    backgroundColor: C.SUCCESS,
    borderColor: C.SUCCESS,
  },
  tagLabel: {
    fontSize: FONT_SIZE.sm,
    color: C.TEXT_SECONDARY,
  },
  tagLabelSelected: {
    color: C.WHITE,
    fontWeight: FONT_WEIGHT.medium,
  },
});
