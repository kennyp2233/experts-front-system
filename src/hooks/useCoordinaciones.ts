// src/hooks/useCoordinaciones.ts
// Este es un ejemplo de cómo podrías implementar un hook que utilice los servicios
// No necesitas implementar esto para la página actual, ya estamos usando los servicios directamente

import { useState, useCallback } from 'react';
import { coordinacionesService, CoordinationDocument } from '@/api/services/documentos/coordinacionesService';
import { guiasHijasService, GuiaHija } from '@/api/services/documentos/guiasHijasService';

interface UseCoordinacionesReturn {
    coordinaciones: CoordinationDocument[];
    isLoading: boolean;
    error: Error | null;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    fetchCoordinaciones: (page?: number, limit?: number) => Promise<void>;
    createCoordinacion: (data: Omit<CoordinationDocument, 'id'>) => Promise<CoordinationDocument>;
    updateCoordinacion: (id: number, data: Partial<CoordinationDocument>) => Promise<CoordinationDocument>;
    deleteCoordinacion: (id: number) => Promise<void>;
    asignarGuiaHija: (data: { id_documento_coordinacion: number; id_finca: number; id_guia_madre: number }) => Promise<GuiaHija>;
    descargarPdfGuiaHija: (id: number) => Promise<Blob>;
}

export const useCoordinaciones = (): UseCoordinacionesReturn => {
    const [coordinaciones, setCoordinaciones] = useState<CoordinationDocument[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });

    // Obtener lista de coordinaciones
    const fetchCoordinaciones = useCallback(async (page = 1, limit = 10) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await coordinacionesService.getDocuments(page, limit);
            setCoordinaciones(response.data);
            setPagination({
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalItems: response.total
            });
        } catch (error) {
            setError(error as Error);
            console.error('Error al obtener coordinaciones:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Crear nueva coordinación
    const createCoordinacion = useCallback(async (data: Omit<CoordinationDocument, 'id'>): Promise<CoordinationDocument> => {
        setIsLoading(true);
        try {
            const newCoordinacion = await coordinacionesService.createDocument(data);
            // Opcional: actualizar el estado local si es necesario
            setCoordinaciones(prev => [...prev, newCoordinacion]);
            return newCoordinacion;
        } catch (error) {
            setError(error as Error);
            console.error('Error al crear coordinación:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Actualizar coordinación existente
    const updateCoordinacion = useCallback(async (id: number, data: Partial<CoordinationDocument>): Promise<CoordinationDocument> => {
        setIsLoading(true);
        try {
            const updatedCoordinacion = await coordinacionesService.updateDocument(id, data);
            // Actualizar el estado local
            setCoordinaciones(prev =>
                prev.map(item => item.id === id ? updatedCoordinacion : item)
            );
            return updatedCoordinacion;
        } catch (error) {
            setError(error as Error);
            console.error('Error al actualizar coordinación:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Eliminar coordinación
    const deleteCoordinacion = useCallback(async (id: number): Promise<void> => {
        setIsLoading(true);
        try {
            await coordinacionesService.deleteDocument(id);
            // Actualizar el estado local
            setCoordinaciones(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            setError(error as Error);
            console.error('Error al eliminar coordinación:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Asignar guía hija
    const asignarGuiaHija = useCallback(async (data: {
        id_documento_coordinacion: number;
        id_finca: number;
        id_guia_madre: number
    }): Promise<GuiaHija> => {
        setIsLoading(true);
        try {
            const guiaHija = await guiasHijasService.asignarGuiaHija(data);
            return guiaHija;
        } catch (error) {
            setError(error as Error);
            console.error('Error al asignar guía hija:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Descargar PDF de guía hija
    const descargarPdfGuiaHija = useCallback(async (id: number): Promise<Blob> => {
        setIsLoading(true);
        try {
            const pdfBlob = await guiasHijasService.descargarPdfGuiaHija(id);
            return pdfBlob;
        } catch (error) {
            setError(error as Error);
            console.error('Error al descargar PDF:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        coordinaciones,
        isLoading,
        error,
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        fetchCoordinaciones,
        createCoordinacion,
        updateCoordinacion,
        deleteCoordinacion,
        asignarGuiaHija,
        descargarPdfGuiaHija
    };
};