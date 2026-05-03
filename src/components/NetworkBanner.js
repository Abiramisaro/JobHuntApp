/**
 * NetworkBanner
 * ──────────────────────────────────────────────────────────────────────────
 * A slim 40-px strip that lives between the ProgressBar and ScrollView on
 * every step screen.
 *
 * Behaviour:
 *  OFFLINE    → Red banner slides DOWN (spring). Stays until reconnected.
 *               Shows: "No internet. Check your Wi-Fi."  [Retry]
 *
 *  BACK ONLINE → Banner turns GREEN ("Back online — your progress is saved.")
 *               Auto-dismisses (slides UP) after 3 s. No manual action needed.
 *
 *  ALWAYS ONLINE at mount → Never appears at all.
 *
 * Props:
 *   onRetry  – optional callback after Retry tap confirms connectivity.
 */

import React, { useEffect, useRef } from "react";
import {
  Animated, Text, TouchableOpacity, StyleSheet, View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import * as C           from "../constants/colors";
import { SPACING, FONT_SIZE, FONT_WEIGHT } from "../constants/layout";

const BANNER_H    = 40;
const SPRING_CFG  = { tension: 80, friction: 12, useNativeDriver: true };
const SLIDE_UP_MS = 300;

export default function NetworkBanner({ onRetry }) {
  const { isOffline, justCameOnline, connectionType, checkNow } = useNetworkStatus();

  const slideY       = useRef(new Animated.Value(-BANNER_H)).current;
  const isVisRef     = useRef(false);
  const hideTimerRef = useRef(null);

  const show = () => {
    if (isVisRef.current) return;
    isVisRef.current = true;
    Animated.spring(slideY, { toValue: 0, ...SPRING_CFG }).start();
  };

  const hide = () => {
    if (!isVisRef.current) return;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    isVisRef.current = false;
    Animated.timing(slideY, {
      toValue: -BANNER_H,
      duration: SLIDE_UP_MS,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (isOffline) {
      // Went offline → cancel any pending hide and show red banner
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      show();
    } else if (justCameOnline) {
      // Just reconnected → make sure banner is visible (turns green via isGreen)
      // NetworkContext already has a 3 s timer; when it fires justCameOnline
      // becomes false and this effect runs again → hide() is called.
      show();
    } else {
      // Fully online, 3 s green window expired → slide up and disappear
      hide();
    }
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isOffline, justCameOnline]);

  const isGreen = !isOffline && justCameOnline;

  const typeLabel =
    connectionType === "wifi"       ? "Wi-Fi"
    : connectionType === "cellular" ? "mobile data"
    : "network";

  const handleRetry = async () => {
    const online = await checkNow();
    if (online && onRetry) onRetry();
  };

  return (
    <View style={styles.clip} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.banner,
          isGreen ? styles.green : styles.red,
          { transform: [{ translateY: slideY }] },
        ]}
        pointerEvents={isOffline ? "auto" : "none"}
      >
        <Ionicons
          name={isGreen ? "checkmark-circle-outline" : "cloud-offline-outline"}
          size={15}
          color={C.WHITE}
          style={styles.icon}
        />
        <Text style={styles.text} numberOfLines={1}>
          {isGreen
            ? "Back online — your progress is saved."
            : `No internet. Check your ${typeLabel}.`}
        </Text>
        {isOffline && (
          <TouchableOpacity
            onPress={handleRetry}
            style={styles.retryBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.retryLabel}>Retry</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip:    { height: BANNER_H, overflow: "hidden" },
  banner:  { height: BANNER_H, flexDirection: "row", alignItems: "center", paddingHorizontal: SPACING.md, gap: SPACING.sm },
  red:     { backgroundColor: "#DC2626" },
  green:   { backgroundColor: "#16A34A" },
  icon:    { flexShrink: 0 },
  text:    { flex: 1, fontSize: FONT_SIZE.xs, color: C.WHITE, fontWeight: FONT_WEIGHT.medium },
  retryBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.28)" },
  retryLabel: { fontSize: FONT_SIZE.xs, color: C.WHITE, fontWeight: FONT_WEIGHT.semibold },
});
