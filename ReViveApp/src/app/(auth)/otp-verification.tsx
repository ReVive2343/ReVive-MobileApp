import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text, useTheme, Snackbar } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { AppTextInput } from '@/components/forms/AppTextInput';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { Header } from '@/components/layout/Header';

/**
 * OTP Verification Screen
 * Validates the verification code sent to the user's email.
 */
export default function OTPVerificationScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { email } = useLocalSearchParams<{ email: string }>();

  // State
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const validate = () => {
    if (!code) {
      setCodeError('Verification code is required');
      return false;
    } else if (code.length !== 6) {
      setCodeError('Code must be exactly 6 digits');
      return false;
    }
    setCodeError('');
    return true;
  };

  const handleVerify = async () => {
    if (!validate()) return;

    setIsLoading(true);

    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock OTP verification.
      // Accepted code: "123456" for successful verification, any other code triggers error.
      if (code !== '123456') {
        throw new Error('Invalid verification code. Use "123456" for mock testing.');
      }

      // Navigate to reset password page, passing email
      router.push({
        pathname: '/(auth)/reset-password',
        params: { email }
      });
    } catch (err: any) {
      setCodeError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setToastMessage('A new verification code has been sent to your email.');
      setIsToastVisible(true);
    } catch (err) {
      setToastMessage('Failed to resend code. Please try again.');
      setIsToastVisible(true);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaWrapper style={styles.safeArea}>
      <Header title="Verify Email" onBackPress={() => router.back()} />
      <ScreenContainer style={styles.container} scrollable>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
            Enter Code
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            We have sent a 6-digit verification code to:
          </Text>
          <Text variant="titleMedium" style={[styles.emailText, { color: theme.colors.primary }]}>
            {email || 'your-email@example.com'}
          </Text>
        </View>

        <View style={styles.form}>
          <AppTextInput
            label="6-Digit Verification Code"
            value={code}
            onChangeText={(val) => {
              // Only allow numbers and max length of 6
              const numericVal = val.replace(/[^0-9]/g, '').slice(0, 6);
              setCode(numericVal);
              if (codeError) setCodeError('');
            }}
            placeholder="123456"
            keyboardType="numeric"
            error={!!codeError}
            errorText={codeError}
            disabled={isLoading || isResending}
            leftIcon="shield-key-outline"
            style={styles.input}
          />

          <PrimaryButton
            onPress={handleVerify}
            loading={isLoading}
            disabled={isLoading || isResending}
            style={styles.button}
            accessibilityLabel="Verify code button"
          >
            Verify Code
          </PrimaryButton>
        </View>

        <View style={styles.footer}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Didn't receive the code?{' '}
          </Text>
          <Pressable onPress={handleResend} disabled={isLoading || isResending}>
            <Text variant="labelLarge" style={[styles.resendLink, { color: theme.colors.primary }]}>
              {isResending ? 'Sending...' : 'Resend Code'}
            </Text>
          </Pressable>
        </View>

        <Snackbar
          visible={isToastVisible}
          onDismiss={() => setIsToastVisible(false)}
          duration={3000}
          style={[styles.snackbar, { backgroundColor: theme.colors.primary }]}
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
    marginBottom: 4,
  },
  emailText: {
    fontWeight: 'bold',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  resendLink: {
    fontWeight: 'bold',
  },
  snackbar: {
    borderRadius: 8,
  },
});
