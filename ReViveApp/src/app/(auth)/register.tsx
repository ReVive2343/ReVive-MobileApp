import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text, useTheme, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { AppTextInput } from '@/components/forms/AppTextInput';
import { PasswordInput } from '@/components/forms/PasswordInput';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { AUTH_TOKEN_KEY } from '@/services/api/client';

/**
 * Register Screen
 * Performs input validation and executes mock user account creation.
 */
export default function RegisterScreen() {
  const router = useRouter();
  const theme = useTheme();

  // State values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validation errors state
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Toast message state
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (phone && phone.length < 10) {
      setPhoneError('Please enter a valid phone number');
      isValid = false;
    } else {
      setPhoneError('');
    }

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

  const handleRegister = async () => {
    if (!validate()) return;

    setIsLoading(true);

    try {
      // Simulate API network call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (email.toLowerCase() === 'error@example.com') {
        throw new Error('This email is already registered.');
      }

      // Establish session
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, 'mock_jwt_token_revive');
      
      // Navigate to main flow
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setToastMessage(err.message || 'An error occurred during registration.');
      setIsToastVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaWrapper style={styles.safeArea}>
      <ScreenContainer style={styles.container} scrollable>
        <View style={styles.header}>
          <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.primary }]}>
            Create Account
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            Register to join the ReVive sharing community.
          </Text>
        </View>

        <View style={styles.form}>
          <AppTextInput
            label="Full Name"
            value={name}
            onChangeText={(val) => {
              setName(val);
              if (nameError) setNameError('');
            }}
            placeholder="John Doe"
            error={!!nameError}
            errorText={nameError}
            disabled={isLoading}
            leftIcon="account-outline"
            style={styles.input}
          />

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

          <AppTextInput
            label="Phone Number (Optional)"
            value={phone}
            onChangeText={(val) => {
              setPhone(val);
              if (phoneError) setPhoneError('');
            }}
            placeholder="+1 (555) 000-0000"
            keyboardType="phone-pad"
            error={!!phoneError}
            errorText={phoneError}
            disabled={isLoading}
            leftIcon="phone-outline"
            style={styles.input}
          />

          <PasswordInput
            label="Password"
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              if (passwordError) setPasswordError('');
            }}
            placeholder="choose a password..."
            error={!!passwordError}
            errorText={passwordError}
            disabled={isLoading}
            style={styles.input}
          />

          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(val) => {
              setConfirmPassword(val);
              if (confirmPasswordError) setConfirmPasswordError('');
            }}
            placeholder="repeat password..."
            error={!!confirmPasswordError}
            errorText={confirmPasswordError}
            disabled={isLoading}
            leftIcon="lock-check-outline"
            style={styles.input}
          />

          <PrimaryButton
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            style={styles.registerButton}
            accessibilityLabel="Register account button"
          >
            Sign Up
          </PrimaryButton>
        </View>

        <View style={styles.footer}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Already have an account?{' '}
          </Text>
          <Pressable onPress={() => router.push('/(auth)/login')} disabled={isLoading}>
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
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: 16,
  },
  registerButton: {
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
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
