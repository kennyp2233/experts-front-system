// src/api/services/documentos/guiasMadreService.ts
import { BaseService } from '../baseService';
import { apiClient } from '@/api/httpClient';

export interface GuiaMadre {
    id: number;
    id_documento_base: number;
    prefijo: number;
    secuencial: number;
    prestado: boolean;
    fecha_prestamo?: string;
    fecha_devolucion?: string;
    observaciones_prestamo?: string;
    createdAt: string;
    updatedAt: string;
}

class GuiasMadreService extends BaseService<GuiaMadre> {
    constructor() {
        super('/guia_madre');
    }

    /**
     * Obtener todas las guías madre
     */
    async getGuiasMadre(): Promise<GuiaMadre[]> {
        return apiClient.get<GuiaMadre[]>(this.endpoint);
    }

    /**
     * Obtener una guía madre por ID
     */
    async getGuiaMadreById(id: number): Promise<GuiaMadre> {
        return apiClient.get<GuiaMadre>(`${this.endpoint}/${id}`);
    }

    /**
     * Obtener guías madre por ID de aerolínea
     */
    async getGuiasMadrePorAerolinea(aerolineaId: number): Promise<GuiaMadre[]> {
        return apiClient.get<GuiaMadre[]>(`${this.endpoint}/aerolinea/${aerolineaId}`);
    }

    /**
     * Crear una nueva guía madre
     */
    async crearGuiaMadre(guia: Partial<GuiaMadre>): Promise<GuiaMadre> {
        return apiClient.post<GuiaMadre>(this.endpoint, guia);
    }

    /**
     * Actualizar una guía madre
     */
    async actualizarGuiaMadre(id: number, guia: Partial<GuiaMadre>): Promise<GuiaMadre> {
        return apiClient.put<GuiaMadre>(`${this.endpoint}/${id}`, guia);
    }

    /**
     * Marcar una guía madre como prestada
     */
    async prestarGuiaMadre(id: number, observaciones?: string): Promise<GuiaMadre> {
        return apiClient.post<GuiaMadre>(`${this.endpoint}/${id}/prestar`, { observaciones });
    }

    /**
     * Marcar una guía madre como devuelta
     */
    async devolverGuiaMadre(id: number): Promise<GuiaMadre> {
        return apiClient.post<GuiaMadre>(`${this.endpoint}/${id}/devolver`);
    }
}

// Exportar una instancia única
export const guiasMadreService = new GuiasMadreService();