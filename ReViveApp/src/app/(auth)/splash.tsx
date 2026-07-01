import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';

/**
 * Splash Screen
 * Welcomes users and auto-navigates or provides a manual action to enter the login flow.
 */
export default function SplashScreen() {
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    // Auto-navigate to login after 3 seconds if user doesn't press get started manually
    const timer = setTimeout(() => {
      handleGetStarted();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaWrapper style={styles.safeArea}>
      <ScreenContainer style={styles.container} avoidKeyboard={false}>
        <View style={styles.content}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="ReVive Logo"
          />
          <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.primary }]}>
            ReVive
          </Text>
          <Text variant="titleMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Give back to your community. Reuse, renew, revive.
          </Text>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            onPress={handleGetStarted}
            style={styles.button}
            accessibilityLabel="Get Started with ReVive"
          >
            Get Started
          </PrimaryButton>
        </View>
      </ScreenContainer>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 4,
  },
});
