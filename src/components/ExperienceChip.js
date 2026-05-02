import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as C from "../constants/colors";
import { FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "../constants/layout";

/**
 * ExperienceChip
 * The segmented Entry / Mid / Senior selector.
 *
 * Props:
 *  options   – array of { value, label, sub }
 *  value     – currently selected value
 *  onChange  – (value) => void
 */
export default function ExperienceChip({ options, value, onChange }) {
  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, selected && styles.chipSelected]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.75}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {opt.label}
            </Text>
            <Text style={[styles.sub, selected && styles.subSelected]}>
              {opt.sub}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  chip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: C.BORDER,
    backgroundColor: C.WHITE,
  },
  chipSelected: {
    borderColor: C.PRIMARY,
    backgroundColor: C.PRIMARY_LIGHT,
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
    fontSize: FONT_SIZE.xs,
    color: C.TEXT_MUTED,
  },
  subSelected: {
    color: C.PRIMARY,
  },
});
