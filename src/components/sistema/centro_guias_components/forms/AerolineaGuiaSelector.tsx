// src/components/sistema/centro_guias_components/forms/AerolineaGuiaSelector.tsx
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { coordinacionesService } from '@/api/services/documentos/coordinacionesService';
import { aerolineasService } from '@/api/services/mantenimiento/aerolineasService';
import { guiasMadreService } from '@/api/services/documentos/guiasMadreService';
import { AppIcons } from '@/utils/icons';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { FormField } from '@/components/sistema/common/form';

interface AerolineaGuiaSelectorProps {
    onGuiaSelected?: (guia: any, aerolineaData?: any) => void;
    initialGuiaId?: number;
    disabled?: boolean;
}

export const AerolineaGuiaSelector: React.FC<AerolineaGuiaSelectorProps> = ({
    onGuiaSelected,
    initialGuiaId,
    disabled = false
}) => {
    const { setValue, watch } = useFormContext();
    const selectedAerolineaId = watch('selectedAerolineaId');
    const selectedGuiaId = watch('id_guia_madre');

    const [aerolineas, setAerolineas] = useState<any[]>([]);
    const [guias, setGuias] = useState<any[]>([]);
    const [selectedGuia, setSelectedGuia] = useState<any | null>(null);
    const [selectedAerolineaData, setSelectedAerolineaData] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingGuiaDetails, setLoadingGuiaDetails] = useState(false);
    const [loadingAerolineaDetails, setLoadingAerolineaDetails] = useState(false);

    // Cargar aerolíneas
    useEffect(() => {
        const fetchAerolineas = async () => {
            try {
                const data = await coordinacionesService.getAerolineas();
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

                        // Si la guía tiene asociada una aerolínea a través del documento base
                        if (guia.documento_base?.id_aerolinea) {
                            setValue('selectedAerolineaId', guia.documento_base.id_aerolinea);
                            fetchAerolineaDetails(guia.documento_base.id_aerolinea);
                        }
                    }
                } catch (error) {
                    console.error('Error al cargar guía inicial:', error);
                }
            };

            fetchInitialGuia();
        }
    }, [initialGuiaId, setValue]);

    // Cargar guías cuando cambia la aerolínea seleccionada
    useEffect(() => {
        if (!selectedAerolineaId) {
            setGuias([]);
            setSelectedGuia(null);
            setSelectedAerolineaData(null);
            return;
        }

        const fetchGuias = async () => {
            setLoading(true);
            try {
                // Cargar detalles de la aerolínea seleccionada
                await fetchAerolineaDetails(selectedAerolineaId);

                // Cargar guías disponibles para esta aerolínea
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

    // Función para cargar detalles completos de la aerolínea
    const fetchAerolineaDetails = async (aerolineaId: number) => {
        setLoadingAerolineaDetails(true);
        try {
            const aerolineaData = await aerolineasService.findOneComplete(aerolineaId);
            setSelectedAerolineaData(aerolineaData);

            // Inicializar valores del formulario con los datos de la plantilla de la aerolínea
            if (aerolineaData) {
                if (aerolineaData.costo_guia_valor !== undefined) {
                    setValue('costo_guia_valor', aerolineaData.costo_guia_valor);
                }
                if (aerolineaData.combustible_valor !== undefined) {
                    setValue('combustible_valor', aerolineaData.combustible_valor);
                }
                if (aerolineaData.seguridad_valor !== undefined) {
                    setValue('seguridad_valor', aerolineaData.seguridad_valor);
                }
                if (aerolineaData.aux_calculo_valor !== undefined) {
                    setValue('aux_calculo_valor', aerolineaData.aux_calculo_valor);
                }
                if (aerolineaData.otros_valor !== undefined) {
                    setValue('otros_valor', aerolineaData.otros_valor);
                }
                if (aerolineaData.aux1_valor !== undefined) {
                    setValue('aux1_valor', aerolineaData.aux1_valor);
                }
                if (aerolineaData.aux2_valor !== undefined) {
                    setValue('aux2_valor', aerolineaData.aux2_valor);
                }
                if (aerolineaData.tarifa_rate !== undefined) {
                    setValue('tarifa_rate', aerolineaData.tarifa_rate);
                }

                // Inicializar valores de rutas si existen
                if (aerolineaData.from1 !== undefined) {
                    setValue('from1', aerolineaData.from1);
                }
                if (aerolineaData.to1 !== undefined) {
                    setValue('to1', aerolineaData.to1);
                }
                if (aerolineaData.by1 !== undefined) {
                    setValue('by1', aerolineaData.by1);
                }
                if (aerolineaData.to2 !== undefined) {
                    setValue('to2', aerolineaData.to2);
                }
                if (aerolineaData.by2 !== undefined) {
                    setValue('by2', aerolineaData.by2);
                }
                if (aerolineaData.to3 !== undefined) {
                    setValue('to3', aerolineaData.to3);
                }
                if (aerolineaData.by3 !== undefined) {
                    setValue('by3', aerolineaData.by3);
                }
            }

            return aerolineaData;
        } catch (error) {
            console.error('Error al cargar detalles de la aerolínea:', error);
            dispatchMenssage('error', 'Error al cargar plantilla de la aerolínea');
            return null;
        } finally {
            setLoadingAerolineaDetails(false);
        }
    };

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
                    onGuiaSelected(guia, selectedAerolineaData);
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
    }, [selectedGuiaId, onGuiaSelected, selectedAerolineaData]);

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

            {loadingAerolineaDetails && (
                <div className="flex items-center justify-center py-2">
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    <span className="text-sm">Cargando plantilla de la aerolínea...</span>
                </div>
            )}

            {/* Selección de Guía Madre */}
            {selectedAerolineaId && (
                <div className="form-control">

                    {loading ? (
                        <div className="flex items-center space-x-2">
                            <span className="loading loading-spinner loading-sm"></span>
                            <span>Cargando guías...</span>
                        </div>
                    ) : (
                        <FormField
                            name="id_guia_madre"
                            label="Guía Madre"
                            type="select"
                            options={guias.map(guia => ({
                                value: guia.id,
                                label: `${guia.prefijo}-${guia.secuencial}`
                            }))}
                            disabled={guias.length === 0 || disabled}
                            placeholder="Seleccione una guía madre"
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

            {/* Información de la Plantilla de Aerolínea */}
            {selectedAerolineaData && (
                <div className="alert alert-info bg-info/10 border-info mt-4">
                    <AppIcons.Info className="w-6 h-6" />
                    <div>
                        <span className="font-semibold">Plantilla de Aerolínea Cargada:</span>
                        <br />
                        Se han inicializado los valores de comisión y rutas con la plantilla de la aerolínea.
                    </div>
                </div>
            )}
        </div>
    );
};