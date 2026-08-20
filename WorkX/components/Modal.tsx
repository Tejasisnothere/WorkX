import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import {colors, spacing, radius, typography} from "@/theme";

type ModalProps = {
  visible: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function Modal({
  visible,
  title,
  description,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {title}
          </Text>

          {description && (
            <Text style={styles.description}>
              {description}
            </Text>
          )}

          <View style={styles.actions}>
            <Pressable
              onPress={onClose}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>
                {cancelText}
              </Text>
            </Pressable>

            {onConfirm && (
              <Pressable
                onPress={onConfirm}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmText}>
                  {confirmText}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },

  modal: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },

  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },

  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.md,
  },

  cancelButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },

  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },

  cancelText: {
    ...typography.button,
    color: colors.textSecondary,
  },

  confirmText: {
    ...typography.button,
    color: colors.white,
  },
});