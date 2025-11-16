import type { LoginFormData, LoginResponse } from '../types/auth';

/**
 * Mock login service - Replace this with your actual API call
 * 
 * Example usage with real API:
 * ```typescript
 * const response = await fetch('/api/auth/login', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify(credentials)
 * });
 * return await response.json();
 * ```
 */
export const loginUser = async (credentials: LoginFormData): Promise<LoginResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock validation - Replace with actual API logic
    if (credentials.usernameOrEmail === 'demo@example.com' && credentials.password === 'password123') {
        return {
            success: true,
            token: 'mock-jwt-token-12345',
            user: {
                id: '1',
                email: 'demo@example.com',
                username: 'demouser',
            },
        };
    }

    // Mock error response
    return {
        success: false,
        error: 'Invalid username/email or password',
    };
};

/**
 * Store authentication token
 */
export const storeAuthToken = (token: string, rememberMe: boolean): void => {
    if (rememberMe) {
        localStorage.setItem('authToken', token);
    } else {
        sessionStorage.setItem('authToken', token);
    }
};

/**
 * Get stored authentication token
 */
export const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

/**
 * Remove authentication token
 */
export const clearAuthToken = (): void => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
};
