import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as C from "../constants/colors";
import { FONT_SIZE, SPACING, RADIUS } from "../constants/layout";

export default function SyncIndicator({ status, onRetry }) {
  if (status === "idle") return null;

  const map = {
    syncing: { icon: "cloud-upload-outline", color: C.TEXT_MUTED, label: "Saving…" },
    saved: { icon: "checkmark-circle-outline", color: C.SUCCESS, label: "Saved" },
    offline: { icon: "cloud-offline-outline", color: C.WARNING, label: "Offline — saved locally" },
    error: { icon: "alert-circle-outline", color: C.DANGER, label: "Save failed" },
  };

  const cfg = map[status];
  if (!cfg) return null;

  return (
    <View style={styles.row}>
      <Ionicons name={cfg.icon} size={13} color={cfg.color} />
      <Text style={[styles.label, { color: cfg.color }]}>{cfg.label}</Text>
      {status === "error" && onRetry && (
        <TouchableOpacity onPress={onRetry} style={styles.retryBtn}>
          <Text style={styles.retryLabel}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: FONT_SIZE.xs,
  },
  retryBtn: {
    marginLeft: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    backgroundColor: C.DANGER_BG,
  },
  retryLabel: {
    fontSize: FONT_SIZE.xs,
    color: C.DANGER,
  },
});
