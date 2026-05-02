import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as C from "../constants/colors";
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../constants/layout";

/**
 * PrimaryButton
 * Props:
 *  label     – button text
 *  onPress   – handler
 *  disabled  – grays out and blocks press
 *  loading   – shows spinner
 *  variant   – "filled" (default) | "outline"
 */
export default function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = "filled",
}) {
  const isOutline = variant === "outline";

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isOutline ? styles.outline : styles.filled,
        (disabled || loading) && (isOutline ? styles.outlineDisabled : styles.filledDisabled),
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? C.PRIMARY : C.WHITE} size="small" />
      ) : (
        <Text
          style={[
            styles.label,
            isOutline ? styles.labelOutline : styles.labelFilled,
            (disabled || loading) && styles.labelDisabled,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    marginBottom: 18,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  filled: {
    backgroundColor: C.PRIMARY,
  },
  filledDisabled: {
    backgroundColor: C.PRIMARY_MID,
  },
  outline: {
    backgroundColor: C.WHITE,
    borderWidth: 1.5,
    borderColor: C.BORDER,
  },
  outlineDisabled: {
    borderColor: C.BORDER,
    backgroundColor: C.BG,
  },
  label: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
  },
  labelFilled: {
    color: C.WHITE,
  },
  labelOutline: {
    color: C.TEXT_PRIMARY,
  },
  labelDisabled: {
    color: C.TEXT_MUTED,
  },
});
