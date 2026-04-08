import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import useAppTheme from '../hooks/useAppTheme';

const SplashScreen: React.FC = () => {
  const theme = useAppTheme();

  useEffect(() => {
    console.log('[SplashScreen] Mounted - checking authentication...');
    
    return () => {
      console.log('[SplashScreen] Unmounted');
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator 
        size="large" 
        color={theme.colors.primary} 
      />
      <Text style={[styles.text, { color: theme.colors.text.secondary }]}>
        Loading...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 14,
  },
});

export default SplashScreen;
