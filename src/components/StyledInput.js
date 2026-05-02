import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as C from "../constants/colors";
import { SPACING, FONT_SIZE, RADIUS } from "../constants/layout";

/**
 * StyledInput
 * Props:
 *  placeholder   – string
 *  value         – string
 *  onChangeText  – handler
 *  iconName      – optional Ionicons name (left icon)
 *  multiline     – bool
 *  maxLength     – number
 *  keyboardType  – string
 *  hint          – helper text below the input
 */
export default function StyledInput({
  placeholder,
  value,
  onChangeText,
  iconName,
  multiline = false,
  maxLength,
  keyboardType = "default",
  hint,
  inlineStyle,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <View
        style={[
          inlineStyle,
          styles.inputWrap,
          focused && styles.inputWrapFocused,
          multiline && styles.inputWrapMulti,
        ]}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={16}
            color={C.TEXT_MUTED}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, multiline && styles.inputMulti]}
          placeholder={placeholder}
          placeholderTextColor={C.TEXT_MUTED}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
          maxLength={maxLength}
          keyboardType={keyboardType}
          textAlignVertical={multiline ? "top" : "center"}
          returnKeyType={multiline ? "default" : "done"}
        />
      </View>
      {/* Character count for multiline */}
      {multiline && maxLength && (
        <Text style={styles.charCount}>
          {(value || "").length}/{maxLength}
        </Text>
      )}
      {hint && !multiline && (
        <View style={styles.hintRow}>
          <Ionicons name="information-circle-outline" size={13} color={C.TEXT_MUTED} />
          <Text style={styles.hint}>{hint}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.WHITE,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: C.BORDER,
    paddingHorizontal: SPACING.md,
    height: 50
  },
  inputWrapFocused: {
    borderColor: C.PRIMARY,
  },
  inputWrapMulti: {
    height: 120,
    alignItems: "flex-start",
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    color: C.TEXT_PRIMARY,
    height: "100%",
  },
  inputMulti: {
    height: "100%",
  },
  charCount: {
    fontSize: FONT_SIZE.xs,
    color: C.TEXT_MUTED,
    textAlign: "right",
    marginTop: 4,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  hint: {
    fontSize: FONT_SIZE.xs,
    color: C.TEXT_MUTED,
  },
});
