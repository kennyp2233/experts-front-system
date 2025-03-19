// src/components/sistema/centro_guias_components/forms/AerolineaGuiaSelector.tsx
import React, { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { aerolineasService } from '@/api/services/mantenimiento/aerolineasService';
import { guiasMadreService } from '@/api/services/documentos/guiasMadreService';
import { AppIcons } from '@/utils/icons';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { FormField } from '@/components/sistema/common/form';

interface AerolineaGuiaSelectorProps {
    onGuiaSelected?: (guia: any) => void;
    initialGuiaId?: number;
    disabled?: boolean;
}

export const AerolineaGuiaSelector: React.FC<AerolineaGuiaSelectorProps> = ({
    onGuiaSelected,
    initialGuiaId,
    disabled = false
}) => {
    const { control, setValue, watch } = useFormContext();
    const selectedAerolineaId = watch('selectedAerolineaId');
    const selectedGuiaId = watch('id_guia_madre');

    const [aerolineas, setAerolineas] = useState<any[]>([]);
    const [guias, setGuias] = useState<any[]>([]);
    const [selectedGuia, setSelectedGuia] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingGuiaDetails, setLoadingGuiaDetails] = useState(false);

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
                        setValue('id_guia_madre', guia.id);

                        if (onGuiaSelected) {
                            onGuiaSelected(guia);
                        }

                        // Si la guía tiene asociada una aerolínea a través del documento base
                        if (guia.documento_base?.id_aerolinea) {
                            setValue('selectedAerolineaId', guia.documento_base.id_aerolinea);
                        }
                    }
                } catch (error) {
                    console.error('Error al cargar guía inicial:', error);
                }
            };

            fetchInitialGuia();
        }
    }, [initialGuiaId, setValue, onGuiaSelected]);

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

    // Cuando cambia la guía seleccionada
    useEffect(() => {
        if (!selectedGuiaId) {
            setSelectedGuia(null);
            return;
        }

        const cargarDetallesGuia = async () => {
            setLoadingGuiaDetails(true);
            try {
                const guia = await guiasMadreService.getGuiaMadreById(selectedGuiaId);
                setSelectedGuia(guia);

                if (onGuiaSelected) {
                    onGuiaSelected(guia);
                }
            } catch (error) {
                console.error('Error al cargar detalles de la guía:', error);
                dispatchMenssage('error', 'Error al cargar detalles de la guía');
            } finally {
                setLoadingGuiaDetails(false);
            }
        };

        // Solo cargar detalles si no tenemos ya la guía
        if (!selectedGuia || selectedGuia.id !== selectedGuiaId) {
            cargarDetallesGuia();
        }
    }, [selectedGuiaId, onGuiaSelected]);

    const handleChangeGuia = (guiaId: string) => {
        if (!guiaId) {
            setSelectedGuia(null);
            if (onGuiaSelected) {
                onGuiaSelected(null);
            }
        } else {
            // Los detalles se cargarán en el useEffect que observa selectedGuiaId
        }
    };

    return (
        <div className="space-y-4">
            {/* Selección de Aerolínea */}
            <FormField
                name="selectedAerolineaId"
                label="Aerolínea"
                type="select"
                options={aerolineas.map(aerolinea => ({
                    value: aerolinea.id_aerolinea,
                    label: `${aerolinea.nombre} ${aerolinea.codigo ? `(${aerolinea.codigo})` : ''}`
                }))}
                disabled={disabled}
                placeholder="Seleccione una aerolínea"
            />

            {/* Selección de Guía Madre */}
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
                        <Controller
                            name="id_guia_madre"
                            control={control}
                            render={({ field }) => (
                                <select
                                    className="select select-bordered w-full"
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleChangeGuia(e.target.value);
                                    }}
                                    disabled={guias.length === 0 || disabled}
                                >
                                    <option value="">Seleccione una guía madre</option>
                                    {guias.map(guia => (
                                        <option key={guia.id} value={guia.id}>
                                            {guia.prefijo}-{guia.secuencial}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                    )}
                </div>
            )}

            {/* Información de Guía Seleccionada */}
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
                            setValue('id_guia_madre', '');
                            setSelectedGuia(null);
                            if (onGuiaSelected) {
                                onGuiaSelected(null);
                            }
                        }}
                        disabled={disabled}
                    >
                        Cambiar
                    </button>
                </div>
            )}

            {loadingGuiaDetails && (
                <div className="flex items-center mt-2">
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    <span className="text-sm">Cargando información de la guía...</span>
                </div>
            )}
        </div>
    );
};