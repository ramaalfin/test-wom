import { GOOGLE_WEB_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID } from '@env';

export interface GoogleOAuthConfig {
    webClientId: string;
    androidClientId?: string;
    offlineAccess?: boolean;
    scopes?: string[];
}

export const googleOAuthConfig: GoogleOAuthConfig = {
    webClientId: GOOGLE_WEB_CLIENT_ID || '',
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    offlineAccess: false,
    scopes: ['email', 'profile'],
};
