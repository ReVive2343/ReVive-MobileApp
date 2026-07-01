import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN_KEY } from '../api/client';

/** Shape returned to callers on successful login/register */
export interface AuthResult {
  token: string;
  userId: string;
}

/**
 * AuthService
 * Today: mock delays. Later: swap implementations to call Axios without touching screens.
 */
const authService = {
  /**
   * Sign in with email + password.
   * Throws a user-friendly Error string on failure.
   */
  async login(email: string, _password: string): Promise<AuthResult> {
    await new Promise<void>((r) => setTimeout(r, 1400));
    if (email.toLowerCase() === 'error@example.com') {
      throw new Error('Invalid email or password. Please try again.');
    }
    const result: AuthResult = { token: 'mock_jwt_token_revive', userId: 'user_1' };
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, result.token);
    return result;
  },

  /** Create a new account */
  async register(name: string, email: string, _phone: string, _password: string): Promise<AuthResult> {
    await new Promise<void>((r) => setTimeout(r, 1400));
    if (email.toLowerCase() === 'error@example.com') {
      throw new Error('This email is already registered.');
    }
    const result: AuthResult = { token: 'mock_jwt_token_revive', userId: 'user_1' };
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, result.token);
    return result;
  },

  /** Request an OTP code to be sent to email */
  async requestOtp(email: string): Promise<void> {
    await new Promise<void>((r) => setTimeout(r, 1200));
    if (email.toLowerCase() === 'error@example.com') {
      throw new Error('No account found with this email address.');
    }
  },

  /** Verify the OTP code. Mock: only '123456' passes. */
  async verifyOtp(_email: string, code: string): Promise<void> {
    await new Promise<void>((r) => setTimeout(r, 1200));
    if (code !== '123456') {
      throw new Error('Invalid verification code. Use "123456" for testing.');
    }
  },

  /** Resend OTP code */
  async resendOtp(_email: string): Promise<void> {
    await new Promise<void>((r) => setTimeout(r, 900));
  },

  /** Reset the user's password */
  async resetPassword(_email: string, _newPassword: string): Promise<void> {
    await new Promise<void>((r) => setTimeout(r, 1400));
  },

  /** Remove local session token */
  async logout(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  },

  /** Returns the stored JWT or null */
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(AUTH_TOKEN_KEY);
  },
};

export default authService;
