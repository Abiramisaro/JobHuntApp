import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as C from "../constants/colors";
import { SPACING, FONT_SIZE, RADIUS } from "../constants/layout";

export default function InfoCard({ text }) {
  return (
    <View style={styles.card}>
      <Ionicons name="information-circle-outline" size={18} color={C.PRIMARY} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    backgroundColor: C.PRIMARY_LIGHT,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  text: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: C.TEXT_SECONDARY,
    lineHeight: 20,
  },
});
