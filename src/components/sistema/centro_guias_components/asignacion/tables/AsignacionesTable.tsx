// src/components/sistema/centro_guias_components/tables/AsignacionesTable.tsx
import React from 'react';
import { AppIcons } from '@/utils/icons';

interface AsignacionTableProps {
    // Propiedades para asignaciones nuevas
    nuevasAsignaciones?: any[];
    // Propiedades para asignaciones existentes
    asignacionesExistentes?: any[];
    // Datos de referencia
    fincas?: any[];
    productos?: any[];
    // Estados y callbacks
    loading?: boolean;
    onDeleteAsignacion?: (index: number) => void;
    onSelectAsignacion?: (asignacion: any) => void;
    // Tipo para mostrar la tabla
    tipo?: 'nuevas' | 'existentes' | 'todas';
    // Control de columnas
    showNumeroGuia?: boolean;
    showProducto?: boolean;
    showCantidades?: boolean;
    showAcciones?: boolean;
    showEstado?: boolean;
    compact?: boolean;
}

export const AsignacionesTable: React.FC<AsignacionTableProps> = ({
    nuevasAsignaciones = [],
    asignacionesExistentes = [],
    fincas = [],
    productos = [],
    loading = false,
    onDeleteAsignacion,
    onSelectAsignacion,
    tipo = 'todas',
    showNumeroGuia = true,
    showProducto = true,
    showCantidades = true,
    showAcciones = true,
    showEstado = true,
    compact = false
}) => {
    // Determinar qué asignaciones mostrar según el tipo
    const asignacionesTotales = tipo === 'todas'
        ? [...nuevasAsignaciones, ...asignacionesExistentes]
        : tipo === 'nuevas' ? nuevasAsignaciones : asignacionesExistentes;

    // Funciones para obtener nombres desde IDs
    const getFincaNombre = (id: number) => {
        const finca = fincas.find(f => f.id_finca === id);
        return finca ? finca.nombre : 'Desconocida';
    };

    const getProductoNombre = (id: number) => {
        const producto = productos.find(p => p.id_producto === id);
        return producto ? producto.nombre : 'No especificado';
    };

    // Función para determinar si tiene cantidades configuradas
    const hasCantidades = (asignacion: any): boolean => {
        return (
            (asignacion.fulls !== undefined && asignacion.fulls > 0) ||
            (asignacion.pcs !== undefined && asignacion.pcs > 0) ||
            (asignacion.kgs !== undefined && asignacion.kgs > 0) ||
            (asignacion.stems !== undefined && asignacion.stems > 0)
        );
    };

    // Función para renderizar badges de cantidades
    const renderCantidadesBadges = (asignacion: any) => {
        return (
            <div className="flex flex-wrap gap-1 text-xs">
                {asignacion.fulls > 0 && (
                    <span className="badge badge-info badge-sm">Fulls: {asignacion.fulls}</span>
                )}
                {asignacion.pcs > 0 && (
                    <span className="badge badge-info badge-sm">Pcs: {asignacion.pcs}</span>
                )}
                {asignacion.kgs > 0 && (
                    <span className="badge badge-info badge-sm">Kgs: {asignacion.kgs}</span>
                )}
                {asignacion.stems > 0 && (
                    <span className="badge badge-info badge-sm">Stems: {asignacion.stems}</span>
                )}
                {!hasCantidades(asignacion) && (
                    <span className="text-sm opacity-60">No especificadas</span>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center py-4">
                <span className="loading loading-spinner loading-md"></span>
            </div>
        );
    }

    if (asignacionesTotales.length === 0) {
        return (
            <div className="alert alert-info">
                <AppIcons.Info className="w-6 h-6" />
                <span>No hay asignaciones {tipo === 'nuevas' ? 'nuevas' : tipo === 'existentes' ? 'existentes' : ''} para mostrar.</span>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>Finca</th>
                        {showNumeroGuia && <th>Guía Hija</th>}
                        {showProducto && <th>Producto</th>}
                        {showCantidades && <th>Cantidades</th>}
                        {showEstado && <th>Estado</th>}
                        {showAcciones && <th className="text-center">Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {asignacionesTotales.map((asignacion, index) => {
                        const esNueva = nuevasAsignaciones.some(a =>
                            a.id_finca === asignacion.id_finca && a.accion === 'NUEVA'
                        );

                        return (
                            <tr key={index}>
                                <td>{getFincaNombre(asignacion.id_finca)}</td>

                                {showNumeroGuia && (
                                    <td className="font-mono">
                                        {asignacion.numero_guia_hija || `${asignacion.anio}-${asignacion.secuencial}`}
                                    </td>
                                )}

                                {showProducto && (
                                    <td>{getProductoNombre(asignacion.id_producto)}</td>
                                )}

                                {showCantidades && (
                                    <td>{renderCantidadesBadges(asignacion)}</td>
                                )}

                                {showEstado && (
                                    <td>
                                        <span className={`badge ${esNueva ? 'badge-success' : 'badge-warning'}`}>
                                            {esNueva ? 'Nueva' : 'Existente'}
                                        </span>
                                    </td>
                                )}

                                {showAcciones && (
                                    <td className="text-center">
                                        <div className="flex justify-center gap-2">
                                            {onSelectAsignacion && (
                                                <button
                                                    className="btn btn-sm btn-info"
                                                    onClick={() => onSelectAsignacion(asignacion)}
                                                >
                                                    <AppIcons.Search className="w-4 h-4" />
                                                    {!compact && 'Detalles'}
                                                </button>
                                            )}

                                            {onDeleteAsignacion && (
                                                <button
                                                    className="btn btn-sm btn-error"
                                                    onClick={() => onDeleteAsignacion(index)}
                                                >
                                                    <AppIcons.Delete className="w-4 h-4" />
                                                    {!compact && 'Eliminar'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};