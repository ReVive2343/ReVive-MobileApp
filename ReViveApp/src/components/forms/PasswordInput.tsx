import React, { useState } from 'react';
import { AppTextInput, AppTextInputProps } from './AppTextInput';

export interface PasswordInputProps extends Omit<AppTextInputProps, 'secureTextEntry' | 'rightIcon' | 'onRightIconPress'> {
  /** Optional custom icon name for showing password (defaults to 'eye') */
  showIcon?: string;
  /** Optional custom icon name for hiding password (defaults to 'eye-off') */
  hideIcon?: string;
}

/**
 * PasswordInput is a specialized text input for password fields.
 * Manages its own visibility toggle state internally.
 */
export const PasswordInput: React.FC<PasswordInputProps> = React.memo(({
  label,
  value,
  onChangeText,
  style,
  placeholder,
  error = false,
  errorText,
  disabled = false,
  leftIcon = 'lock-outline',
  showIcon = 'eye',
  hideIcon = 'eye-off',
  autoCapitalize = 'none',
  accessibilityLabel,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <AppTextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      style={style}
      placeholder={placeholder}
      error={error}
      errorText={errorText}
      disabled={disabled}
      leftIcon={leftIcon}
      rightIcon={isPasswordVisible ? hideIcon : showIcon}
      onRightIconPress={togglePasswordVisibility}
      secureTextEntry={!isPasswordVisible}
      autoCapitalize={autoCapitalize}
      accessibilityLabel={accessibilityLabel}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';
