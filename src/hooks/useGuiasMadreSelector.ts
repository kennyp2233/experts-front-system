// src/hooks/useGuiasMadreSelector.ts
import { useState, useCallback } from 'react';
import { guiasMadreService } from '@/api/services/documentos/guiasMadreService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';

export const useGuiasMadreSelector = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedGuia, setSelectedGuia] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = useCallback(async () => {
        if (!searchTerm) {
            dispatchMenssage('error', 'Ingrese un número de guía madre para buscar');
            return;
        }

        setIsSearching(true);
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
                dispatchMenssage('info', 'No se encontraron guías madre disponibles con ese criterio');
            }
        } catch (error) {
            console.error('Error al buscar guía madre:', error);
            dispatchMenssage('error', 'Error al buscar guía madre');
        } finally {
            setIsSearching(false);
        }
    }, [searchTerm]);

    const selectGuia = useCallback((guia: any) => {
        setSelectedGuia(guia);
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedGuia(null);
    }, []);

    return {
        searchTerm,
        setSearchTerm,
        searchResults,
        selectedGuia,
        isSearching,
        handleSearch,
        selectGuia,
        clearSelection
    };
};