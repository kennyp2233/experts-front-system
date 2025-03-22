// src/components/sistema/centro_guias_components/filters/DocumentosFilter.tsx
import React from 'react';
import { AppIcons } from '@/utils/icons';

interface DocumentosFilterProps {
    filtro: string;
    setFiltro: (filtro: string) => void;
    estadoFiltro: string;
    setEstadoFiltro: (estado: string) => void;
    onSort?: (field: string, direction: 'asc' | 'desc') => void;
    sorting?: { field: string, direction: 'asc' | 'desc' };
    loading: boolean;
    compact?: boolean;
}

export const DocumentosFilter: React.FC<DocumentosFilterProps> = ({
    filtro,
    setFiltro,
    estadoFiltro,
    setEstadoFiltro,
    onSort,
    sorting = { field: 'createdAt', direction: 'desc' },
    loading,
    compact = false
}) => {
    return (
        <div className={`${compact ? 'space-y-2' : 'space-y-4'}`}>
            {/* Filtros */}
            <div className="flex flex-wrap gap-3">
                <div className="form-control flex-1 max-w-xs">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Buscar por ID..."
                            className="input input-bordered w-full"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            className="btn btn-square btn-primary"
                            disabled={loading}
                        >
                            <AppIcons.Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <select
                    className="select select-bordered"
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                    disabled={loading}
                >
                    <option value="todos">Todos los estados</option>
                    <option value="activo">Activos</option>
                    <option value="pendiente">Pendientes</option>
                </select>
            </div>

            {/* Indicadores de ordenamiento (si aplica) */}
            {onSort && !compact && (
                <div className="flex items-center text-sm opacity-70">
                    <span className="mr-2">Ordenado por:</span>
                    <button
                        className="badge badge-neutral badge-outline"
                        onClick={() => onSort(sorting.field, sorting.direction === 'asc' ? 'desc' : 'asc')}
                        disabled={loading}
                    >
                        {sorting.field === 'id' && 'ID'}
                        {sorting.field === 'createdAt' && 'Fecha de creación'}
                        {sorting.field === 'id_consignatario' && 'Consignatario'}
                        {sorting.field === 'id_producto' && 'Producto'}
                        {sorting.field === 'fecha_vuelo' && 'Fecha de vuelo'}
                        {' '}
                        {sorting.direction === 'asc' ? '↑' : '↓'}
                    </button>
                </div>
            )}
        </div>
    );
};

