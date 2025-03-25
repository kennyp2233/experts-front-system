// src/components/sistema/centro_guias_components/hooks/useDocumentosCoordinacion.ts
import { useState, useEffect, useCallback } from 'react';
import { coordinacionesService } from '@/api/services/documentos/coordinacionesService';
import { consignatarioService } from '@/api/services/mantenimiento/consignatarioService';
import { productosService } from '@/api/services/mantenimiento/productosService';
import { useCatalogosCoordinaciones } from './useCatalogosCoordinaciones';
import { dispatchMenssage } from '@/utils/menssageDispatcher';

export const useDocumentosCoordinacion = (initialId?: string) => {
    // Estados
    const [documentos, setDocumentos] = useState<any[]>([]);
    const [selectedDocumento, setSelectedDocumento] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [filtro, setFiltro] = useState<string>('');
    const [estadoFiltro, setEstadoFiltro] = useState<string>('todos');
    const [sorting, setSorting] = useState<{ field: string, direction: 'asc' | 'desc' }>({
        field: 'createdAt',
        direction: 'desc'
    });

    // Catálogos para enriquecer los datos
    const {
        consignatarios,
        productos,
        loading: loadingCatalogs
    } = useCatalogosCoordinaciones();

    // Cargar documentos con paginación y filtros
    const fetchDocumentos = useCallback(async () => {
        setLoading(true);
        try {
            // Construir filtros
            const filters: any = {};

            // Filtro de búsqueda (ID o consignatario)
            if (filtro) {
                if (!isNaN(Number(filtro))) {
                    filters.id = Number(filtro);
                }
            }

            // Filtro por estado
            if (estadoFiltro !== 'todos') {
                filters.estado = estadoFiltro;
            }

            // Ordenamiento
            filters.sortField = sorting.field;
            filters.sortDirection = sorting.direction;

            const response = await coordinacionesService.getDocuments(currentPage, 10, filters);

            // Transformar datos para mostrar información legible
            const formattedData = response.data.map(doc => {
                const consignatario = consignatarios.find(c => c.id_consignatario === doc.id_consignatario);
                const producto = productos.find(p => p.id_producto === doc.id_producto);

                return {
                    ...doc,
                    consignatarioNombre: consignatario ? consignatario.nombre : 'No asignado',
                    productoNombre: producto ? producto.nombre : 'No asignado',
                    cooLabel: `COO-${doc.id.toString().padStart(7, '0')}`
                };
            });

            setDocumentos(formattedData);
            setTotalPages(response.totalPages);
            setError(null);
        } catch (err) {
            console.error('Error al cargar documentos de coordinación:', err);
            setError('No se pudieron cargar los documentos de coordinación');
            dispatchMenssage('error', 'Error al cargar los documentos de coordinación');
        } finally {
            setLoading(false);
        }
    }, [currentPage, filtro, estadoFiltro, sorting, consignatarios, productos]);

    // Cargar documentos cuando cambien los filtros o paginación
    useEffect(() => {
        if (!loadingCatalogs) {
            fetchDocumentos();
        }
    }, [fetchDocumentos, loadingCatalogs]);

    // Cargar documento inicial si se proporciona un ID
    useEffect(() => {
        if (initialId && !isNaN(Number(initialId))) {
            fetchDocumentoById(Number(initialId));
        }
    }, [initialId]);

    // Buscar documento por ID
    const fetchDocumentoById = async (id: number) => {
        setLoading(true);
        try {
            const response = await coordinacionesService.findOne(id);

            if (response) {
                setSelectedDocumento(response);
                return response;
            } else {
                setError('No se encontró el documento especificado');
                return null;
            }
        } catch (error) {
            console.error('Error al cargar documento específico:', error);
            setError('Error al cargar el documento');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Borrar un documento
    const deleteDocumento = async (id: number) => {
        try {
            await coordinacionesService.deleteDocument(id);

            dispatchMenssage('success', 'Documento eliminado correctamente');

            // Si estamos viendo el documento eliminado, limpiar selección
            if (selectedDocumento?.id === id) {
                setSelectedDocumento(null);
            }

            // Actualizar la lista
            fetchDocumentos();

            return true;
        } catch (error) {
            console.error('Error al eliminar documento:', error);
            dispatchMenssage('error', 'Error al eliminar el documento');
            return false;
        }
    };

    // Cambiar ordenamiento
    const handleSort = (field: string) => {
        setSorting(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    return {
        documentos,
        selectedDocumento,
        loading,
        error,
        currentPage,
        totalPages,
        filtro,
        estadoFiltro,
        sorting,
        setCurrentPage,
        setFiltro,
        setEstadoFiltro,
        fetchDocumentos,
        fetchDocumentoById,
        deleteDocumento,
        handleSort,
        setSelectedDocumento
    };
};