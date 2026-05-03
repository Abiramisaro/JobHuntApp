/**
 * NetworkBlocker
 * ─────────────────────────────────────────────────────────────────────────────
 * Modal overlay shown when the user taps Continue while offline.
 *
 * Behaviour:
 *   • Pops up with a spring scale animation.
 *   • Shows "Try Again" button → re-checks connectivity.
 *   • AUTO-DISMISSES the instant isOffline flips to false (useEffect).
 *   • onDismiss() is called after auto-dismiss → parent calls goNext().
 *   • Cannot be closed any other way (user must reconnect or retry).
 *
 * Props:
 *   visible    – boolean, controlled by parent step screen
 *   onDismiss  – called when connection is restored → parent should goNext()
 */
import React, { useEffect, useRef, useCallback } from "react";
import {
  Animated,
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons }         from "@expo/vector-icons";
import { useNetworkStatus } from "../hooks/useNetworkStatus";   // ← only this hook
import * as C               from "../constants/colors";
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../constants/layout";

export default function NetworkBlocker({ visible, onDismiss }) {
  // ── All hooks at the top — no conditional calls ───────────────────────────
  const { isOffline, checkNow } = useNetworkStatus();

  const scaleAnim   = useRef(new Animated.Value(0.88)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Pop-in animation when visible changes to true
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset for next open
      scaleAnim.setValue(0.88);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  // Auto-dismiss the instant connection is restored
  useEffect(() => {
    if (visible && !isOffline) {
      onDismiss?.();
    }
  }, [isOffline, visible]);

  const handleRetry = useCallback(async () => {
    const online = await checkNow();
    if (online) onDismiss?.();
  }, [checkNow, onDismiss]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}} // Android back button does nothing — must reconnect
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
          ]}
        >
          {/* Icon */}
          <View style={styles.iconWrap}>
            <Ionicons name="wifi-outline" size={38} color={C.PRIMARY} />
            <View style={styles.iconBadge}>
              <Ionicons name="close" size={10} color={C.WHITE} />
            </View>
          </View>

          {/* Title + body */}
          <Text style={styles.title}>No Internet Connection</Text>
          <Text style={styles.body}>
            You need an active connection to move forward. Your answers are
            safely saved on this device and will sync automatically.
          </Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Tips */}
          {[
            ["wifi-outline",     "Check your Wi-Fi or mobile data"],
            ["airplane-outline", "Make sure Airplane Mode is off"],
          ].map(([icon, tip]) => (
            <View key={icon} style={styles.tipRow}>
              <Ionicons name={icon} size={15} color={C.PRIMARY} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}

          {/* Retry button */}
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={handleRetry}
            activeOpacity={0.82}
          >
            <Ionicons name="refresh-outline" size={16} color={C.WHITE} />
            <Text style={styles.retryLabel}>Try Again</Text>
          </TouchableOpacity>

          {/* Auto-dismiss note */}
          <Text style={styles.note}>
            This dialog closes automatically once you're back online.
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  card: {
    width: "100%",
    backgroundColor: C.WHITE,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 20,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: C.PRIMARY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
    position: "relative",
  },
  iconBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.DANGER,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.WHITE,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: C.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  body: {
    fontSize: FONT_SIZE.sm,
    color: C.TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: C.BORDER,
    width: "100%",
    marginBottom: SPACING.md,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    alignSelf: "stretch",
    marginBottom: SPACING.sm,
  },
  tipText: {
    fontSize: FONT_SIZE.sm,
    color: C.TEXT_SECONDARY,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: C.PRIMARY,
    paddingVertical: 13,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    width: "100%",
    justifyContent: "center",
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
    lineHeight: 17,
  },
});
