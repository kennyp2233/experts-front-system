// src/contexts/CentroGuiasContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { coordinacionesService } from '@/api/services/documentos/coordinacionesService';
import { fincasService } from '@/api/services/mantenimiento/fincasService';
import { productosService } from '@/api/services/mantenimiento/productosService';
import { guiasMadreService } from '@/api/services/documentos/guiasMadreService';
import { guiasHijasService } from '@/api/services/documentos/guiasHijasService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

interface CentroGuiasContextType {
    // Datos principales
    documentos: any[];
    fincas: any[];
    productos: any[];
    guiasMadre: any[];
    guiasHijas: any[];

    // Estado de carga
    loading: boolean;
    error: string | null;

    // Estado y navegación
    selectedDocumentoId: number | null;
    selectedFinca: any | null;
    selectedGuiaMadre: any | null;
    pagination: Pagination;

    // Funciones principales
    setSelectedDocumentoId: (id: number | null) => void;
    setSelectedFinca: (finca: any | null) => void;
    setSelectedGuiaMadre: (guia: any | null) => void;
    refreshDocumentos: () => Promise<void>;
    refreshGuiasMadre: () => Promise<void>;
    refreshGuiasHijas: () => Promise<void>;

    // Funciones auxiliares
    buscarGuiaMadre: (prefijo: number, secuencial: number) => Promise<any>;
    asignarGuiaHija: (asignacion: any) => Promise<any>;
    setCurrentPage: (page: number) => void;

    // Filtros y opciones
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    showCompletedDocs: boolean;
    setShowCompletedDocs: (show: boolean) => void;
}

const CentroGuiasContext = createContext<CentroGuiasContextType | undefined>(undefined);

export const CentroGuiasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Estados para datos
    const [documentos, setDocumentos] = useState<any[]>([]);
    const [fincas, setFincas] = useState<any[]>([]);
    const [productos, setProductos] = useState<any[]>([]);
    const [guiasMadre, setGuiasMadre] = useState<any[]>([]);
    const [guiasHijas, setGuiasHijas] = useState<any[]>([]);

    // Estados para selecciones
    const [selectedDocumentoId, setSelectedDocumentoId] = useState<number | null>(null);
    const [selectedFinca, setSelectedFinca] = useState<any | null>(null);
    const [selectedGuiaMadre, setSelectedGuiaMadre] = useState<any | null>(null);

    // Estados para UI
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });

    // Filtros y opciones
    const [searchTerm, setSearchTerm] = useState('');
    const [showCompletedDocs, setShowCompletedDocs] = useState(true);

    // Cargar datos iniciales
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [
                    fincasData,
                    productosData
                ] = await Promise.all([
                    fincasService.getFincas(),
                    productosService.getProductos()
                ]);

                setFincas(fincasData);
                setProductos(productosData);

                // Cargar documentos de coordinación iniciales
                await refreshDocumentos();

            } catch (error) {
                console.error('Error cargando datos para Centro de Guías:', error);
                setError('Error al cargar datos iniciales');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Cambiar página y actualizar datos
    const setCurrentPage = (page: number) => {
        setPagination(prev => ({
            ...prev,
            currentPage: page
        }));

        // Esto activará useEffect para recargar datos
    };

    // Refrescar documentos de coordinación con filtros
    const refreshDocumentos = async () => {
        setLoading(true);
        try {
            const filters: any = {};

            // Aplicar filtros
            if (searchTerm) {
                if (!isNaN(Number(searchTerm))) {
                    filters.id = Number(searchTerm);
                } else {
                    filters.search = searchTerm;
                }
            }

            if (!showCompletedDocs) {
                filters.pendientes = true;
            }

            const response = await coordinacionesService.getDocuments(
                pagination.currentPage,
                10,
                filters
            );

            // Mejorar datos con información adicional
            const enhancedData = response.data.map(doc => {
                const consignatario = fincas.find(c => c.id_consignatario === doc.id_consignatario);
                const producto = productos.find(p => p.id_producto === doc.id_producto);

                return {
                    ...doc,
                    consignatarioNombre: consignatario ? consignatario.nombre : 'No asignado',
                    productoNombre: producto ? producto.nombre : 'No asignado',
                    cooLabel: `COO-${doc.id.toString().padStart(7, '0')}`
                };
            });

            setDocumentos(enhancedData);
            setPagination({
                currentPage: response.currentPage || 1,
                totalPages: response.totalPages || 1,
                totalItems: response.total || 0
            });

        } catch (error) {
            console.error('Error al refrescar documentos:', error);
            setError('Error al actualizar los documentos');
            dispatchMenssage('error', 'Error al cargar documentos');
        } finally {
            setLoading(false);
        }
    };

    // Refrescar guías madre
    const refreshGuiasMadre = async () => {
        setLoading(true);
        try {
            const data = await guiasMadreService.getGuiasMadre();
            setGuiasMadre(data);
        } catch (error) {
            console.error('Error al cargar guías madre:', error);
            setError('Error al actualizar las guías madre');
            dispatchMenssage('error', 'Error al cargar guías madre');
        } finally {
            setLoading(false);
        }
    };

    // Refrescar guías hijas
    const refreshGuiasHijas = async () => {
        setLoading(true);
        try {
            const response = await guiasHijasService.getGuiasHijas(pagination.currentPage, 10);
            setGuiasHijas(response.data);
            setPagination({
                currentPage: response.currentPage || 1,
                totalPages: response.totalPages || 1,
                totalItems: response.total || 0
            });
        } catch (error) {
            console.error('Error al cargar guías hijas:', error);
            setError('Error al actualizar las guías hijas');
            dispatchMenssage('error', 'Error al cargar guías hijas');
        } finally {
            setLoading(false);
        }
    };

    // Buscar guía madre por prefijo y secuencial
    const buscarGuiaMadre = async (prefijo: number, secuencial: number) => {
        try {
            // Primero intentar buscarlo en los datos locales
            const localGuia = guiasMadre.find(g =>
                g.prefijo === prefijo && g.secuencial === secuencial
            );

            if (localGuia) return localGuia;

            // Si no está en los datos locales, buscarlo en el servidor
            const allGuias = await guiasMadreService.getGuiasMadre();
            const guia = allGuias.find(g =>
                g.prefijo === prefijo && g.secuencial === secuencial
            );

            if (guia) {
                // Actualizar la lista local
                setGuiasMadre(prevGuias => {
                    const exists = prevGuias.some(g => g.id === guia.id);
                    return exists ? prevGuias : [...prevGuias, guia];
                });
                return guia;
            }

            return null;
        } catch (error) {
            console.error('Error al buscar guía madre:', error);
            dispatchMenssage('error', 'Error al buscar guía madre');
            return null;
        }
    };

    // Asignar guía hija
    const asignarGuiaHija = async (asignacion: any) => {
        try {
            const result = await guiasHijasService.asignarGuiaHija(asignacion);
            // Actualizar la lista local
            await refreshGuiasHijas();
            return result;
        } catch (error) {
            console.error('Error al asignar guía hija:', error);
            dispatchMenssage('error', 'Error al asignar guía hija');
            throw error;
        }
    };

    // Efectos para actualizaciones
    useEffect(() => {
        // Recargar documentos cuando cambia la página o filtros
        if (!loading) refreshDocumentos();
    }, [pagination.currentPage, searchTerm, showCompletedDocs]);

    // Valor del contexto
    const contextValue: CentroGuiasContextType = {
        documentos,
        fincas,
        productos,
        guiasMadre,
        guiasHijas,
        loading,
        error,
        selectedDocumentoId,
        selectedFinca,
        selectedGuiaMadre,
        pagination,
        setSelectedDocumentoId,
        setSelectedFinca,
        setSelectedGuiaMadre,
        refreshDocumentos,
        refreshGuiasMadre,
        refreshGuiasHijas,
        buscarGuiaMadre,
        asignarGuiaHija,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        showCompletedDocs,
        setShowCompletedDocs
    };

    return (
        <CentroGuiasContext.Provider value={contextValue}>
            {children}
        </CentroGuiasContext.Provider>
    );
};

export const useCentroGuias = () => {
    const context = useContext(CentroGuiasContext);
    if (context === undefined) {
        throw new Error('useCentroGuias debe ser usado dentro de un CentroGuiasProvider');
    }
    return context;
};