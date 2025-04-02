// src/hooks/useDocumentosBase.ts
import { useState, useCallback } from 'react';
import { documentosBaseService } from '@/api/services/documentos/documentosBaseService';

export interface Guia {
    id: number;
    id_documento_base: number;
    prefijo: number;
    secuencial: number;
}

export interface Stock {
    id: number;
    nombre: string;
}

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

export interface DocumentoBase {
    id: number;
    fecha: string;
    id_aerolinea: number | null;
    id_referencia: number | null;
    id_stock: number | null;
    guias_madre: Guia[];
    aerolinea: Aerolinea;
    referencia: any;
    stock: Stock;
}

interface UseDocumentosBaseReturn {
    documentosBase: DocumentoBase[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    fetchDocumentosBase: (params?: { id?: number; page?: number; limit?: number }) => Promise<void>;
    crearDocumento: (data: {
        documento_base: Partial<DocumentoBase>;
        n_guias: number;
        secuencial_inicial: number;
        prefijo: number;
    }) => Promise<void>;
    previewDocumento: (data: {
        documento_base: Partial<DocumentoBase>;
        n_guias: number;
        secuencial_inicial: number;
        prefijo: number;
    }) => Promise<DocumentoBase | null>;
    updateDocumento: (updatedFields: Partial<DocumentoBase>) => Promise<void>;
}

/**
 * Hook personalizado para gestionar documentos base utilizando el servicio
 * documentosBaseService.
 */
export function useDocumentosBase(): UseDocumentosBaseReturn {
    const [documentosBase, setDocumentosBase] = useState<DocumentoBase[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const fetchDocumentosBase = useCallback(
        async (params?: { id?: number; page?: number; limit?: number }) => {
            setLoading(true);
            setError(null);
            try {
                const page = params?.page || currentPage;
                const limit = params?.limit || 10;
                const filters = params?.id ? { id: params.id } : {};

                const response = await documentosBaseService.getDocumentosBase(page, limit, filters);

                setDocumentosBase(response.data || []);
                setTotalPages(response.totalPages || 1);
                setCurrentPage(response.currentPage || 1);
            } catch (err: any) {
                setError(err.message || 'Error al obtener los documentos base.');
                console.error('Error fetching documentos base:', err);
            } finally {
                setLoading(false);
            }
        },
        [currentPage]
    );

    const crearDocumento = useCallback(
        async (data: {
            documento_base: Partial<DocumentoBase>;
            n_guias: number;
            secuencial_inicial: number;
            prefijo: number;
        }) => {
            setLoading(true);
            setError(null);
            try {
                await documentosBaseService.createDocumentoBase(data);

                // Refrescar la lista después de crear
                await fetchDocumentosBase({ page: currentPage });
            } catch (err: any) {
                setError(err.message || 'Error al crear el documento base.');
                console.error('Error creating documento base:', err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [fetchDocumentosBase, currentPage]
    );

    const previewDocumento = useCallback(
        async (data: {
            documento_base: Partial<DocumentoBase>;
            n_guias: number;
            secuencial_inicial: number;
            prefijo: number;
        }): Promise<DocumentoBase | null> => {
            setLoading(true);
            setError(null);
            try {
                const documento = await documentosBaseService.previewDocumentoBase(data);
                return documento;
            } catch (err: any) {
                setError(err.message || 'Error al generar la vista previa.');
                console.error('Error previewing documento base:', err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const updateDocumento = useCallback(
        async (updatedFields: Partial<DocumentoBase>) => {
            setLoading(true);
            setError(null);
            try {
                const updatedDoc = await documentosBaseService.updateDocumentoBase(updatedFields);

                // Actualizar el estado local tras una respuesta exitosa
                setDocumentosBase((prev) =>
                    prev.map((doc) => (doc.id === updatedFields.id ? { ...doc, ...updatedDoc } : doc))
                );
            } catch (err: any) {
                setError(err.message || 'Error al actualizar el documento base.');
                console.error('Error updating documento base:', err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        documentosBase,
        loading,
        error,
        currentPage,
        totalPages,
        fetchDocumentosBase,
        crearDocumento,
        previewDocumento,
        updateDocumento,
    };
}