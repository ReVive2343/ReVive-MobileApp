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
 * Login Screen
 * Authenticates user credentials with local validation and mock session establishment.
 */
export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();

  // State values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Toast error state
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Simple Email RegExp pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
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

    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);

    try {
      // Simulate API network call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock Credentials Check
      // For testing: allow any credentials that pass basic validation, 
      // but if email is "error@example.com", simulate a server failure.
      if (email.toLowerCase() === 'error@example.com') {
        throw new Error('Invalid email or password. Please try again.');
      }

      // Establish session
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, 'mock_jwt_token_revive');
      
      // Navigate to main flow (index.tsx or home.tsx)
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setToastMessage(err.message || 'An error occurred during sign in.');
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
            Welcome Back
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            Sign in to start sharing and receiving items.
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
            placeholder="enter your email..."
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!emailError}
            errorText={emailError}
            disabled={isLoading}
            leftIcon="email-outline"
            style={styles.input}
          />

          <PasswordInput
            label="Password"
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              if (passwordError) setPasswordError('');
            }}
            placeholder="enter your password..."
            error={!!passwordError}
            errorText={passwordError}
            disabled={isLoading}
            style={styles.input}
          />

          <Pressable
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.forgotPasswordContainer}
            disabled={isLoading}
          >
            <Text variant="labelLarge" style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
              Forgot Password?
            </Text>
          </Pressable>

          <PrimaryButton
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
            accessibilityLabel="Sign in button"
          >
            Sign In
          </PrimaryButton>
        </View>

        <View style={styles.footer}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Don't have an account?{' '}
          </Text>
          <Pressable onPress={() => router.push('/(auth)/register')} disabled={isLoading}>
            <Text variant="labelLarge" style={[styles.signUpLink, { color: theme.colors.primary }]}>
              Sign Up
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
    marginTop: 40,
    marginBottom: 32,
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontWeight: 'bold',
  },
  loginButton: {
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
  signUpLink: {
    fontWeight: 'bold',
  },
  snackbar: {
    borderRadius: 8,
  },
});
