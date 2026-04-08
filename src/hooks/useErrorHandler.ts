import { AxiosError } from 'axios';
import { errorMessageMapper } from '../services/errorMessageMapper';

export interface ErrorDisplayInfo {
    message: string;
    icon: string;
    actionText: string;
    isNetworkError: boolean;
}

export function useErrorHandler() {
    const getErrorDisplayInfo = (error: unknown): ErrorDisplayInfo => {
        if (error && typeof error === 'object' && 'isAxiosError' in error) {
            const axiosError = error as AxiosError;
            const errorInfo = errorMessageMapper.mapError(axiosError);

            return {
                message: errorInfo.message,
                icon: errorInfo.isNetworkError ? '📡' : '⚠️',
                actionText: errorInfo.isNetworkError ? 'Retry' : 'Try Again',
                isNetworkError: errorInfo.isNetworkError,
            };
        }

        if (error instanceof Error) {
            return {
                message: 'Something went wrong. Please try again.',
                icon: '⚠️',
                actionText: 'Try Again',
                isNetworkError: false,
            };
        }

        return {
            message: 'An unexpected error occurred. Please try again.',
            icon: '⚠️',
            actionText: 'Try Again',
            isNetworkError: false,
        };
    };

    const getErrorMessage = (error: unknown): string => {
        return getErrorDisplayInfo(error).message;
    };

    const isNetworkError = (error: unknown): boolean => {
        if (error && typeof error === 'object' && 'isAxiosError' in error) {
            const axiosError = error as AxiosError;
            return errorMessageMapper.isNetworkError(axiosError);
        }
        return false;
    };

    return {
        getErrorDisplayInfo,
        getErrorMessage,
        isNetworkError,
    };
}
