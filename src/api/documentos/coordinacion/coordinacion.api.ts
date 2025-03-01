// src/services/coordinationApi.ts
import axios from 'axios';
import { baseUrl } from '@/api/mantenimiento/config.api';

axios.defaults.withCredentials = true;


export interface CoordinationDocument {
    id: number;
    id_guia_madre: number;
    id_consignatario: number;
    id_producto: number;
    //-----------------------------------
    id_agencia_iata: number;
    id_destino_awb: number;
    id_destino_final_docs: number;
    pago: string;
    fecha_vuelo: Date;
    fecha_asignacion: Date;
    //-----------------------------------
    from1?: number;
    to1?: number;
    by1?: number;
    to2?: number;
    by2?: number;
    to3?: number;
    by3?: number;
    //-----------------------------------
    costo_guia_valor?: number;
    combustible_valor?: number;
    seguridad_valor?: number;
    aux_calculo_valor?: number;
    otros_valor?: number;
    aux1_valor?: number;
    aux2_valor?: number;
    //-----------------------------------
    tarifa_rate?: number;
    char_weight?: number;
    //-----------------------------------
    form_a?: number;
    transport?: number;
    pca?: number;
    fitos?: number;
    termografo?: number;
    mca?: number;
    tax?: number;
    //-----------------------------------
    createdAt: Date;
    updatedAt: Date;
    //-----------------------------------
    busqueda_guias_madres: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    currentPage: number;
    totalPages: number;
}

export const coordinationApi = {
    getDocuments: async (page = 1, limit = 10): Promise<PaginatedResponse<CoordinationDocument>> => {
        const response = await axios.get(`${baseUrl}/asignacion?page=${page}&limit=${limit}`);
        return response.data;
    },

    createDocument: async (document: Omit<CoordinationDocument, 'id'>): Promise<CoordinationDocument> => {
        const response = await axios.post(baseUrl, document);
        return response.data;
    },

    updateDocument: async (id: number, document: Partial<CoordinationDocument>): Promise<CoordinationDocument> => {
        const response = await axios.put(`${baseUrl}/asignacion/${id}`, document);
        return response.data;
    },

    deleteDocument: async (id: number): Promise<{ message: string; documento: CoordinationDocument }> => {
        const response = await axios.delete(`${baseUrl}/asignacion/${id}`);
        return response.data;
    }
};