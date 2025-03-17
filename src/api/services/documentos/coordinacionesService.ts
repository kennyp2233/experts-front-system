// src/api/services/coordinacionesService.ts
import { BaseService } from "../baseService";
import { apiClient } from "@/api/httpClient";

// Interfaces
export interface CoordinationDocument {
    id: number;
    id_guia_madre: number;
    id_consignatario: number;
    id_producto: number;
    id_agencia_iata: number;
    id_destino_awb: number;
    id_destino_final_docs: number;
    pago: string;
    fecha_vuelo: Date;
    fecha_asignacion: Date;
    from1?: number;
    to1?: number;
    by1?: number;
    to2?: number;
    by2?: number;
    to3?: number;
    by3?: number;
    costo_guia_valor?: number;
    combustible_valor?: number;
    seguridad_valor?: number;
    aux_calculo_valor?: number;
    otros_valor?: number;
    aux1_valor?: number;
    aux2_valor?: number;
    tarifa_rate?: number;
    char_weight?: number;
    form_a?: number;
    transport?: number;
    pca?: number;
    fitos?: number;
    termografo?: number;
    mca?: number;
    tax?: number;
    createdAt: Date;
    updatedAt: Date;
    busqueda_guias_madres: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    currentPage: number;
    totalPages: number;
}

class CoordinacionesService extends BaseService<CoordinationDocument> {
    constructor() {
        super('/asignacion');
    }

    /**
     * Obtener documentos con paginación
     */
    async getDocuments(page = 1, limit = 10, filters = {}): Promise<PaginatedResponse<CoordinationDocument>> {
        const params = {
            page,
            limit,
            ...filters
        };

        return apiClient.get<PaginatedResponse<CoordinationDocument>>(this.endpoint, params);
    }

    /**
     * Crear un documento
     */
    async createDocument(document: Omit<CoordinationDocument, 'id'>): Promise<CoordinationDocument> {
        return apiClient.post<CoordinationDocument>(this.endpoint, document);
    }

    /**
     * Actualizar un documento
     */
    async updateDocument(id: number, document: Partial<CoordinationDocument>): Promise<CoordinationDocument> {
        return apiClient.put<CoordinationDocument>(`${this.endpoint}/${id}`, document);
    }

    /**
     * Eliminar un documento
     */
    async deleteDocument(id: number): Promise<{ message: string; documento: CoordinationDocument }> {
        return apiClient.delete<{ message: string; documento: CoordinationDocument }>(`${this.endpoint}/${id}`);
    }

    /**
     * Obtener aerolíneas con guías madre disponibles
     */
    async getAerolineas(): Promise<any[]> {
        return apiClient.get<any[]>(`${this.endpoint}/aerolineas`);
    }
}

// Exportar una instancia única
export const coordinacionesService = new CoordinacionesService();