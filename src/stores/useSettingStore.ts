import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@settings';

interface SettingsState {
    isDarkMode: boolean;
    language: 'en-US' | 'id-ID';
    isLoading: boolean;
    toggleDarkMode: () => void;
    setLanguage: (lang: 'en-US' | 'id-ID') => void;
    loadSettings: () => void;
}

const useSettingsStore = create<SettingsState>((set, get) => ({
    isDarkMode: false,
    language: 'en-US',
    isLoading: true,

    loadSettings: async () => {
        try {
            const data = await AsyncStorage.getItem(SETTINGS_KEY);
            if (data) {
                const settings = JSON.parse(data);
                set({
                    isDarkMode: settings.isDarkMode || false,
                    language: settings.language || 'en-US',
                    isLoading: false,
                });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            set({ isLoading: false });
        }
    },

    toggleDarkMode: async () => {
        try {
            const { isDarkMode, language } = get();
            const newValue = !isDarkMode;
            const settings = { isDarkMode: newValue, language };
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            set({ isDarkMode: newValue });
        } catch (error) {
            console.error('Error toggling dark mode:', error);
        }
    },

    setLanguage: async (lang: 'en-US' | 'id-ID') => {
        try {
            const { isDarkMode } = get();
            const settings = { isDarkMode, language: lang };
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            set({ language: lang });
        } catch (error) {
            console.error('Error setting language:', error);
        }
    },
}));

export default useSettingsStore;
