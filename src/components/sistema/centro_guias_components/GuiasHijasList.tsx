import React, { useState, useEffect } from 'react';
import { guiasHijasService, GuiaHija } from '@/api/services/documentos/guiasHijasService';
import { fincasService } from '@/api/services/mantenimiento/fincasService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { AppIcons } from '@/utils/icons';

interface GuiasHijasListProps {
    filtroFinca?: number;
    filtroGuiaMadre?: number;
    showFilters?: boolean;
}

interface GuiaHijaExtended extends GuiaHija {
    fincaNombre?: string;
    cooLabel?: string;
}

export default function GuiasHijasList({
    filtroFinca,
    filtroGuiaMadre,
    showFilters = true
}: GuiasHijasListProps) {
    const [guiasHijas, setGuiasHijas] = useState<GuiaHijaExtended[]>([]);
    const [fincas, setFincas] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [fincaFilter, setFincaFilter] = useState<number | undefined>(filtroFinca);
    const [guiaMadreFilter, setGuiaMadreFilter] = useState<number | undefined>(filtroGuiaMadre);
    const [generating, setGenerating] = useState<boolean>(false);
    const [selectedGuia, setSelectedGuia] = useState<number | null>(null);

    // Cargar datos iniciales y cada vez que cambia la página o filtros
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Cargar datos de fincas para mostrar nombres
                const fincasData = await fincasService.getFincas();
                setFincas(fincasData);

                // Cargar guías hijas
                let guiasData;
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
                    setGuiasHijas(response.data);
                    setTotalPages(response.totalPages);
                }
            } catch (error) {
                console.error('Error al cargar guías hijas:', error);
                dispatchMenssage('error', 'Error al cargar guías hijas');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, fincaFilter, guiaMadreFilter, filtroFinca, filtroGuiaMadre]);

    // Enriquecer datos de guías con nombres de fincas
    useEffect(() => {
        if (guiasHijas.length > 0 && fincas.length > 0) {
            const guiasEnriquecidas = guiasHijas.map(guia => {
                const finca = fincas.find(f => f.id_finca === guia.id_finca);
                return {
                    ...guia,
                    fincaNombre: finca?.nombre || 'Desconocida',
                    cooLabel: `COO-${guia.id_documento_coordinacion.toString().padStart(7, '0')}`
                };
            });

            setGuiasHijas(guiasEnriquecidas);
        }
    }, [fincas]);

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

    // Limpiar filtros
    const handleClearFilters = () => {
        setFincaFilter(undefined);
        setGuiaMadreFilter(undefined);
        setCurrentPage(1);
    };

    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
                <h2 className="card-title text-lg">Guías Hijas Asignadas</h2>

                {showFilters && (
                    <div className="flex flex-wrap gap-2 mt-2 mb-4">
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

                {loading ? (
                    <div className="flex justify-center py-10">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : guiasHijas.length === 0 ? (
                    <div className="alert alert-info">
                        <AppIcons.Info className="w-6 h-6" />
                        <span>No se encontraron guías hijas{fincaFilter ? ' para esta finca' : ''}{guiaMadreFilter ? ' para esta guía madre' : ''}.</span>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>Número</th>
                                        <th>Finca</th>
                                        <th>Documento COO</th>
                                        <th>Fecha</th>
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
                                            <td>{guia.cooLabel}</td>
                                            <td>{new Date(guia.createdAt).toLocaleDateString()}</td>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleDownloadPdf(guia.id)}
                                                    disabled={generating && selectedGuia === guia.id}
                                                >
                                                    {generating && selectedGuia === guia.id ? (
                                                        <span className="loading loading-spinner loading-xs"></span>
                                                    ) : (
                                                        <AppIcons.Print className="w-4 h-4 mr-1" />
                                                    )}
                                                    PDF
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación (solo si no hay filtros) */}
                        {!fincaFilter && !guiaMadreFilter && totalPages > 1 && (
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
                    </>
                )}
            </div>
        </div>
    );
}