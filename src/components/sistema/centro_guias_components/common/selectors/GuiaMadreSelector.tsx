// src/components/sistema/centro_guias_components/common/GuiaMadreSelector.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { guiasMadreService } from '@/api/services/documentos/guiasMadreService';
import { AppIcons } from '@/utils/icons';
import { dispatchMenssage } from '@/utils/menssageDispatcher';

interface GuiaMadreSelectorProps {
    onGuiaSelected?: (guia: any) => void;
    onError?: (error: string) => void;
    initialValue?: number;
    disabled?: boolean;
    methods?: UseFormReturn<any>;
}

export const GuiaMadreSelector: React.FC<GuiaMadreSelectorProps> = ({
    onGuiaSelected,
    onError,
    initialValue,
    disabled = false,
    methods
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedGuia, setSelectedGuia] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Manejar valor inicial
    useEffect(() => {
        if (initialValue) {
            fetchGuiaById(initialValue);
        }
    }, [initialValue]);

    // Buscar guía por ID
    const fetchGuiaById = async (id: number) => {
        try {
            setIsSearching(true);
            const guia = await guiasMadreService.getGuiaMadreById(id);
            if (guia) {
                setSelectedGuia(guia);
                if (methods) {
                    methods.setValue('id_guia_madre', guia.id);
                }
                if (onGuiaSelected) {
                    onGuiaSelected(guia);
                }
            }
        } catch (error) {
            console.error('Error al cargar guía inicial:', error);
            setError('Error al cargar guía madre');
            if (onError) onError('Error al cargar guía madre');
        } finally {
            setIsSearching(false);
        }
    };

    // Búsqueda de guías madre
    const handleSearch = useCallback(async () => {
        if (!searchTerm) {
            setError('Ingrese un número de guía madre para buscar');
            return;
        }

        setIsSearching(true);
        setError(null);

        try {
            let guiasEncontradas: any[] = [];

            // Búsqueda por ID
            if (!isNaN(Number(searchTerm))) {
                const id = Number(searchTerm);
                try {
                    const guia = await guiasMadreService.getGuiaMadreById(id);
                    if (guia) {
                        guiasEncontradas = [guia];
                    }
                } catch (e) {
                    console.warn('Guía madre no encontrada por ID:', e);
                }
            }

            // Búsqueda por prefijo-secuencial
            if (guiasEncontradas.length === 0 && searchTerm.includes('-')) {
                const [prefijo, secuencial] = searchTerm.split('-');
                const todasLasGuias = await guiasMadreService.getGuiasMadre();
                guiasEncontradas = todasLasGuias.filter(g =>
                    g.prefijo === Number(prefijo) && g.secuencial === Number(secuencial)
                );
            }

            // Filtrar solo guías disponibles
            const guiasDisponibles = guiasEncontradas.filter(g => !g.prestado);
            setSearchResults(guiasDisponibles);

            if (guiasDisponibles.length === 0) {
                setError('No se encontraron guías madre disponibles con ese criterio');
                dispatchMenssage('info', 'No se encontraron guías madre disponibles con ese criterio');
            }
        } catch (error) {
            console.error('Error al buscar guía madre:', error);
            setError('Error al buscar guía madre');
            dispatchMenssage('error', 'Error al buscar guía madre');
        } finally {
            setIsSearching(false);
        }
    }, [searchTerm]);

    // Seleccionar una guía
    const selectGuia = useCallback((guia: any) => {
        setSelectedGuia(guia);
        setSearchResults([]);
        if (methods) {
            methods.setValue('id_guia_madre', guia.id);
        }
        if (onGuiaSelected) {
            onGuiaSelected(guia);
        }
    }, [methods, onGuiaSelected]);

    // Limpiar selección
    const clearSelection = useCallback(() => {
        setSelectedGuia(null);
        if (methods) {
            methods.setValue('id_guia_madre', '');
        }
        if (onGuiaSelected) {
            onGuiaSelected(null);
        }
    }, [methods, onGuiaSelected]);

    return (
        <div className="space-y-4">
            {/* Búsqueda de guía madre */}
            {!selectedGuia && (
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium">Buscar Guía Madre</span>
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por ID o prefijo-secuencial"
                            className="input input-bordered w-full"
                            disabled={disabled || isSearching}
                        />
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSearch}
                            disabled={disabled || isSearching || !searchTerm}
                        >
                            {isSearching ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <AppIcons.Search className="w-4 h-4" />
                            )}
                            Buscar
                        </button>
                    </div>
                    {error && (
                        <div className="text-error text-sm mt-1">{error}</div>
                    )}
                </div>
            )}

            {/* Resultados de búsqueda */}
            {searchResults.length > 0 && !selectedGuia && (
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body p-4">
                        <h3 className="text-sm font-bold mb-2">Resultados ({searchResults.length})</h3>
                        <div className="overflow-x-auto">
                            <table className="table table-compact w-full">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Prefijo</th>
                                        <th>Secuencial</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResults.map((guia) => (
                                        <tr key={guia.id} className="hover">
                                            <td>{guia.id}</td>
                                            <td>{guia.prefijo}</td>
                                            <td>{guia.secuencial}</td>
                                            <td>
                                                <button
                                                    className="btn btn-xs btn-primary"
                                                    onClick={() => selectGuia(guia)}
                                                >
                                                    Seleccionar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Guía madre seleccionada */}
            {selectedGuia && (
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-md font-bold">Guía Madre Seleccionada</h3>
                            {!disabled && (
                                <button
                                    type="button"
                                    className="btn btn-xs btn-ghost"
                                    onClick={clearSelection}
                                >
                                    <AppIcons.Close className="w-4 h-4 mr-1" />
                                    Cambiar
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                                <span className="text-xs opacity-70">ID:</span>
                                <p className="font-medium">{selectedGuia.id}</p>
                            </div>
                            <div>
                                <span className="text-xs opacity-70">Prefijo-Secuencial:</span>
                                <p className="font-medium">{selectedGuia.prefijo}-{selectedGuia.secuencial}</p>
                            </div>
                            {selectedGuia.documento_base && (
                                <div className="col-span-2">
                                    <span className="text-xs opacity-70">Aerolínea:</span>
                                    <p className="font-medium">
                                        {selectedGuia.documento_base.aerolinea?.nombre || 'No disponible'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
