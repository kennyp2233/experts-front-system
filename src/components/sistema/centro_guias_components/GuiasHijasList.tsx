// src/components/sistema/centro_guias_components/GuiasHijasList.tsx
import React, { useState } from 'react';
import { useGuiasHijas } from '@/components/sistema/centro_guias_components/hooks/useGuiasHijas';
import { AppIcons } from '@/utils/icons';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import { Pagination } from './common/Pagination';
import { DetalleGuiaHijaModal } from './modals/DetalleGuiaHijaModal';

interface GuiasHijasListProps {
    filtroFinca?: number;
    filtroGuiaMadre?: number;
    showFilters?: boolean;
    compact?: boolean;
    maxItems?: number;
    title?: string;
    onViewDetails?: (guiaHija: any) => void;
}

export const GuiasHijasList: React.FC<GuiasHijasListProps> = ({
    filtroFinca,
    filtroGuiaMadre,
    showFilters = true,
    compact = false,
    maxItems = 0,
    title = "Guías Hijas",
    onViewDetails
}) => {
    const {
        guiasHijas,
        loading,
        error,
        currentPage,
        totalPages,
        downloadPdf,
        generating,
        selectedGuia,
        hasCantidades,
        setCurrentPage,
        clearFilters
    } = useGuiasHijas({ filtroFinca, filtroGuiaMadre });

    const [showModal, setShowModal] = useState(false);
    const [selectedGuiaHija, setSelectedGuiaHija] = useState<any | null>(null);

    // Mostrar detalles de cantidades
    const handleShowCantidades = (guia: any) => {
        setSelectedGuiaHija(guia);
        setShowModal(true);

        if (onViewDetails) {
            onViewDetails(guia);
        }
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

        if (error) {
            return (
                <div className="alert alert-error">
                    <AppIcons.Error className="w-6 h-6" />
                    <span>{error}</span>
                </div>
            );
        }

        if (guiasHijas.length === 0) {
            return (
                <div className="alert alert-info">
                    <AppIcons.Info className="w-6 h-6" />
                    <span>No se encontraron guías hijas{filtroFinca ? ' para esta finca' : ''}{filtroGuiaMadre ? ' para esta guía madre' : ''}.</span>
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
                                                onClick={() => downloadPdf(guia.id)}
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
                {!filtroFinca && !filtroGuiaMadre && totalPages > 1 && !compact && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        disabled={loading}
                    />
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

    // Renderizar contenedor diferente según si es compacto o no
    if (compact) {
        return (
            <div className="space-y-2">
                {showFilters && (filtroFinca || filtroGuiaMadre) && (
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">
                            {filtroFinca && `Filtro: Finca #${filtroFinca}`}
                            {filtroGuiaMadre && `Filtro: Guía Madre #${filtroGuiaMadre}`}
                        </span>
                        <button
                            className="btn btn-xs btn-ghost"
                            onClick={clearFilters}
                        >
                            <AppIcons.Close className="w-3 h-3 mr-1" />
                            Limpiar
                        </button>
                    </div>
                )}
                {renderGuiasTable()}

                {/* Modal para mostrar cantidades */}
                <DetalleGuiaHijaModal
                    guiaHija={selectedGuiaHija}
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onPrint={selectedGuiaHija ? () => downloadPdf(selectedGuiaHija.id) : undefined}
                />
            </div>
        );
    }

    return (
        <Card className="bg-base-100 shadow-lg">
            <CardHeader>
                <CardTitle>{title}{filtroGuiaMadre ? ' - Guía Madre #' + filtroGuiaMadre : ''}</CardTitle>
            </CardHeader>
            <CardContent>
                {showFilters && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {/* Aquí podrían ir filtros adicionales si se necesitan */}

                        {/* Botón para limpiar filtros */}
                        {(filtroFinca || filtroGuiaMadre) && (
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={clearFilters}
                            >
                                <AppIcons.Close className="w-4 h-4 mr-1" />
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                )}

                {renderGuiasTable()}
            </CardContent>

            {/* Modal para mostrar cantidades */}
            <DetalleGuiaHijaModal
                guiaHija={selectedGuiaHija}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onPrint={selectedGuiaHija ? () => downloadPdf(selectedGuiaHija.id) : undefined}
            />
        </Card>
    );
};