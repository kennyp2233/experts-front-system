// src/app/sistema/dashboard/modulos/documentos/centro_guias/components/GuiasHijasList.tsx
import React, { useState, useEffect } from 'react';
import { guiasHijasService, GuiaHija } from '@/api/services/documentos/guiasHijasService';
import { fincasService } from '@/api/services/mantenimiento/fincasService';
import { productosService } from '@/api/services/mantenimiento/productosService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { AppIcons } from '@/utils/icons';

// Componentes UI
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/ui/card';

interface GuiasHijasListProps {
    filtroFinca?: number;
    filtroGuiaMadre?: number;
    showFilters?: boolean;
    compact?: boolean;
    maxItems?: number;
}

interface GuiaHijaExtended extends GuiaHija {
    fincaNombre?: string;
    cooLabel?: string;
    productoNombre?: string;
}

export default function GuiasHijasList({
    filtroFinca,
    filtroGuiaMadre,
    showFilters = true,
    compact = false,
    maxItems = 0
}: GuiasHijasListProps) {
    const [guiasHijas, setGuiasHijas] = useState<GuiaHijaExtended[]>([]);
    const [fincas, setFincas] = useState<any[]>([]);
    const [productos, setProductos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [fincaFilter, setFincaFilter] = useState<number | undefined>(filtroFinca);
    const [guiaMadreFilter, setGuiaMadreFilter] = useState<number | undefined>(filtroGuiaMadre);
    const [generating, setGenerating] = useState<boolean>(false);
    const [selectedGuia, setSelectedGuia] = useState<number | null>(null);
    const [showCantidades, setShowCantidades] = useState<boolean>(false);
    const [selectedGuiaCantidades, setSelectedGuiaCantidades] = useState<GuiaHijaExtended | null>(null);

    // Cargar datos iniciales y cada vez que cambia la página o filtros
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Cargar datos de fincas y productos para mostrar nombres
                const [fincasData, productosData] = await Promise.all([
                    fincasService.getFincas(),
                    productosService.getProductos()
                ]);

                setFincas(fincasData);
                setProductos(productosData);

                // Cargar guías hijas
                let guiasData: GuiaHija[] = [];
                if (fincaFilter) {
                    // Si hay filtro de finca, usamos endpoint específico
                    guiasData = await guiasHijasService.getGuiasHijasByFinca(fincaFilter);
                    setGuiasHijas(guiasData);
                    setTotalPages(1); // No hay paginación en este endpoint
                } else if (guiaMadreFilter) {
                    // Si hay filtro de guía madre, usamos endpoint específico
                    guiasData = await guiasHijasService.getGuiasHijasByGuiaMadre(guiaMadreFilter);
                    setGuiasHijas(guiasData);
                    setTotalPages(1); // No hay paginación en este endpoint
                } else {
                    // Si no hay filtros, usamos endpoint paginado
                    const response = await guiasHijasService.getGuiasHijas(currentPage, 10);
                    guiasData = response.data;
                    setGuiasHijas(response.data);
                    setTotalPages(response.totalPages);
                }

                // Enriquecer datos de guías con nombres de fincas y productos
                if (guiasData?.length > 0) {
                    const guiasEnriquecidas = guiasData.map((guia: GuiaHija) => {
                        const finca = fincasData.find(f => f.id_finca === guia.id_finca);
                        const producto = productosData.find(p => p.id_producto === guia.id_producto);
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
                }
            } catch (error) {
                console.error('Error al cargar guías hijas:', error);
                dispatchMenssage('error', 'Error al cargar guías hijas');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, fincaFilter, guiaMadreFilter, filtroFinca, filtroGuiaMadre, maxItems]);

    // Manejar descarga de PDF
    const handleDownloadPdf = async (guiaId: number) => {
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
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            dispatchMenssage('error', 'Error al generar el PDF');
        } finally {
            setGenerating(false);
            setSelectedGuia(null);
        }
    };

    // Mostrar modal de cantidades
    const handleShowCantidades = (guia: GuiaHijaExtended) => {
        setSelectedGuiaCantidades(guia);
        setShowCantidades(true);
    };

    // Limpiar filtros
    const handleClearFilters = () => {
        setFincaFilter(undefined);
        setGuiaMadreFilter(undefined);
        setCurrentPage(1);
    };

    // Renderizar tabla de guías hijas
    const renderGuiasTable = () => {
        if (loading) {
            return (
                <div className="flex justify-center py-10">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            );
        }

        if (guiasHijas.length === 0) {
            return (
                <div className="alert alert-info">
                    <AppIcons.Info className="w-6 h-6" />
                    <span>No se encontraron guías hijas{fincaFilter ? ' para esta finca' : ''}{guiaMadreFilter ? ' para esta guía madre' : ''}.</span>
                </div>
            );
        }

        return (
            <>
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Finca</th>
                                {!compact && <th>Producto</th>}
                                {!compact && <th>Documento COO</th>}
                                {!compact && <th>Fecha</th>}
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guiasHijas.map((guia) => (
                                <tr key={guia.id}>
                                    <td>
                                        <span className="font-mono">
                                            {guia.anio}-{guia.secuencial.toString().padStart(4, '0')}
                                        </span>
                                    </td>
                                    <td>{guia.fincaNombre}</td>
                                    {!compact && <td>{guia.productoNombre}</td>}
                                    {!compact && <td>{guia.cooLabel}</td>}
                                    {!compact && <td>{new Date(guia.createdAt).toLocaleDateString()}</td>}
                                    <td className="text-center">
                                        <div className="flex justify-center gap-2">
                                            {hasCantidades(guia) && (
                                                <button
                                                    className="btn btn-sm btn-info"
                                                    onClick={() => handleShowCantidades(guia)}
                                                >
                                                    <AppIcons.Search className="w-4 h-4" />
                                                    {compact ? '' : 'Detalles'}
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleDownloadPdf(guia.id)}
                                                disabled={generating && selectedGuia === guia.id}
                                            >
                                                {generating && selectedGuia === guia.id ? (
                                                    <span className="loading loading-spinner loading-xs"></span>
                                                ) : (
                                                    <AppIcons.Print className="w-4 h-4" />
                                                )}
                                                {compact ? '' : 'PDF'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginación (solo si no hay filtros) */}
                {!fincaFilter && !guiaMadreFilter && totalPages > 1 && !compact && (
                    <div className="flex justify-center mt-4">
                        <div className="join">
                            <button
                                className="join-item btn"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                «
                            </button>
                            <button className="join-item btn">
                                Página {currentPage} de {totalPages}
                            </button>
                            <button
                                className="join-item btn"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                »
                            </button>
                        </div>
                    </div>
                )}

                {/* Ver más (en modo compacto) */}
                {compact && maxItems > 0 && guiasHijas.length >= maxItems && (
                    <div className="text-center mt-2">
                        <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => {
                                // Aquí se puede implementar una navegación a la vista completa
                            }}
                        >
                            Ver todas las guías...
                        </button>
                    </div>
                )}
            </>
        );
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

    // Renderizar contenedor diferente según si es compacto o no
    if (compact) {
        return (
            <div className="space-y-2">
                {showFilters && (fincaFilter || guiaMadreFilter) && (
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">
                            {fincaFilter && `Filtro: Finca #${fincaFilter}`}
                            {guiaMadreFilter && `Filtro: Guía Madre #${guiaMadreFilter}`}
                        </span>
                        <button
                            className="btn btn-xs btn-ghost"
                            onClick={handleClearFilters}
                        >
                            <AppIcons.Close className="w-3 h-3 mr-1" />
                            Limpiar
                        </button>
                    </div>
                )}
                {renderGuiasTable()}

                {/* Modal para mostrar cantidades */}
                {showCantidades && selectedGuiaCantidades && (
                    <dialog className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Detalles de la Guía Hija</h3>

                            <div className="py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="font-semibold block">Número:</span>
                                        <span>{selectedGuiaCantidades.anio}-{selectedGuiaCantidades.secuencial}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold block">Finca:</span>
                                        <span>{selectedGuiaCantidades.fincaNombre}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold block">Producto:</span>
                                        <span>{selectedGuiaCantidades.productoNombre}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold block">Documento COO:</span>
                                        <span>{selectedGuiaCantidades.cooLabel}</span>
                                    </div>
                                </div>

                                <div className="divider">Cantidades</div>

                                <div className="grid grid-cols-2 gap-4">
                                    {selectedGuiaCantidades.fulls !== undefined && selectedGuiaCantidades.fulls > 0 && (
                                        <div>
                                            <span className="font-semibold block">Fulls:</span>
                                            <span>{selectedGuiaCantidades.fulls}</span>
                                        </div>
                                    )}
                                    {selectedGuiaCantidades.pcs !== undefined && selectedGuiaCantidades.pcs > 0 && (
                                        <div>
                                            <span className="font-semibold block">Piezas (Pcs):</span>
                                            <span>{selectedGuiaCantidades.pcs}</span>
                                        </div>
                                    )}
                                    {selectedGuiaCantidades.kgs !== undefined && selectedGuiaCantidades.kgs > 0 && (
                                        <div>
                                            <span className="font-semibold block">Peso (Kgs):</span>
                                            <span>{selectedGuiaCantidades.kgs}</span>
                                        </div>
                                    )}
                                    {selectedGuiaCantidades.stems !== undefined && selectedGuiaCantidades.stems > 0 && (
                                        <div>
                                            <span className="font-semibold block">Stems:</span>
                                            <span>{selectedGuiaCantidades.stems}</span>
                                        </div>
                                    )}
                                    {!selectedGuiaCantidades.fulls && !selectedGuiaCantidades.pcs &&
                                        !selectedGuiaCantidades.kgs && !selectedGuiaCantidades.stems && (
                                            <div className="col-span-2 text-center py-2">
                                                <span className="text-sm opacity-70">No hay información de cantidades registrada</span>
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="modal-action">
                                <button
                                    className="btn"
                                    onClick={() => {
                                        setShowCantidades(false);
                                        setSelectedGuiaCantidades(null);
                                    }}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                        <div className="modal-backdrop" onClick={() => {
                            setShowCantidades(false);
                            setSelectedGuiaCantidades(null);
                        }}></div>
                    </dialog>
                )}
            </div>
        );
    }

    return (
        <Card className="bg-base-100 shadow-lg">
            <CardHeader>
                <CardTitle>Guías Hijas{guiaMadreFilter ? ' - Guía Madre #' + guiaMadreFilter : ''}</CardTitle>
            </CardHeader>
            <CardContent>
                {showFilters && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {/* Filtros */}
                        <div className="flex-1 min-w-48">
                            <select
                                className="select select-bordered w-full"
                                value={fincaFilter || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFincaFilter(value ? parseInt(value) : undefined);
                                    setGuiaMadreFilter(undefined); // Limpiar otro filtro
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">Todas las fincas</option>
                                {fincas.map(finca => (
                                    <option key={finca.id_finca} value={finca.id_finca}>
                                        {finca.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Botón para limpiar filtros */}
                        {(fincaFilter || guiaMadreFilter) && (
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={handleClearFilters}
                            >
                                <AppIcons.Close className="w-4 h-4 mr-1" />
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                )}

                {renderGuiasTable()}
            </CardContent>
        </Card>
    );
}