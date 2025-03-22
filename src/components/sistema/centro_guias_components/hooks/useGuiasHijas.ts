// src/components/sistema/centro_guias_components/hooks/useGuiasHijas.ts
import { useState, useEffect, useCallback } from 'react';
import { guiasHijasService, GuiaHija } from '@/api/services/documentos/guiasHijasService';
import { fincasService } from '@/api/services/mantenimiento/fincasService';
import { productosService } from '@/api/services/mantenimiento/productosService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';

interface GuiaHijaExtended extends GuiaHija {
    fincaNombre?: string;
    cooLabel?: string;
    productoNombre?: string;
}

export const useGuiasHijas = (
    initialFilters?: {
        filtroFinca?: number;
        filtroGuiaMadre?: number;
    }
) => {
    const [guiasHijas, setGuiasHijas] = useState<GuiaHijaExtended[]>([]);
    const [fincas, setFincas] = useState<any[]>([]);
    const [productos, setProductos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [fincaFilter, setFincaFilter] = useState<number | undefined>(
        initialFilters?.filtroFinca
    );
    const [guiaMadreFilter, setGuiaMadreFilter] = useState<number | undefined>(
        initialFilters?.filtroGuiaMadre
    );
    const [generating, setGenerating] = useState<boolean>(false);
    const [selectedGuia, setSelectedGuia] = useState<number | null>(null);

    // Cargar datos iniciales
    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const [fincasData, productosData] = await Promise.all([
                    fincasService.getFincas(),
                    productosService.getProductos()
                ]);

                setFincas(fincasData);
                setProductos(productosData);
            } catch (error) {
                console.error("Error cargando catálogos:", error);
                setError("Error cargando datos de catálogos");
            }
        };

        fetchCatalogs();
    }, []);

    // Función para cargar guías hijas
    const fetchGuiasHijas = useCallback(async (params?: {
        page?: number;
        limit?: number;
        filtroFinca?: number;
        filtroGuiaMadre?: number;
        maxItems?: number;
    }) => {
        setLoading(true);
        try {
            const page = params?.page || currentPage;
            const limit = params?.limit || 10;
            const filtroFinca = params?.filtroFinca || fincaFilter;
            const filtroGuiaMadre = params?.filtroGuiaMadre || guiaMadreFilter;
            const maxItems = params?.maxItems || 0;

            let guiasData: GuiaHija[] = [];

            if (filtroFinca) {
                // Si hay filtro de finca, usamos endpoint específico
                guiasData = await guiasHijasService.getGuiasHijasByFinca(filtroFinca);
                setTotalPages(1); // No hay paginación en este endpoint
            } else if (filtroGuiaMadre) {
                // Si hay filtro de guía madre, usamos endpoint específico
                guiasData = await guiasHijasService.getGuiasHijasByGuiaMadre(filtroGuiaMadre);
                setTotalPages(1); // No hay paginación en este endpoint
            } else {
                // Si no hay filtros, usamos endpoint paginado
                const response = await guiasHijasService.getGuiasHijas(page, limit);
                guiasData = response.data;
                setTotalPages(response.totalPages);
            }

            // Enriquecer datos de guías con nombres de fincas y productos
            const guiasEnriquecidas = guiasData.map((guia: GuiaHija) => {
                const finca = fincas.find(f => f.id_finca === guia.id_finca);
                const producto = productos.find(p => p.id_producto === guia.id_producto);
                return {
                    ...guia,
                    fincaNombre: finca?.nombre || 'Desconocida',
                    productoNombre: producto?.nombre || 'No especificado',
                    cooLabel: `COO-${guia.id_documento_coordinacion.toString().padStart(7, '0')}`
                };
            });

            // Si hay un límite máximo, aplicarlo
            if (maxItems > 0 && guiasEnriquecidas.length > maxItems) {
                setGuiasHijas(guiasEnriquecidas.slice(0, maxItems));
            } else {
                setGuiasHijas(guiasEnriquecidas);
            }

            setError(null);
            return guiasEnriquecidas;
        } catch (error) {
            console.error('Error al cargar guías hijas:', error);
            setError('Error al cargar guías hijas');
            dispatchMenssage('error', 'Error al cargar guías hijas');
            return [];
        } finally {
            setLoading(false);
        }
    }, [currentPage, fincaFilter, guiaMadreFilter, fincas, productos]);

    // Cargar guías hijas cuando cambian los filtros o la página
    useEffect(() => {
        fetchGuiasHijas();
    }, [fetchGuiasHijas]);

    // Descargar PDF de guía hija
    const downloadPdf = async (guiaId: number) => {
        setSelectedGuia(guiaId);
        setGenerating(true);

        try {
            const pdfBlob = await guiasHijasService.descargarPdfGuiaHija(guiaId);

            // Crear URL para descarga
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `guia-hija-${guiaId}.pdf`);
            document.body.appendChild(link);
            link.click();

            // Limpiar
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            dispatchMenssage('success', 'PDF generado correctamente');
            return true;
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            dispatchMenssage('error', 'Error al generar el PDF');
            return false;
        } finally {
            setGenerating(false);
            setSelectedGuia(null);
        }
    };

    // Verificar si una guía tiene cantidades configuradas
    const hasCantidades = (guia: GuiaHijaExtended): boolean => {
        return (
            (guia.fulls !== undefined && guia.fulls > 0) ||
            (guia.pcs !== undefined && guia.pcs > 0) ||
            (guia.kgs !== undefined && guia.kgs > 0) ||
            (guia.stems !== undefined && guia.stems > 0)
        );
    };

    // Limpiar filtros
    const clearFilters = () => {
        setFincaFilter(undefined);
        setGuiaMadreFilter(undefined);
        setCurrentPage(1);
    };

    // Obtener una guía hija por ID
    const getGuiaHijaById = async (id: number): Promise<GuiaHijaExtended | null> => {
        try {
            const guia = await guiasHijasService.getGuiaHijaById(id);

            // Enriquecer datos
            const finca = fincas.find(f => f.id_finca === guia.id_finca);
            const producto = productos.find(p => p.id_producto === guia.id_producto);

            return {
                ...guia,
                fincaNombre: finca?.nombre || 'Desconocida',
                productoNombre: producto?.nombre || 'No especificado',
                cooLabel: `COO-${guia.id_documento_coordinacion.toString().padStart(7, '0')}`
            };
        } catch (error) {
            console.error('Error al obtener guía hija:', error);
            dispatchMenssage('error', 'Error al obtener detalles de la guía hija');
            return null;
        }
    };

    return {
        guiasHijas,
        loading,
        error,
        currentPage,
        totalPages,
        fincaFilter,
        guiaMadreFilter,
        generating,
        selectedGuia,
        fetchGuiasHijas,
        setCurrentPage,
        setFincaFilter,
        setGuiaMadreFilter,
        downloadPdf,
        hasCantidades,
        clearFilters,
        getGuiaHijaById
    };
};
