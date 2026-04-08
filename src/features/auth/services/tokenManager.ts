import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_STORAGE_KEY = '@auth_token';

export const storeToken = async (token: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (error) {
        console.error('Error storing token:', error);
        throw new Error('Failed to store authentication token');
    }
};

export const getToken = async (): Promise<string | null> => {
    try {
        const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        return token;
    } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
    }
};

export const deleteToken = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (error) {
        console.error('Error deleting token:', error);
        throw new Error('Failed to delete authentication token');
    }
};

export const hasToken = async (): Promise<boolean> => {
    try {
        const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        return token !== null;
    } catch (error) {
        console.error('Error checking token existence:', error);
        return false;
    }
};

const TokenManager = {
    storeToken,
    getToken,
    deleteToken,
    hasToken,
};

export default TokenManager;
