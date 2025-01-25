// src/hooks/useCoordination.ts
import { useState, useCallback } from 'react';
import { coordinationApi, CoordinationDocument, PaginatedResponse } from '@/api/documentos/coordinacion/coordinacion.api';
interface UseCoordinationState {
    documents: CoordinationDocument[];
    loading: boolean;
    error: Error | null;
    pagination: {
        currentPage: number;
        totalPages: number;
        total: number;
    };
}

export const useCoordination = () => {
    const [state, setState] = useState<UseCoordinationState>({
        documents: [],
        loading: false,
        error: null,
        pagination: {
            currentPage: 1,
            totalPages: 1,
            total: 0
        }
    });

    const fetchDocuments = useCallback(async (page = 1, limit = 10) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const response = await coordinationApi.getDocuments(page, limit);
            setState(prev => ({
                ...prev,
                documents: response.data,
                pagination: {
                    currentPage: response.currentPage,
                    totalPages: response.totalPages,
                    total: response.total
                },
                loading: false
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error as Error,
                loading: false
            }));
        }
    }, []);

    const createDocument = useCallback(async (document: Omit<CoordinationDocument, 'id'>) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const newDocument = await coordinationApi.createDocument(document);
            setState(prev => ({
                ...prev,
                documents: [...prev.documents, newDocument],
                loading: false
            }));
            return newDocument;
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error as Error,
                loading: false
            }));
            throw error;
        }
    }, []);

    const updateDocument = useCallback(async (id: number, document: Partial<CoordinationDocument>) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const updatedDocument = await coordinationApi.updateDocument(id, document);
            setState(prev => ({
                ...prev,
                documents: prev.documents.map(doc =>
                    doc.id === id ? updatedDocument : doc
                ),
                loading: false
            }));
            return updatedDocument;
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error as Error,
                loading: false
            }));
            throw error;
        }
    }, []);

    const deleteDocument = useCallback(async (id: number) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            await coordinationApi.deleteDocument(id);
            setState(prev => ({
                ...prev,
                documents: prev.documents.filter(doc => doc.id !== id),
                loading: false
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error as Error,
                loading: false
            }));
            throw error;
        }
    }, []);

    return {
        ...state,
        fetchDocuments,
        createDocument,
        updateDocument,
        deleteDocument
    };
};
