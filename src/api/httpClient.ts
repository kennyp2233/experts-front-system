// src/api/httpClient.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { dispatchMenssage } from '@/utils/menssageDispatcher';

// Configuración base para todas las solicitudes
const baseURL = 'http://localhost:3001/api/v1';

// Crear instancia de axios con configuración por defecto
const axiosInstance = axios.create({
    baseURL,
    withCredentials: true, // Incluir cookies en todas las solicitudes
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar respuestas
axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Manejo centralizado de errores
        const errorMessage = (error.response?.data as any)?.msg || error.message || 'Error en la solicitud';
        console.error('Error API:', errorMessage, error);

        // Opcional: despachar mensaje de error para notificaciones
        // dispatchMenssage('error', errorMessage);

        return Promise.reject(error);
    }
);

// API Client centralizado
class ApiClient {
    // GET request
    async get<T = any>(endpoint: string, params?: any): Promise<T> {
        try {
            const config: AxiosRequestConfig = {};
            if (params) {
                config.params = params;
            }

            const response: AxiosResponse<T> = await axiosInstance.get(endpoint, config);
            return response.data;
        } catch (error) {
            console.error(`GET ${endpoint} error:`, error);
            throw error;
        }
    }

    // POST request
    async post<T = any, D = any>(endpoint: string, data?: D): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axiosInstance.post(endpoint, data);
            return response.data;
        } catch (error) {
            console.error(`POST ${endpoint} error:`, error);
            throw error;
        }
    }

    // PUT request
    async put<T = any, D = any>(endpoint: string, data?: D): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axiosInstance.put(endpoint, data);
            return response.data;
        } catch (error) {
            console.error(`PUT ${endpoint} error:`, error);
            throw error;
        }
    }

    // PATCH request
    async patch<T = any, D = any>(endpoint: string, data?: D): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axiosInstance.patch(endpoint, data);
            return response.data;
        } catch (error) {
            console.error(`PATCH ${endpoint} error:`, error);
            throw error;
        }
    }

    // DELETE request
    async delete<T = any>(endpoint: string, data?: any): Promise<T> {
        try {
            const config: AxiosRequestConfig = {};
            if (data) {
                config.data = data; // Para enviar datos en el cuerpo de DELETE
            }

            const response: AxiosResponse<T> = await axiosInstance.delete(endpoint, config);
            return response.data;
        } catch (error) {
            console.error(`DELETE ${endpoint} error:`, error);
            throw error;
        }
    }
}

// Exportar una única instancia para usar en toda la aplicación
export const apiClient = new ApiClient();

// También exportamos la URL base para compatibilidad con código existente
export const baseUrl = baseURL;