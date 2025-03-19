// src/api/services/aerolineasService.ts
import { BaseService } from '../baseService';
import { apiClient } from '../../httpClient';

class AerolineasService extends BaseService<any> {
    constructor() {
        super('/aerolineas');
    }

    async getAerolineas(): Promise<any[]> {
        return apiClient.get<any[]>(this.endpoint);
    }

    /**
     * Obtener aerolíneas con todas sus relaciones
     */
    async getAerolineasJoinAll(): Promise<any[]> {
        return apiClient.get<any[]>(`${this.endpoint}/joinAll`);
    }

    async findOneComplete(id: number): Promise<any> {
        return apiClient.get<any>(`${this.endpoint}/joinAll/${id}`);
    }

    /**
     * Actualizar aerolínea con relaciones (PATCH)
     */
    async updateAerolineaJoinAll(aerolinea: Partial<any>): Promise<any> {
        return apiClient.patch<any>(`${this.endpoint}/joinAll`, aerolinea);
    }

    /**
     * Crear aerolínea con relaciones
     */
    async createAerolineaJoinAll(aerolinea: Partial<any>): Promise<any> {
        return apiClient.post<any>(`${this.endpoint}/joinAll`, aerolinea);
    }

    /**
     * Eliminar aerolíneas con relaciones
     */
    async deleteAerolineasJoinAll(ids: number[]): Promise<any> {
        return apiClient.delete<any>(`${this.endpoint}/joinAll`, ids);
    }
}

// Exportar una instancia única
export const aerolineasService = new AerolineasService();