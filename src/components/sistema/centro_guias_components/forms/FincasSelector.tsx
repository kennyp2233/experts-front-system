// src/components/sistema/documentos_components/forms/FincasSelector.tsx
import React, { useState, useEffect } from 'react';
import { AppIcons } from '@/utils/icons';

interface FincasSelectorProps {
    fincas: any[];
    selectedFincas: number[];
    onSelectFinca: (fincaId: number) => void;
    onSelectAll: () => void;
}

export const FincasSelector: React.FC<FincasSelectorProps> = ({
    fincas,
    selectedFincas,
    onSelectFinca,
    onSelectAll
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFincas, setFilteredFincas] = useState(fincas);

    // Filtrar fincas cuando cambia el término de búsqueda
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredFincas(fincas);
        } else {
            const searchTermLower = searchTerm.toLowerCase();
            const filtered = fincas.filter(
                finca =>
                    finca.nombre?.toLowerCase().includes(searchTermLower) ||
                    finca.codigo?.toLowerCase().includes(searchTermLower)
            );
            setFilteredFincas(filtered);
        }
    }, [searchTerm, fincas]);

    return (
        <div className="form-control">
            <div className="flex justify-between items-center">
                <label className="label-text font-medium">Fincas Disponibles</label>
                <div className="flex items-center space-x-2">
                    <span className="text-sm opacity-70">
                        {selectedFincas.length} / {filteredFincas.length} seleccionadas
                    </span>
                    <button
                        className="btn btn-xs"
                        onClick={onSelectAll}
                    >
                        {selectedFincas.length === filteredFincas.length
                            ? 'Deseleccionar todas'
                            : 'Seleccionar todas'}
                    </button>
                </div>
            </div>

            <div className="input-group mb-2">
                <input
                    type="text"
                    placeholder="Buscar finca por nombre o código..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-square">
                    <AppIcons.Search className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 max-h-80 overflow-y-auto p-2">
                {filteredFincas.length === 0 ? (
                    <div className="col-span-full text-center py-4 text-sm opacity-70">
                        No se encontraron fincas con ese término de búsqueda
                    </div>
                ) : (
                    filteredFincas.map(finca => (
                        <div
                            key={finca.id_finca}
                            className={`border rounded-lg p-2 cursor-pointer hover:bg-base-200 transition-colors ${selectedFincas.includes(finca.id_finca)
                                    ? 'bg-primary/10 border-primary'
                                    : ''
                                }`}
                            onClick={() => onSelectFinca(finca.id_finca)}
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary mr-2"
                                    checked={selectedFincas.includes(finca.id_finca)}
                                    onChange={() => { }} // Manejado por el onClick del div padre
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <div>
                                    <p className="font-medium">{finca.nombre}</p>
                                    <p className="text-xs opacity-70">{finca.codigo || 'Sin código'}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};