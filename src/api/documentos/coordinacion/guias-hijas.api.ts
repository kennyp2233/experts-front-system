import { baseUrl } from '@/api/mantenimiento/config.api';
import axios from 'axios';

// Configuración global de axios para incluir credenciales
axios.defaults.withCredentials = true;

// Interfaces
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

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    currentPage: number;
    totalPages: number;
}

// API para guías hijas
export const guiasHijasApi = {
    // Obtener todas las guías hijas con paginación
    getGuiasHijas: async (page = 1, limit = 10): Promise<PaginatedResponse<GuiaHija>> => {
        const response = await axios.get(`${baseUrl}/guia_hija?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Obtener una guía hija específica
    getGuiaHija: async (id: number): Promise<GuiaHija> => {
        const response = await axios.get(`${baseUrl}/guia_hija/${id}`);
        return response.data;
    },

    // Obtener guías hijas asociadas a una guía madre
    getGuiasHijasByGuiaMadre: async (idGuiaMadre: number): Promise<GuiaHija[]> => {
        const response = await axios.get(`${baseUrl}/guia_hija/guia-madre/${idGuiaMadre}`);
        return response.data;
    },

    // Obtener guías hijas asociadas a una finca
    getGuiasHijasByFinca: async (idFinca: number): Promise<GuiaHija[]> => {
        const response = await axios.get(`${baseUrl}/guia_hija/finca/${idFinca}`);
        return response.data;
    },

    // Verificar si existe una guía hija para una combinación finca-guía madre
    verificarGuiaHija: async (idFinca: number, idGuiaMadre: number): Promise<{ exists: boolean; guiaHija?: GuiaHija }> => {
        const response = await axios.get(`${baseUrl}/guia_hija/verificar/${idFinca}/${idGuiaMadre}`);
        return response.data;
    },

    // Asignar una guía hija (crear)
    asignarGuiaHija: async (data: { id_documento_coordinacion: number; id_finca: number; id_guia_madre: number }): Promise<GuiaHija> => {
        const response = await axios.post(`${baseUrl}/guia_hija/asignar`, data);
        return response.data;
    },

    // Descargar PDF de una guía hija
    descargarPdfGuiaHija: async (id: number): Promise<Blob> => {
        const response = await axios.get(`${baseUrl}/guia_hija/${id}/pdf`, {
            responseType: 'blob'
        });
        return response.data;
    }
};

// API para documentos de coordinación
export const documentosCoordinacionApi = {
    // Obtener todos los documentos de coordinación con paginación y filtros
    getDocumentos: async (page = 1, limit = 10, filtros = {}): Promise<PaginatedResponse<any>> => {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...filtros as any
        });

        const response = await axios.get(`${baseUrl}/asignacion?${queryParams}`);
        return response.data;
    },

    // Obtener un documento de coordinación específico
    getDocumento: async (id: number): Promise<any> => {
        const response = await axios.get(`${baseUrl}/asignacion/${id}`);
        return response.data;
    },

    // Crear un documento de coordinación
    crearDocumento: async (data: any): Promise<any> => {
        const response = await axios.post(`${baseUrl}/asignacion`, data);
        return response.data;
    },

    // Actualizar un documento de coordinación
    actualizarDocumento: async (id: number, data: any): Promise<any> => {
        const response = await axios.put(`${baseUrl}/asignacion/${id}`, data);
        return response.data;
    },

    // Eliminar un documento de coordinación
    eliminarDocumento: async (id: number): Promise<any> => {
        const response = await axios.delete(`${baseUrl}/asignacion/${id}`);
        return response.data;
    },

    // Obtener aerolíneas con guías madre disponibles
    getAerolineas: async (): Promise<any[]> => {
        const response = await axios.get(`${baseUrl}/asignacion/aerolineas`);
        return response.data;
    }
};