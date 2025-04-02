// src/components/sistema/centro_guias_components/common/FincasSelector.tsx
import React from 'react';
import { AppIcons } from '@/utils/icons';

interface FincasSelectorProps {
    fincas: any[];
    selectedFincas: number[];
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
    onToggleFinca?: (fincaId: number) => void;
    onToggleAll?: () => void;
    loading?: boolean;
    title?: string;
    maxHeight?: string;
    disabled?: boolean;
}

export const FincasSelector: React.FC<FincasSelectorProps> = ({
    fincas,
    selectedFincas,
    searchTerm = '',
    onSearchChange,
    onToggleFinca,
    onToggleAll,
    loading = false,
    title = 'Selección de Fincas',
    maxHeight = '80',
    disabled = false
}) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{title}</h3>
                <div className="flex items-center">
                    <span className="mr-2 text-sm opacity-70">
                        {selectedFincas.length} / {fincas.length} seleccionadas
                    </span>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={onToggleAll}
                        disabled={disabled || loading || fincas.length === 0}
                    >
                        {fincas.length > 0 &&
                            fincas.every(finca => selectedFincas.includes(finca.id_finca))
                            ? 'Deseleccionar todas'
                            : 'Seleccionar todas'}
                    </button>
                </div>
            </div>

            <div className="input-group mb-4">
                <input
                    type="text"
                    placeholder="Buscar finca por nombre o código..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                    disabled={disabled || loading}
                />
                <button
                    className="btn btn-square"
                    type="button"
                    disabled={disabled || loading}
                >
                    <AppIcons.Search className="w-5 h-5" />
                </button>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-${maxHeight} overflow-y-auto p-2 border rounded-lg`}>
                {fincas.length === 0 ? (
                    <div className="col-span-full text-center py-4 text-sm opacity-70">
                        {loading ? 'Cargando fincas...' : 'No se encontraron fincas con ese término de búsqueda'}
                    </div>
                ) : (
                    fincas.map((finca) => {
                        const isSelected = selectedFincas.includes(finca.id_finca);

                        return (
                            <div
                                key={finca.id_finca}
                                className={`border rounded-lg p-3 cursor-pointer hover:bg-base-200 transition-colors ${isSelected ? "bg-primary/10 border-primary" : ""
                                    }`}
                                onClick={() => !disabled && onToggleFinca && onToggleFinca(finca.id_finca)}
                            >
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary mr-2"
                                        checked={isSelected}
                                        onChange={() => { }} // Controlado por el onClick del div padre
                                        onClick={(e) => e.stopPropagation()}
                                        disabled={disabled}
                                    />
                                    <div>
                                        <p className="font-medium">{finca.nombre}</p>
                                        <p className="text-xs opacity-70 font-bold">
                                            {finca.nombre_finca || "Sin código"}
                                        </p>
                                        <p className="text-xs opacity-70">
                                            {finca.codigo_finca || "Sin código"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};