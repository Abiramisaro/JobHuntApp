import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as C from "../constants/colors";
import { SPACING, FONT_SIZE, FONT_WEIGHT } from "../constants/layout";

/**
 * Header
 * Props:
 *  title       – left-side text (e.g. "JobHunt")
 *  stepLabel   – right-side text (e.g. "Step 2 of 5"), optional
 *  onBack      – function, if omitted back button is hidden
 *  showLogo    – if true, renders the lightning bolt logo icon
 */
export default function Header({ title, stepLabel, onBack, showLogo = false }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={22} color={C.TEXT_PRIMARY} />
          </TouchableOpacity>
        )}
        {showLogo && (
          <View style={styles.logoBox}>
            <Ionicons name="flash" size={14} color={C.WHITE} />
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      {stepLabel ? (
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>{stepLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: C.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: C.BORDER,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  backBtn: {
    marginRight: 2,
  },
  logoBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: C.TEXT_PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: C.TEXT_PRIMARY,
  },
  stepBadge: {
    backgroundColor: C.CHIP_BG,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  stepText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: C.TEXT_SECONDARY,
  },
});
