// src/components/sistema/centro_guias_components/hooks/useGuiasMadreForm.ts
import { useState, useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { guiasMadreService } from '@/api/services/documentos/guiasMadreService';
import { aerolineasService } from '@/api/services/mantenimiento/aerolineasService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';

interface UseGuiasMadreFormProps {
    methods: UseFormReturn<any>;
    onSuccess?: (data: any) => void;
    prestamoMode?: boolean;
    initialId?: number;
}

export const useGuiasMadreForm = ({
    methods,
    onSuccess,
    prestamoMode = false,
    initialId
}: UseGuiasMadreFormProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [guia, setGuia] = useState<any | null>(null);
    const [aerolinea, setAerolinea] = useState<any | null>(null);

    // Cargar guía inicial si se proporciona un ID
    useEffect(() => {
        if (initialId) {
            fetchGuiaById(initialId);
        }
    }, [initialId]);

    // Buscar guía por ID
    const fetchGuiaById = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const guiaData = await guiasMadreService.getGuiaMadreById(id);
            setGuia(guiaData);

            // Si la guía tiene información de aerolínea, cargarla
            if (guiaData.documento_base?.id_aerolinea) {
                try {
                    const aerolineaData = await aerolineasService.findOneComplete(guiaData.documento_base.id_aerolinea);
                    setAerolinea(aerolineaData);
                } catch (error) {
                    console.error('Error al cargar detalles de la aerolínea:', error);
                }
            }

            return guiaData;
        } catch (error) {
            console.error('Error al cargar guía madre:', error);
            setError('Error al cargar guía madre');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Prestar guía
    const prestarGuia = async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            const observaciones = data.observaciones_prestamo || '';
            const result = await guiasMadreService.prestarGuiaMadre(data.id_guia_madre, observaciones);

            dispatchMenssage('success', 'Guía prestada correctamente');
            if (onSuccess) onSuccess(result);

            return result;
        } catch (error) {
            console.error('Error al prestar guía madre:', error);
            setError('Error al prestar guía. Verifique que no esté ya prestada.');
            dispatchMenssage('error', 'Error al prestar guía madre');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Devolver guía
    const devolverGuia = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const result = await guiasMadreService.devolverGuiaMadre(id);

            dispatchMenssage('success', 'Guía devuelta correctamente');
            if (onSuccess) onSuccess(result);

            return result;
        } catch (error) {
            console.error('Error al devolver guía madre:', error);
            setError('Error al devolver guía. Verifique que esté prestada.');
            dispatchMenssage('error', 'Error al devolver guía madre');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Manejar envío del formulario
    const handleSubmit = async (data: any) => {
        if (prestamoMode) {
            return prestarGuia(data);
        } else {
            return devolverGuia(data.id_guia_madre);
        }
    };

    return {
        loading,
        error,
        guia,
        aerolinea,
        handleSubmit,
        fetchGuiaById,
        setError
    };
};