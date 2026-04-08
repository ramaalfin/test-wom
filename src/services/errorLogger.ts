export type ErrorType = 'network' | 'api' | 'auth' | 'validation';

export interface ErrorLog {
    timestamp: string;
    type: ErrorType;
    endpoint?: string;
    method?: string;
    statusCode?: number;
    message: string;
    userId?: number;
}

class ErrorLoggerService {
    private sanitize(data: any): any {
        if (typeof data === 'string') {
            return data
                .replace(/Bearer\s+[\w-]+\.[\w-]+\.[\w-]+/gi, 'Bearer [REDACTED]')
                .replace(/token["\s:]+[\w-]+\.[\w-]+\.[\w-]+/gi, 'token: [REDACTED]')
                .replace(/password["\s:]+[^\s,}]+/gi, 'password: [REDACTED]')
                .replace(/api[_-]?key["\s:]+[^\s,}]+/gi, 'api_key: [REDACTED]');
        }

        if (typeof data === 'object' && data !== null) {
            const sanitized: any = Array.isArray(data) ? [] : {};
            for (const key in data) {
                if (key.toLowerCase().includes('password') ||
                    key.toLowerCase().includes('token') ||
                    key.toLowerCase().includes('secret') ||
                    key.toLowerCase().includes('key')) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitize(data[key]);
                }
            }
            return sanitized;
        }

        return data;
    }

    log(errorLog: Omit<ErrorLog, 'timestamp'>): void {
        const sanitizedLog: ErrorLog = {
            timestamp: new Date().toISOString(),
            type: errorLog.type,
            endpoint: errorLog.endpoint,
            method: errorLog.method,
            statusCode: errorLog.statusCode,
            message: this.sanitize(errorLog.message),
            userId: errorLog.userId,
        };

        if (typeof __DEV__ !== 'undefined' && __DEV__) {
            const prefix = this.getLogPrefix(sanitizedLog.type);
            console.error(
                `${prefix} [${sanitizedLog.timestamp}]`,
                this.formatLogMessage(sanitizedLog),
            );
        } else {
            const prefix = this.getLogPrefix(sanitizedLog.type);
            console.error(
                `${prefix} [${sanitizedLog.timestamp}]`,
                this.formatLogMessage(sanitizedLog),
            );
        }
    }

    private getLogPrefix(type: ErrorType): string {
        switch (type) {
            case 'network':
                return '🌐 [Network Error]';
            case 'api':
                return '⚠️ [API Error]';
            case 'auth':
                return '🔒 [Auth Error]';
            case 'validation':
                return '✋ [Validation Error]';
            default:
                return '❌ [Error]';
        }
    }

    private formatLogMessage(log: ErrorLog): string {
        const parts: string[] = [];

        if (log.method && log.endpoint) {
            parts.push(`${log.method} ${log.endpoint}`);
        } else if (log.endpoint) {
            parts.push(log.endpoint);
        }

        if (log.statusCode) {
            parts.push(`Status: ${log.statusCode}`);
        }

        parts.push(`Message: ${log.message}`);

        if (log.userId) {
            parts.push(`User: ${log.userId}`);
        }

        return parts.join(' | ');
    }

    logNetworkError(endpoint: string, method: string, message: string): void {
        this.log({
            type: 'network',
            endpoint,
            method,
            message,
        });
    }

    logApiError(
        endpoint: string,
        method: string,
        statusCode: number,
        message: string,
    ): void {
        this.log({
            type: 'api',
            endpoint,
            method,
            statusCode,
            message,
        });
    }

    logAuthError(message: string, endpoint?: string): void {
        this.log({
            type: 'auth',
            endpoint,
            message,
        });
    }

    logValidationError(message: string): void {
        this.log({
            type: 'validation',
            message,
        });
    }
}

export const errorLogger = new ErrorLoggerService();
