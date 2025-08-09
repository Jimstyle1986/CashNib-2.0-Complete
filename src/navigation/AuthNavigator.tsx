import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../store/hooks';
import { theme } from '../theme';

// Import auth screens
import WelcomeScreen from '../screens/Auth/WelcomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import EmailVerificationScreen from '../screens/Auth/EmailVerificationScreen';
import BiometricSetupScreen from '../screens/Auth/BiometricSetupScreen';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import TermsAndConditionsScreen from '../screens/Auth/TermsAndConditionsScreen';
import PrivacyPolicyScreen from '../screens/Auth/PrivacyPolicyScreen';

// Navigation types
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: {
    token: string;
    email: string;
  };
  EmailVerification: {
    email: string;
    fromSignup?: boolean;
  };
  BiometricSetup: {
    skipable?: boolean;
  };
  Onboarding: undefined;
  TermsAndConditions: {
    fromSignup?: boolean;
  };
  PrivacyPolicy: {
    fromSignup?: boolean;
  };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  const { theme: currentTheme } = useAppSelector((state) => state.settings);
  const colors = currentTheme === 'dark' ? theme.colors.dark : theme.colors;

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontSize: theme.typography.sizes.lg,
          fontWeight: theme.typography.weights.semiBold,
        },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          title: 'Sign In',
          headerBackTitle: 'Back',
        }}
      />
      
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{
          title: 'Create Account',
          headerBackTitle: 'Back',
        }}
      />
      
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{
          title: 'Reset Password',
          headerBackTitle: 'Back',
        }}
      />
      
      <Stack.Screen 
        name="ResetPassword" 
        component={ResetPasswordScreen}
        options={{
          title: 'New Password',
          headerBackTitle: 'Back',
          headerLeft: () => null, // Disable back button
        }}
      />
      
      <Stack.Screen 
        name="EmailVerification" 
        component={EmailVerificationScreen}
        options={{
          title: 'Verify Email',
          headerBackTitle: 'Back',
        }}
      />
      
      <Stack.Screen 
        name="BiometricSetup" 
        component={BiometricSetupScreen}
        options={{
          title: 'Biometric Setup',
          headerBackTitle: 'Back',
        }}
      />
      
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      
      <Stack.Screen 
        name="TermsAndConditions" 
        component={TermsAndConditionsScreen}
        options={{
          title: 'Terms & Conditions',
          headerBackTitle: 'Back',
          presentation: 'modal',
        }}
      />
      
      <Stack.Screen 
        name="PrivacyPolicy" 
        component={PrivacyPolicyScreen}
        options={{
          title: 'Privacy Policy',
          headerBackTitle: 'Back',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;