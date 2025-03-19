// src/components/sistema/documentos_components/forms/AerolineaGuiaSelector.tsx
import React, { useState, useEffect } from 'react';
import { aerolineasService } from '@/api/services/mantenimiento/aerolineasService';
import { guiasMadreService } from '@/api/services/documentos/guiasMadreService';
import { AppIcons } from '@/utils/icons';
import { dispatchMenssage } from '@/utils/menssageDispatcher';

interface AerolineaGuiaSelectorProps {
    onGuiaSelected: (guia: any) => void;
    initialGuiaId?: number;
}

export const AerolineaGuiaSelector: React.FC<AerolineaGuiaSelectorProps> = ({
    onGuiaSelected,
    initialGuiaId
}) => {
    const [aerolineas, setAerolineas] = useState<any[]>([]);
    const [selectedAerolineaId, setSelectedAerolineaId] = useState<number | null>(null);
    const [guias, setGuias] = useState<any[]>([]);
    const [selectedGuia, setSelectedGuia] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    // Cargar aerolíneas
    useEffect(() => {
        const fetchAerolineas = async () => {
            try {
                const data = await aerolineasService.getAerolineas();
                setAerolineas(data);
            } catch (error) {
                console.error('Error al cargar aerolíneas:', error);
                dispatchMenssage('error', 'Error al cargar aerolíneas');
            }
        };

        fetchAerolineas();
    }, []);

    // Si hay un ID de guía inicial, cargar esa guía específica
    useEffect(() => {
        if (initialGuiaId) {
            const fetchInitialGuia = async () => {
                try {
                    const guia = await guiasMadreService.getGuiaMadreById(initialGuiaId);
                    if (guia) {
                        setSelectedGuia(guia);
                        onGuiaSelected(guia);

                        // Aquí podrías cargar también la aerolínea asociada si es necesario
                        // y llamar a setSelectedAerolineaId() con su ID
                    }
                } catch (error) {
                    console.error('Error al cargar guía inicial:', error);
                }
            };

            fetchInitialGuia();
        }
    }, [initialGuiaId, onGuiaSelected]);

    // Cargar guías cuando cambia la aerolínea seleccionada
    useEffect(() => {
        if (!selectedAerolineaId) return;

        const fetchGuias = async () => {
            setLoading(true);
            try {
                const guiasData = await guiasMadreService.getGuiasMadrePorAerolinea(selectedAerolineaId);

                // Filtrar solo las disponibles
                const guiasDisponibles = guiasData.filter(g => !g.prestado);
                setGuias(guiasDisponibles);

                if (guiasDisponibles.length === 0) {
                    dispatchMenssage('info', 'No hay guías disponibles para esta aerolínea');
                }
            } catch (error) {
                console.error('Error al cargar guías:', error);
                dispatchMenssage('error', 'Error al cargar guías madre');
            } finally {
                setLoading(false);
            }
        };

        fetchGuias();
    }, [selectedAerolineaId]);

    // Manejar selección de aerolínea
    const handleAerolineaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = parseInt(e.target.value);
        setSelectedAerolineaId(id || null);
        setSelectedGuia(null);
    };

    // Manejar selección de guía
    const handleGuiaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const guiaId = parseInt(e.target.value);
        const guia = guias.find(g => g.id === guiaId);

        if (guia) {
            setSelectedGuia(guia);
            onGuiaSelected(guia);
        } else {
            setSelectedGuia(null);
            onGuiaSelected(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-medium">Aerolínea</span>
                </label>
                <select
                    className="select select-bordered w-full"
                    value={selectedAerolineaId || ''}
                    onChange={handleAerolineaChange}
                >
                    <option value="">Seleccione una aerolínea</option>
                    {aerolineas.map(aerolinea => (
                        <option key={aerolinea.id_aerolinea} value={aerolinea.id_aerolinea}>
                            {aerolinea.nombre} {aerolinea.codigo ? `(${aerolinea.codigo})` : ''}
                        </option>
                    ))}
                </select>
            </div>

            {selectedAerolineaId && (
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium">Guía Madre</span>
                    </label>
                    {loading ? (
                        <div className="flex items-center space-x-2">
                            <span className="loading loading-spinner loading-sm"></span>
                            <span>Cargando guías...</span>
                        </div>
                    ) : (
                        <select
                            className="select select-bordered w-full"
                            value={selectedGuia?.id || ''}
                            onChange={handleGuiaChange}
                            disabled={guias.length === 0}
                        >
                            <option value="">Seleccione una guía madre</option>
                            {guias.map(guia => (
                                <option key={guia.id} value={guia.id}>
                                    {guia.prefijo}-{guia.secuencial}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}

            {selectedGuia && (
                <div className="alert alert-success bg-success/20 border-success">
                    <AppIcons.Check className="w-6 h-6" />
                    <div>
                        <span className="font-semibold">Guía Madre Seleccionada:</span>
                        <br />
                        ID: {selectedGuia.id}, Prefijo: {selectedGuia.prefijo}, Secuencial: {selectedGuia.secuencial}
                    </div>
                    <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        onClick={() => {
                            setSelectedGuia(null);
                            onGuiaSelected(null);
                        }}
                    >
                        Cambiar
                    </button>
                </div>
            )}
        </div>
    );
};