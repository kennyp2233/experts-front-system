// src/api/services/baseService.ts
import { apiClient } from '../httpClient';

/**
 * Clase base para servicios API
 * Proporciona métodos CRUD comunes que se pueden extender por entidad
 * 
 * @template T - Tipo de entidad que maneja el servicio
 * @template ID - Tipo del identificador de la entidad (normalmente number)
 */
export class BaseService<T, ID = number> {
    protected endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    /**
     * Obtiene todos los registros
     */
    async getAll(params?: any): Promise<T[]> {
        return apiClient.get<T[]>(this.endpoint, params);
    }

    /**
     * Obtiene un registro por su ID
     */
    async getById(id: ID): Promise<T> {
        return apiClient.get<T>(`${this.endpoint}/${id}`);
    }

    /**
     * Crea un nuevo registro
     */
    async create(data: Partial<T>): Promise<T> {
        return apiClient.post<T>(this.endpoint, data);
    }

    /**
     * Actualiza un registro existente
     */
    async update(data: Partial<T>): Promise<T> {
        return apiClient.put<T>(this.endpoint, data);
    }

    /**
     * Elimina un registro por su ID
     */
    async delete(id: ID): Promise<any> {
        return apiClient.delete(`${this.endpoint}/${id}`);
    }

    /**
     * Elimina múltiples registros por sus IDs
     */
    async deleteMany(ids: ID[]): Promise<any> {
        return apiClient.delete(this.endpoint, ids);
    }
}