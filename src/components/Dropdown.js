import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as C from "../constants/colors";
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "../constants/layout";

/**
 * Dropdown
 * Props:
 *  placeholder  – text shown when nothing selected
 *  options      – array of { value, label }
 *  value        – selected value string
 *  onChange     – (value) => void
 */
export default function Dropdown({ placeholder, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.triggerText, !selected && styles.placeholder]}>
          {selected ? selected.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={C.TEXT_SECONDARY} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{placeholder}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && styles.optionSelected,
                  ]}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Ionicons name="checkmark" size={18} color={C.PRIMARY} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.WHITE,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: C.BORDER,
    paddingHorizontal: SPACING.md,
    height: 50,
  },
  triggerText: {
    fontSize: FONT_SIZE.base,
    color: C.TEXT_PRIMARY,
    flex: 1,
  },
  placeholder: {
    color: C.TEXT_MUTED,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: C.WHITE,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: "60%",
  },
  sheetTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: C.TEXT_PRIMARY,
    marginBottom: SPACING.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: C.BORDER,
  },
  optionSelected: {
    backgroundColor: C.PRIMARY_LIGHT,
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  optionText: {
    fontSize: FONT_SIZE.base,
    color: C.TEXT_PRIMARY,
  },
  optionTextSelected: {
    color: C.PRIMARY,
    fontWeight: FONT_WEIGHT.semibold,
  },
});
