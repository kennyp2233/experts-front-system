// src/api/services/authService.ts
import { apiClient } from '../httpClient';

export interface User {
    id: string;
    roles: string[];
    nombre?: string;
    email?: string;
    empresa?: string;
    telefono?: string;
    // Añade más propiedades según necesites
}

export interface LoginResponse {
    ok: boolean;
    token?: string;
    user?: User;
    msg?: string;
}

export interface RegisterParams {
    usuario: string;
    email: string;
    pass: string;
    nombre: string;
    empresa: string;
    telefono: string;
    selectedRole: string;
    additionalData?: any;
}

class AuthService {
    /**
     * Iniciar sesión
     */
    async login(usuario: string, pass: string, recordar: boolean = false): Promise<LoginResponse> {
        return apiClient.post<LoginResponse>('/auth/login', { usuario, pass, recordar });
    }

    /**
     * Registrar nuevo usuario
     */
    async register(params: RegisterParams): Promise<LoginResponse> {
        return apiClient.post<LoginResponse>('/auth/register', params);
    }

    /**
     * Cerrar sesión
     */
    async logout(): Promise<{ ok: boolean; msg?: string }> {
        return apiClient.post<{ ok: boolean; msg?: string }>('/auth/logout');
    }

    /**
     * Obtener información del usuario actual
     */
    async getMe(): Promise<LoginResponse> {
        return apiClient.get<LoginResponse>('/auth/me');
    }

    /**
     * Solicitar recuperación de contraseña
     */
    async forgotPassword(email: string): Promise<{ ok: boolean; msg: string }> {
        return apiClient.post<{ ok: boolean; msg: string }>('/auth/forgot-password', { email });
    }

    /**
     * Restablecer contraseña con token
     */
    async resetPassword(token: string, newPassword: string): Promise<{ ok: boolean; msg: string }> {
        return apiClient.post<{ ok: boolean; msg: string }>('/auth/reset-password', { token, password: newPassword });
    }
}

// Exportar una instancia única
export const authService = new AuthService();