import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text, useTheme, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { AppTextInput } from '@/components/forms/AppTextInput';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { Header } from '@/components/layout/Header';

/**
 * ForgotPassword Screen
 * Receives the recovery email address, performs validation, and triggers an OTP send.
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const theme = useTheme();

  // State
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleRequestOTP = async () => {
    if (!validate()) return;

    setIsLoading(true);

    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (email.toLowerCase() === 'error@example.com') {
        throw new Error('No account found with this email address.');
      }

      // Navigate to OTP screen passing email as query parameter
      router.push({
        pathname: '/(auth)/otp-verification',
        params: { email }
      });
    } catch (err: any) {
      setToastMessage(err.message || 'An error occurred. Please try again.');
      setIsToastVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaWrapper style={styles.safeArea}>
      <Header title="Reset Password" onBackPress={() => router.back()} />
      <ScreenContainer style={styles.container} scrollable>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
            Forgot Password?
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Enter your email address and we'll send you an OTP code to reset your password.
          </Text>
        </View>

        <View style={styles.form}>
          <AppTextInput
            label="Email Address"
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              if (emailError) setEmailError('');
            }}
            placeholder="john.doe@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!emailError}
            errorText={emailError}
            disabled={isLoading}
            leftIcon="email-outline"
            style={styles.input}
          />

          <PrimaryButton
            onPress={handleRequestOTP}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
            accessibilityLabel="Send OTP code button"
          >
            Send OTP Code
          </PrimaryButton>
        </View>

        <View style={styles.footer}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Remembered your password?{' '}
          </Text>
          <Pressable onPress={() => router.replace('/(auth)/login')} disabled={isLoading}>
            <Text variant="labelLarge" style={[styles.loginLink, { color: theme.colors.primary }]}>
              Sign In
            </Text>
          </Pressable>
        </View>

        <Snackbar
          visible={isToastVisible}
          onDismiss={() => setIsToastVisible(false)}
          duration={3000}
          style={[styles.snackbar, { backgroundColor: theme.colors.error }]}
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  loginLink: {
    fontWeight: 'bold',
  },
  snackbar: {
    borderRadius: 8,
  },
});
