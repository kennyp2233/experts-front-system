// src/components/sistema/centro_guias_components/forms/FincasSelector.tsx
import React, { useState, useEffect } from 'react';
import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { AppIcons } from '@/utils/icons';

interface FincasSelectorProps {
    fincas: any[];
    disabled?: boolean;
    showCardLayout?: boolean;
}

export const FincasSelector: React.FC<FincasSelectorProps> = ({
    fincas,
    disabled = false,
    showCardLayout = false
}) => {
    // Utilizando React Hook Form para acceder al contexto del formulario
    const { setValue, control, formState: { errors } } = useFormContext();
    const selectedFincas = useWatch({ name: 'selectedFincas', control }) || [];
    const error = errors.selectedFincas?.message as string;

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFincas, setFilteredFincas] = useState(fincas);

    // Filtrar fincas cuando cambia el término de búsqueda o la lista de fincas
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredFincas(fincas);
        } else {
            const searchTermLower = searchTerm.toLowerCase();
            const filtered = fincas.filter(
                finca =>
                    (finca.nombre?.toLowerCase().includes(searchTermLower)) ||
                    (finca.nombre_finca?.toLowerCase().includes(searchTermLower)) ||
                    (finca.codigo?.toLowerCase().includes(searchTermLower)) ||
                    (finca.codigo_finca?.toLowerCase().includes(searchTermLower))
            );
            setFilteredFincas(filtered);
        }
    }, [searchTerm, fincas]);

    // Manejar selección/deselección de una finca
    const handleSelectFinca = (fincaId: number) => {
        const newSelectedFincas = selectedFincas.includes(fincaId)
            ? selectedFincas.filter((id: number) => id !== fincaId)
            : [...selectedFincas, fincaId];

        setValue('selectedFincas', newSelectedFincas, { shouldValidate: true });
    };

    // Seleccionar o deseleccionar todas las fincas filtradas
    const handleSelectAll = () => {
        // Si todas las fincas filtradas están seleccionadas, deseleccionarlas todas
        const allFilteredFincaIds = filteredFincas.map(finca => finca.id_finca);
        const allSelected = allFilteredFincaIds.every(id => selectedFincas.includes(id));

        if (allSelected) {
            // Deseleccionar solo las fincas filtradas
            const newSelection = selectedFincas.filter((id: number) => !allFilteredFincaIds.includes(id));
            setValue('selectedFincas', newSelection, { shouldValidate: true });
        } else {
            // Seleccionar todas las fincas filtradas (mantener las que ya estaban seleccionadas)
            const newSelection = [...new Set([...selectedFincas, ...allFilteredFincaIds])];
            setValue('selectedFincas', newSelection, { shouldValidate: true });
        }
    };

    const renderContent = () => (
        <div className="form-control">
            <div className="flex justify-between items-center">
                <label className="label-text font-medium">Fincas Disponibles</label>
                <div className="flex items-center space-x-2">
                    <span className="text-sm opacity-70">
                        {selectedFincas.length} / {filteredFincas.length} seleccionadas
                    </span>
                    <button
                        type="button"
                        className="btn btn-xs"
                        onClick={handleSelectAll}
                        disabled={disabled || filteredFincas.length === 0}
                    >
                        {filteredFincas.length > 0 &&
                            filteredFincas.every(finca => selectedFincas.includes(finca.id_finca))
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
                    disabled={disabled}
                />
                <button className="btn btn-square" type="button" disabled={disabled}>
                    <AppIcons.Search className="w-5 h-5" />
                </button>
            </div>

            {/* Campo oculto para la validación */}
            <Controller
                name="selectedFincas"
                control={control}
                render={({ field }) => (
                    <input type="hidden" {...field} />
                )}
            />

            {error && (
                <div className="text-error text-sm mt-1 mb-2">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 max-h-80 overflow-y-auto p-2 border rounded-lg">
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
                            onClick={() => !disabled && handleSelectFinca(finca.id_finca)}
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary mr-2"
                                    checked={selectedFincas.includes(finca.id_finca)}
                                    onChange={() => { }} // Manejado por el onClick del div padre
                                    onClick={(e) => e.stopPropagation()}
                                    disabled={disabled}
                                />
                                <div>
                                    <p className="font-medium">{finca.nombre || finca.nombre_finca}</p>
                                    <p className="text-xs opacity-70">{finca.codigo || finca.codigo_finca || 'Sin código'}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    // Render with or without card layout
    if (showCardLayout) {
        return (
            <div className="card bg-base-200 p-6">
                <h3 className="font-bold mb-4">Selección de Fincas</h3>
                {renderContent()}
            </div>
        );
    }

    return renderContent();
};