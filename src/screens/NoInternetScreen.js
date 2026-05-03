import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as C from "../constants/colors";
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../constants/layout";

/**
 * NoInternetScreen
 * ─────────────────
 * Shown only when the app opens for the very first time with zero connectivity
 * AND there is no locally-saved progress to restore from.
 *
 * Props:
 *   onRetry   – () => void   called when user taps "Try Again"
 *   checking  – bool         shows spinner while re-checking
 */
export default function NoInternetScreen({ onRetry, checking = false }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Illustration */}
      <View style={styles.iconCircle}>
        <Ionicons name="cloud-offline-outline" size={52} color={C.PRIMARY} />
      </View>

      {/* Copy */}
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.body}>
        JobHunt needs internet to sync your profile and surface matching
        opportunities. Please check your Wi-Fi or mobile data and try again.
      </Text>

      {/* Tips */}
      <View style={styles.tipsCard}>
        {[
          ["wifi-outline", "Check your Wi-Fi or mobile data settings"],
          ["airplane-outline", "Make sure Airplane Mode is off"],
          ["refresh-outline", "Try moving closer to your router"],
        ].map(([icon, tip]) => (
          <View key={icon} style={styles.tipRow}>
            <Ionicons name={icon} size={16} color={C.PRIMARY} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      {/* Retry button */}
      <TouchableOpacity
        style={styles.retryBtn}
        onPress={onRetry}
        activeOpacity={0.8}
        disabled={checking}
      >
        {checking ? (
          <ActivityIndicator color={C.WHITE} size="small" />
        ) : (
          <>
            <Ionicons name="refresh-outline" size={18} color={C.WHITE} />
            <Text style={styles.retryLabel}>Try Again</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.note}>
        If you have saved progress, it will resume automatically once you're
        back online.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.WHITE,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: C.PRIMARY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: C.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  body: {
    fontSize: FONT_SIZE.base,
    color: C.TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  tipsCard: {
    width: "100%",
    backgroundColor: C.BG,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  tipText: {
    fontSize: FONT_SIZE.sm,
    color: C.TEXT_SECONDARY,
    flex: 1,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: C.PRIMARY,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
  },
  retryLabel: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: C.WHITE,
  },
  note: {
    fontSize: FONT_SIZE.xs,
    color: C.TEXT_MUTED,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: SPACING.md,
  },
});
