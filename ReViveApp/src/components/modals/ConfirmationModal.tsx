import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

export interface ConfirmationModalProps {
  /** If true, the modal renders overlaying screen content */
  visible: boolean;
  /** Main title heading of the confirmation dialog */
  title: string;
  /** Body message text explaining the decision context */
  message: string;
  /** Callback triggered when confirming the action */
  onConfirm: () => void;
  /** Callback triggered when cancelling or dismissing the dialog */
  onDismiss: () => void;
  /** Label text for the confirmation action (defaults to 'Confirm') */
  confirmLabel?: string;
  /** Label text for the cancel/dismiss action (defaults to 'Cancel') */
  cancelLabel?: string;
  /** If true, styles the confirm button in red to signify a destructive/irreversible action (e.g. deleting) */
  isDestructive?: boolean;
  /** Custom styles to apply to the dialog card container */
  style?: StyleProp<ViewStyle>;
  /** Optional custom accessibility label */
  accessibilityLabel?: string;
}

/**
 * ConfirmationModal renders a modal dialog for critical user prompts.
 * Wraps React Native Paper's Portal and Dialog.
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = React.memo(({
  visible,
  title,
  message,
  onConfirm,
  onDismiss,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={style}
      >
        <Dialog.Title accessibilityRole="header">
          {title}
        </Dialog.Title>
        
        <Dialog.Content>
          <Text variant="bodyMedium">
            {message}
          </Text>
        </Dialog.Content>
        
        <Dialog.Actions>
          <Button
            mode="text"
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
          >
            {cancelLabel}
          </Button>
          <Button
            mode="contained"
            onPress={onConfirm}
            buttonColor={isDestructive ? theme.colors.error : theme.colors.primary}
            textColor={isDestructive ? theme.colors.onError : theme.colors.onPrimary}
            accessibilityRole="button"
            accessibilityLabel={confirmLabel}
          >
            {confirmLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
});

ConfirmationModal.displayName = 'ConfirmationModal';
