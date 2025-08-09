import { apiService } from './api';
import { 
  User, 
  LoginCredentials, 
  SignupCredentials, 
  AuthResponse,
  BiometricAuthData,
  SocialAuthData 
} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import TouchID from 'react-native-touch-id';
import { Alert } from 'react-native';

// Storage keys
const USER_DATA_KEY = 'user_data';
const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
const REMEMBER_ME_KEY = 'remember_me';
const LAST_LOGIN_EMAIL_KEY = 'last_login_email';

class AuthService {
  constructor() {
    this.initializeGoogleSignIn();
  }

  private initializeGoogleSignIn() {
    GoogleSignin.configure({
      webClientId: '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com', // Replace with actual client ID
      offlineAccess: true,
      hostedDomain: '',
      forceCodeForRefreshToken: true,
    });
  }

  // Standard email/password authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      
      // Store tokens
      await apiService.setAccessToken(response.accessToken);
      await apiService.setRefreshToken(response.refreshToken);
      
      // Store user data
      await this.storeUserData(response.user);
      
      // Store remember me preference
      if (credentials.rememberMe) {
        await AsyncStorage.setItem(REMEMBER_ME_KEY, 'true');
        await AsyncStorage.setItem(LAST_LOGIN_EMAIL_KEY, credentials.email);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/signup', credentials);
      
      // Store tokens
      await apiService.setAccessToken(response.accessToken);
      await apiService.setRefreshToken(response.refreshToken);
      
      // Store user data
      await this.storeUserData(response.user);
      
      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Clear local storage
      await this.clearAuthData();
      
      // Sign out from Google
      try {
        await GoogleSignin.signOut();
      } catch (error) {
        console.error('Google sign out error:', error);
      }
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = await apiService.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiService.post<AuthResponse>('/auth/refresh', {
        refreshToken,
      });
      
      // Update tokens
      await apiService.setAccessToken(response.accessToken);
      await apiService.setRefreshToken(response.refreshToken);
      
      // Update user data if provided
      if (response.user) {
        await this.storeUserData(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // Google Sign-In
  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices();
      
      // Get user info from Google
      const userInfo = await GoogleSignin.signIn();
      
      if (!userInfo.idToken) {
        throw new Error('Failed to get Google ID token');
      }
      
      // Send Google token to backend
      const socialAuthData: SocialAuthData = {
        provider: 'google',
        token: userInfo.idToken,
        email: userInfo.user.email,
        name: userInfo.user.name || '',
        profilePicture: userInfo.user.photo || undefined,
      };
      
      const response = await apiService.post<AuthResponse>('/auth/social', socialAuthData);
      
      // Store tokens and user data
      await apiService.setAccessToken(response.accessToken);
      await apiService.setRefreshToken(response.refreshToken);
      await this.storeUserData(response.user);
      
      return response;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  // Apple Sign-In
  async loginWithApple(): Promise<AuthResponse> {
    try {
      // Perform Apple authentication
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      
      // Get credential state
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user
      );
      
      if (credentialState !== appleAuth.State.AUTHORIZED) {
        throw new Error('Apple authentication was not authorized');
      }
      
      // Prepare social auth data
      const socialAuthData: SocialAuthData = {
        provider: 'apple',
        token: appleAuthRequestResponse.identityToken || '',
        email: appleAuthRequestResponse.email || '',
        name: appleAuthRequestResponse.fullName 
          ? `${appleAuthRequestResponse.fullName.givenName || ''} ${appleAuthRequestResponse.fullName.familyName || ''}`.trim()
          : '',
      };
      
      // Send Apple token to backend
      const response = await apiService.post<AuthResponse>('/auth/social', socialAuthData);
      
      // Store tokens and user data
      await apiService.setAccessToken(response.accessToken);
      await apiService.setRefreshToken(response.refreshToken);
      await this.storeUserData(response.user);
      
      return response;
    } catch (error) {
      console.error('Apple login error:', error);
      throw error;
    }
  }

  // Biometric Authentication
  async isBiometricAvailable(): Promise<boolean> {
    try {
      const biometryType = await TouchID.isSupported();
      return biometryType !== false;
    } catch (error) {
      console.error('Biometric availability check error:', error);
      return false;
    }
  }

  async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking biometric enabled status:', error);
      return false;
    }
  }

  async enableBiometric(): Promise<void> {
    try {
      // Test biometric authentication
      await TouchID.authenticate('Enable biometric authentication for quick access', {
        title: 'Biometric Authentication',
        subtitle: 'Use your fingerprint or face to authenticate',
        description: 'This will enable quick access to your account',
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
      });
      
      // If successful, enable biometric
      await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
    } catch (error) {
      console.error('Enable biometric error:', error);
      throw error;
    }
  }

  async disableBiometric(): Promise<void> {
    try {
      await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'false');
    } catch (error) {
      console.error('Disable biometric error:', error);
      throw error;
    }
  }

  async loginWithBiometric(): Promise<AuthResponse> {
    try {
      // Check if biometric is enabled
      const isEnabled = await this.isBiometricEnabled();
      if (!isEnabled) {
        throw new Error('Biometric authentication is not enabled');
      }
      
      // Get stored user email
      const email = await AsyncStorage.getItem(LAST_LOGIN_EMAIL_KEY);
      if (!email) {
        throw new Error('No stored credentials for biometric login');
      }
      
      // Authenticate with biometric
      await TouchID.authenticate('Authenticate to access your account', {
        title: 'Biometric Authentication',
        subtitle: 'Use your fingerprint or face to sign in',
        description: 'Quick and secure access to your account',
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
      });
      
      // Send biometric auth request to backend
      const biometricData: BiometricAuthData = {
        email,
        biometricId: await this.getBiometricId(),
      };
      
      const response = await apiService.post<AuthResponse>('/auth/biometric', biometricData);
      
      // Store tokens and user data
      await apiService.setAccessToken(response.accessToken);
      await apiService.setRefreshToken(response.refreshToken);
      await this.storeUserData(response.user);
      
      return response;
    } catch (error) {
      console.error('Biometric login error:', error);
      throw error;
    }
  }

  private async getBiometricId(): Promise<string> {
    // Generate or retrieve a unique biometric ID for this device
    const BIOMETRIC_ID_KEY = 'biometric_id';
    let biometricId = await AsyncStorage.getItem(BIOMETRIC_ID_KEY);
    
    if (!biometricId) {
      biometricId = `bio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem(BIOMETRIC_ID_KEY, biometricId);
    }
    
    return biometricId;
  }

  // Password management
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await apiService.post<{ message: string }>('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await apiService.post<{ message: string }>('/auth/reset-password', {
        token,
        password: newPassword,
      });
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await apiService.post<{ message: string }>('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Profile management
  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const response = await apiService.patch<User>('/auth/profile', updates);
      
      // Update stored user data
      await this.storeUserData(response);
      
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async deleteAccount(): Promise<{ message: string }> {
    try {
      const response = await apiService.delete<{ message: string }>('/auth/account');
      
      // Clear all local data
      await this.clearAuthData();
      
      return response;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }

  // Verification
  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const response = await apiService.post<{ message: string }>('/auth/verify-email', { token });
      return response;
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    }
  }

  async resendVerificationEmail(): Promise<{ message: string }> {
    try {
      const response = await apiService.post<{ message: string }>('/auth/resend-verification');
      return response;
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  }

  // Utility methods
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await apiService.getAccessToken();
      return !!token;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  async getRememberMeEmail(): Promise<string | null> {
    try {
      const rememberMe = await AsyncStorage.getItem(REMEMBER_ME_KEY);
      if (rememberMe === 'true') {
        return await AsyncStorage.getItem(LAST_LOGIN_EMAIL_KEY);
      }
      return null;
    } catch (error) {
      console.error('Error getting remember me email:', error);
      return null;
    }
  }

  private async storeUserData(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  private async clearAuthData(): Promise<void> {
    try {
      await Promise.all([
        apiService.clearTokens(),
        AsyncStorage.multiRemove([
          USER_DATA_KEY,
          BIOMETRIC_ENABLED_KEY,
          REMEMBER_ME_KEY,
          LAST_LOGIN_EMAIL_KEY,
        ]),
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  // Session management
  async validateSession(): Promise<boolean> {
    try {
      await apiService.get('/auth/validate');
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  async extendSession(): Promise<void> {
    try {
      await apiService.post('/auth/extend-session');
    } catch (error) {
      console.error('Extend session error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const authService = new AuthService();
export default authService;