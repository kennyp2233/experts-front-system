// src/api/services/aerolineasService.ts
import { BaseService } from '../baseService';
import { apiClient } from '../../httpClient';

// Definir interface para Aerolinea
export interface Aerolinea {
    id_aerolinea: number;
    nombre: string;
    ci_ruc: string;
    direccion: string;
    telefono: string;
    email: string;
    ciudad: string;
    pais: string;
    contacto: string;
    id_modo: number;
    maestra_guias_hijas: any[];
    codigo: string;
    prefijo_awb: string;
    codigo_cae: string;
    estado_activo: boolean;
    from1: string;
    to1: string;
    by1: string;
    to2: string;
    by2: string;
    to3: string;
    by3: string;
    afiliado_cass: string;
    guias_virtuales: any[];
}

class AerolineasService extends BaseService<Aerolinea> {
    constructor() {
        super('/aerolineas');
    }

    async getAerolineas(): Promise<Aerolinea[]> {
        return apiClient.get<Aerolinea[]>(this.endpoint);
    }

    /**
     * Obtener aerolíneas con todas sus relaciones
     */
    async getAerolineasJoinAll(): Promise<any[]> {
        return apiClient.get<any[]>(`${this.endpoint}/joinAll`);
    }

    /**
     * Actualizar aerolínea con relaciones (PATCH)
     */
    async updateAerolineaJoinAll(aerolinea: Partial<Aerolinea>): Promise<Aerolinea> {
        return apiClient.patch<Aerolinea>(`${this.endpoint}/joinAll`, aerolinea);
    }

    /**
     * Crear aerolínea con relaciones
     */
    async createAerolineaJoinAll(aerolinea: Partial<Aerolinea>): Promise<Aerolinea> {
        return apiClient.post<Aerolinea>(`${this.endpoint}/joinAll`, aerolinea);
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