export interface LoginFormData {
    usernameOrEmail: string;
    password: string;
    rememberMe: boolean;
}

export interface LoginResponse {
    success: boolean;
    error?: string;
    token?: string;
    user?: {
        id: string;
        email: string;
        username: string;
    };
}

export interface AuthError {
    message: string;
    field?: 'usernameOrEmail' | 'password' | 'general';
}
