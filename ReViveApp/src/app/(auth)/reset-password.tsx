import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { PasswordInput } from '@/components/forms/PasswordInput';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { Header } from '@/components/layout/Header';

/**
 * Reset Password Screen
 * Accepts and validates a new password, then navigates the user back to the login screen on success.
 */
export default function ResetPasswordScreen() {
  const router = useRouter();
  const theme = useTheme();

  // State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Errors State
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const validate = () => {
    let isValid = true;

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;

    setIsLoading(true);

    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setToastMessage('Password reset successfully! Redirecting to login...');
      setIsToastVisible(true);

      // Wait for toast to display, then go to login
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 1500);
    } catch (err: any) {
      setToastMessage(err.message || 'Failed to reset password. Please try again.');
      setIsToastVisible(true);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaWrapper style={styles.safeArea}>
      <Header title="Set Password" onBackPress={() => router.back()} />
      <ScreenContainer style={styles.container} scrollable>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
            New Password
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Create a new, strong password. Make sure it is at least 6 characters.
          </Text>
        </View>

        <View style={styles.form}>
          <PasswordInput
            label="New Password"
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              if (passwordError) setPasswordError('');
            }}
            placeholder="choose a new password..."
            error={!!passwordError}
            errorText={passwordError}
            disabled={isLoading}
            style={styles.input}
          />

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={(val) => {
              setConfirmPassword(val);
              if (confirmPasswordError) setConfirmPasswordError('');
            }}
            placeholder="repeat new password..."
            error={!!confirmPasswordError}
            errorText={confirmPasswordError}
            disabled={isLoading}
            leftIcon="lock-check-outline"
            style={styles.input}
          />

          <PrimaryButton
            onPress={handleResetPassword}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
            accessibilityLabel="Reset password button"
          >
            Update Password
          </PrimaryButton>
        </View>

        <Snackbar
          visible={isToastVisible}
          onDismiss={() => setIsToastVisible(false)}
          duration={3000}
          style={[
            styles.snackbar,
            { backgroundColor: toastMessage.includes('successfully') ? theme.colors.primary : theme.colors.error }
          ]}
        >
          {toastMessage}
        </Snackbar>
      </ScreenContainer>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 24,
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: 24,
  },
  button: {
    paddingVertical: 6,
    borderRadius: 8,
  },
  snackbar: {
    borderRadius: 8,
  },
});
