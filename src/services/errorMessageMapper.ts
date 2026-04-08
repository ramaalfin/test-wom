import { AxiosError } from 'axios';

export interface UserFriendlyError {
    message: string;
    action?: string;
    isNetworkError: boolean;
}

class ErrorMessageMapperService {
    isNetworkError(error: AxiosError): boolean {
        if (!error.response && error.request) {
            return true;
        }

        if (error.code === 'ECONNABORTED' ||
            error.code === 'ETIMEDOUT' ||
            error.code === 'ERR_NETWORK' ||
            error.message?.toLowerCase().includes('network error')) {
            return true;
        }

        return false;
    }

    mapError(error: AxiosError): UserFriendlyError {
        if (this.isNetworkError(error)) {
            return {
                message: 'No internet connection. Please check your network and try again.',
                action: 'Check your connection and retry',
                isNetworkError: true,
            };
        }

        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                return {
                    message: 'Your session has expired. Please log in again.',
                    action: 'Log in again',
                    isNetworkError: false,
                };
            }

            if (status === 403) {
                return {
                    message: 'You don\'t have permission to access this resource.',
                    action: 'Contact support if you believe this is an error',
                    isNetworkError: false,
                };
            }

            if (status === 404) {
                return {
                    message: 'The requested information could not be found.',
                    action: 'Try refreshing or go back',
                    isNetworkError: false,
                };
            }

            if (status >= 400 && status < 500) {
                return {
                    message: 'Something went wrong with your request. Please try again.',
                    action: 'Check your input and retry',
                    isNetworkError: false,
                };
            }

            if (status >= 500) {
                return {
                    message: 'Our servers are having trouble. Please try again in a moment.',
                    action: 'Wait a moment and retry',
                    isNetworkError: false,
                };
            }
        }

        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            return {
                message: 'The request took too long. Please check your connection and try again.',
                action: 'Check your connection and retry',
                isNetworkError: true,
            };
        }

        return {
            message: 'Something went wrong. Please try again.',
            action: 'Retry',
            isNetworkError: false,
        };
    }

    getSimpleMessage(error: AxiosError): string {
        return this.mapError(error).message;
    }

    getActionGuidance(error: AxiosError): string | undefined {
        return this.mapError(error).action;
    }
}

export const errorMessageMapper = new ErrorMessageMapperService();
