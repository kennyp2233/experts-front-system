// src/api/services/documentos/documentosBaseService.ts
import { BaseService } from '../baseService';
import { apiClient } from '@/api/httpClient';
import { DocumentoBase, Guia } from '@/hooks/useDocumentosBase';

interface DocBaseCreationParams {
    documento_base: Partial<DocumentoBase>;
    n_guias: number;
    secuencial_inicial: number;
    prefijo: number;
}

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    currentPage: number;
    totalPages: number;
}

class DocumentosBaseService extends BaseService<DocumentoBase> {
    constructor() {
        super('/documentos_base');
    }

    /**
     * Obtener todos los documentos base con paginación
     */
    async getDocumentosBase(page = 1, limit = 10, filters = {}): Promise<PaginatedResponse<DocumentoBase>> {
        const params = {
            page,
            limit,
            ...filters
        };
        return apiClient.get<PaginatedResponse<DocumentoBase>>(this.endpoint, params);
    }

    /**
     * Obtener un documento base específico por ID
     */
    async getDocumentoBase(id: number): Promise<DocumentoBase> {
        return apiClient.get<DocumentoBase>(`${this.endpoint}/${id}`);
    }

    /**
     * Crear un nuevo documento base con sus guías
     */
    async createDocumentoBase(params: DocBaseCreationParams): Promise<DocumentoBase> {
        return apiClient.post<DocumentoBase>(this.endpoint, params);
    }

    /**
     * Obtener una vista previa del documento base a crear (sin guardarlo)
     */
    async previewDocumentoBase(params: DocBaseCreationParams): Promise<DocumentoBase> {
        return apiClient.post<DocumentoBase>(`${this.endpoint}/preview`, params);
    }

    /**
     * Actualizar un documento base existente
     */
    async updateDocumentoBase(documento: Partial<DocumentoBase>): Promise<DocumentoBase> {
        return apiClient.put<DocumentoBase>(this.endpoint, documento);
    }

    /**
     * Eliminar un documento base
     */
    async deleteDocumentoBase(id: number): Promise<any> {
        return apiClient.delete(`${this.endpoint}/${id}`);
    }

    /**
     * Eliminar múltiples documentos base
     */
    async deleteDocumentosBase(ids: number[]): Promise<any> {
        return apiClient.delete(this.endpoint, ids);
    }

    /**
     * Obtener las guías asociadas a un documento base
     */
    async getGuiasDocumentoBase(id: number): Promise<Guia[]> {
        return apiClient.get<Guia[]>(`${this.endpoint}/${id}/guias`);
    }
}

// Exportar una instancia única
export const documentosBaseService = new DocumentosBaseService();