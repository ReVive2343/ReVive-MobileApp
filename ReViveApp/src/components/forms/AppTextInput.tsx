import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { HelperText, TextInput, useTheme } from 'react-native-paper';

export interface AppTextInputProps {
  /** Label for the text input (floating label) */
  label: string;
  /** Current value of the input */
  value: string;
  /** Callback function called when the text changes */
  onChangeText: (text: string) => void;
  /** Custom styles to apply to the wrapper container */
  style?: StyleProp<ViewStyle>;
  /** Placeholder text shown when the input is empty */
  placeholder?: string;
  /** If true, renders the input in an error state */
  error?: boolean;
  /** Error message to display underneath the input when in an error state */
  errorText?: string;
  /** If true, the user cannot edit the input text */
  disabled?: boolean;
  /** Icon name (MaterialCommunityIcons) to display on the left side */
  leftIcon?: string;
  /** Icon name (MaterialCommunityIcons) to display on the right side */
  rightIcon?: string;
  /** Callback function when the right icon is pressed */
  onRightIconPress?: () => void;
  /** If true, hides the input text (for password/secrets) */
  secureTextEntry?: boolean;
  /** Keyboard type configuration (e.g. 'email-address', 'numeric') */
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  /** Capitalization rules for the input text */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  /** Optional custom accessibility label */
  accessibilityLabel?: string;
}

/**
 * AppTextInput is a standardized, styled text input field.
 * Integrates React Native Paper's Outlined TextInput with helper/error text and icon options.
 */
export const AppTextInput: React.FC<AppTextInputProps> = React.memo(({
  label,
  value,
  onChangeText,
  style,
  placeholder,
  error = false,
  errorText,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  accessibilityLabel,
}) => {
  const theme = useTheme();

  return (
    <View style={style}>
      <TextInput
        mode="outlined"
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        error={error}
        disabled={disabled}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        outlineColor={theme.colors.outline}
        activeOutlineColor={error ? theme.colors.error : theme.colors.primary}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityState={{ disabled }}
        left={
          leftIcon ? (
            <TextInput.Icon
              icon={leftIcon}
              disabled={disabled}
              accessibilityLabel={`${label} left icon`}
            />
          ) : undefined
        }
        right={
          rightIcon ? (
            <TextInput.Icon
              icon={rightIcon}
              onPress={onRightIconPress}
              disabled={disabled || !onRightIconPress}
              accessibilityLabel={`${label} right icon`}
            />
          ) : undefined
        }
      />
      {error && errorText ? (
        <HelperText type="error" visible={error}>
          {errorText}
        </HelperText>
      ) : null}
    </View>
  );
});

AppTextInput.displayName = 'AppTextInput';
