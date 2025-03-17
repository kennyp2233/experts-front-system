// src/api/services/guiasHijasService.ts
import { BaseService } from '../baseService';
import { apiClient, baseUrl } from '@/api/httpClient';
import { PaginatedResponse } from './coordinacionesService';

// Interface para GuiaHija
export interface GuiaHija {
    id: number;
    id_documento_coordinacion: number;
    id_guia_madre: number;
    id_finca: number;
    numero_guia_hija: string;
    anio: number;
    secuencial: number;
    createdAt: string;
    updatedAt: string;
    finca?: any;
    guia_madre?: any;
    documento_coordinacion?: any;
}

class GuiasHijasService extends BaseService<GuiaHija> {
    constructor() {
        super('/guia_hija');
    }

    /**
     * Obtener guías hijas con paginación
     */
    async getGuiasHijas(page = 1, limit = 10): Promise<PaginatedResponse<GuiaHija>> {
        return apiClient.get<PaginatedResponse<GuiaHija>>(this.endpoint, { page, limit });
    }

    /**
     * Obtener guías hijas asociadas a una guía madre
     */
    async getGuiasHijasByGuiaMadre(idGuiaMadre: number): Promise<GuiaHija[]> {
        return apiClient.get<GuiaHija[]>(`${this.endpoint}/guia-madre/${idGuiaMadre}`);
    }

    /**
     * Obtener guías hijas asociadas a una finca
     */
    async getGuiasHijasByFinca(idFinca: number): Promise<GuiaHija[]> {
        return apiClient.get<GuiaHija[]>(`${this.endpoint}/finca/${idFinca}`);
    }

    /**
     * Verificar si existe una guía hija para una combinación finca-guía madre
     */
    async verificarGuiaHija(idFinca: number, idGuiaMadre: number): Promise<{ exists: boolean; guiaHija?: GuiaHija }> {
        return apiClient.get<{ exists: boolean; guiaHija?: GuiaHija }>(`${this.endpoint}/verificar/${idFinca}/${idGuiaMadre}`);
    }

    /**
     * Asignar una guía hija (crear)
     */
    async asignarGuiaHija(data: { id_documento_coordinacion: number; id_finca: number; id_guia_madre: number }): Promise<GuiaHija> {
        return apiClient.post<GuiaHija>(`${this.endpoint}/asignar`, data);
    }

    /**
     * Descargar PDF de una guía hija
     */
    async descargarPdfGuiaHija(id: number): Promise<Blob> {
        // Para descargas de archivos necesitamos configuración especial
        const response = await fetch(`${baseUrl}${this.endpoint}/${id}/pdf`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/pdf',
            },
        });

        if (!response.ok) {
            throw new Error('Error al descargar el PDF');
        }

        return await response.blob();
    }
}

// Exportar una instancia única
export const guiasHijasService = new GuiasHijasService();