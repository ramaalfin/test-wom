import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../services/authService';
import { useAppTheme } from '../../../hooks/useAppTheme';

const LoginScreen: React.FC = () => {
  const theme = useAppTheme();
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const passwordInputRef = React.useRef<TextInput>(null);

  const validateForm = (): boolean => {
    let isValid = true;

    setEmailError('');
    setPasswordError('');
    clearError();

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!validateForm()) {
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Google Sign-In error:', err);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError('');
    }
    if (error) {
      clearError();
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError('');
    }
    if (error) {
      clearError();
    }
  };

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  emailError ? styles.inputError : null,
                ]}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.text.secondary}
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                editable={!isLoading}
                accessibilityLabel="Email address"
                accessibilityHint="Enter your email address to sign in"
                accessibilityRole="none"
              />
              {emailError ? (
                <Text 
                  style={styles.errorText}
                  accessibilityLiveRegion="polite"
                  accessibilityRole="alert"
                >
                  {emailError}
                </Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                ref={passwordInputRef}
                style={[
                  styles.input,
                  passwordError ? styles.inputError : null,
                ]}
                placeholder="Enter your password"
                placeholderTextColor={theme.colors.text.secondary}
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                editable={!isLoading}
                accessibilityLabel="Password"
                accessibilityHint="Enter your password to sign in"
                accessibilityRole="none"
              />
              {passwordError ? (
                <Text 
                  style={styles.errorText}
                  accessibilityLiveRegion="polite"
                  accessibilityRole="alert"
                >
                  {passwordError}
                </Text>
              ) : null}
            </View>

            {error ? (
              <View 
                style={styles.globalErrorContainer}
                accessibilityLiveRegion="assertive"
                accessibilityRole="alert"
              >
                <Text style={styles.globalErrorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[
                styles.button,
                isLoading ? styles.buttonDisabled : null,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.7}
              accessibilityLabel="Sign in"
              accessibilityHint="Double tap to sign in with your email and password"
              accessibilityRole="button"
              accessibilityState={{ disabled: isLoading, busy: isLoading }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {isLoading ? (
                <ActivityIndicator 
                  color={theme.colors.text.inverse}
                  accessibilityLabel="Signing in"
                />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={[
                styles.googleButton,
                isLoading ? styles.buttonDisabled : null,
              ]}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
              activeOpacity={0.7}
              accessibilityLabel="Sign in with Google"
              accessibilityHint="Double tap to sign in using your Google account"
              accessibilityRole="button"
              accessibilityState={{ disabled: isLoading, busy: isLoading }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.colors.text.primary} />
              ) : (
                <>
                  <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      padding: theme.spacing.xxl,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xxxl,
      ...theme.shadows.card,
    },
    title: {
      ...theme.typography.heading,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xxxl,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: theme.spacing.xl,
    },
    label: {
      ...theme.typography.label,
      marginBottom: theme.spacing.sm,
    },
    input: {
      ...theme.typography.body,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      color: theme.colors.text.primary,
      minHeight: 48,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      ...theme.typography.caption,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    },
    globalErrorContainer: {
      backgroundColor: `${theme.colors.error}15`,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    globalErrorText: {
      ...theme.typography.body,
      color: theme.colors.error,
      textAlign: 'center',
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      minHeight: 48,
      ...theme.shadows.card,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      ...theme.typography.subheading,
      color: theme.colors.text.inverse,
      fontWeight: '600',
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: theme.spacing.xl,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    dividerText: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      marginHorizontal: theme.spacing.md,
    },
    googleButton: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      alignItems: 'center',
      minHeight: 48,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.card,
    },
    googleButtonText: {
      ...theme.typography.subheading,
      color: theme.colors.text.primary,
      fontWeight: '600',
    },
  });

export default LoginScreen;
