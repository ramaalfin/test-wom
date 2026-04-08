/**
 * Debug utility for authentication troubleshooting
 * Use this to check auth state in development
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const debugAuthState = async () => {
    console.log('=== AUTH DEBUG START ===');

    try {
        // Check AsyncStorage
        const token = await AsyncStorage.getItem('@auth_token');
        console.log('Token in storage:', token ? 'EXISTS' : 'NULL');

        if (token) {
            console.log('Token length:', token.length);
            console.log('Token preview:', token.substring(0, 50) + '...');
        }

        // Check all AsyncStorage keys
        const allKeys = await AsyncStorage.getAllKeys();
        console.log('All AsyncStorage keys:', allKeys);

    } catch (error) {
        console.error('Debug error:', error);
    }

    console.log('=== AUTH DEBUG END ===');
};

export const clearAuthStorage = async () => {
    try {
        await AsyncStorage.removeItem('@auth_token');
        console.log('Auth token cleared');
    } catch (error) {
        console.error('Error clearing auth:', error);
    }
};
