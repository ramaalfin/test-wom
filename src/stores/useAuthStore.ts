import { create } from 'zustand';
import { decode } from 'base-64';
import AuthService from '../features/auth/services/authService';
import TokenManager from '../features/auth/services/tokenManager';
import { User } from '../features/auth/types/auth.types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    clearError: () => void;
}

const useAuthStore = create<AuthState>((set, _get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    checkAuth: async () => {
        console.log('[AuthStore] checkAuth started');
        try {
            set({ isLoading: true, error: null });

            const token = await TokenManager.getToken();
            console.log('[AuthStore] Token retrieved:', token ? 'exists' : 'null');

            if (!token) {
                console.log('[AuthStore] No token found, setting unauthenticated');
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false
                });
                return;
            }

            const isValid = await AuthService.validateToken(token);
            console.log('[AuthStore] Token validation result:', isValid);

            if (!isValid) {
                console.log('[AuthStore] Token invalid, clearing');
                await TokenManager.deleteToken();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false
                });
                return;
            }

            try {
                const parts = token.split('.');
                const payload = JSON.parse(decode(parts[1]));
                const user: User = {
                    id: parseInt(payload.sub, 10),
                    email: payload.email,
                    name: payload.name,
                    picture: payload.picture,
                };

                console.log('[AuthStore] User authenticated:', user.email);
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false
                });
            } catch (decodeError) {
                console.log('[AuthStore] Token decode error:', decodeError);
                await TokenManager.deleteToken();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false
                });
            }
        } catch (error) {
            console.error('[AuthStore] Error checking authentication:', error);
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: 'Failed to check authentication status'
            });
        } finally {
            console.log('[AuthStore] checkAuth completed');
        }
    },

    login: async (email: string, password: string) => {
        try {
            set({ isLoading: true, error: null });

            const response = await AuthService.login({ email, password });

            set({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'An unexpected error occurred';

            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: errorMessage,
            });

            throw error;
        }
    },

    loginWithGoogle: async () => {
        try {
            set({ isLoading: true, error: null });

            const response = await AuthService.loginWithGoogle();

            const user: User = {
                ...response.user,
                picture: response.user.picture,
            };

            set({
                user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'An unexpected error occurred';

            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: errorMessage,
            });

            throw error;
        }
    },

    logout: async () => {
        try {
            set({ isLoading: true, error: null });

            await AuthService.logout();

            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to logout';

            set({
                isLoading: false,
                error: errorMessage,
            });

            throw error;
        }
    },

    clearError: () => {
        set({ error: null });
    },
}));

export default useAuthStore;
