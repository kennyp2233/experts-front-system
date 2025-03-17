// src/hooks/useCatalogosCoordinaciones.ts
import { useState, useEffect } from 'react';
import { consignatarioService } from '@/api/services/mantenimiento/consignatarioService';
import { aerolineasService } from '@/api/services/mantenimiento/aerolineasService';
import { productosService } from '@/api/services/mantenimiento/productosService';
import { agenciaIataService } from '@/api/services/mantenimiento/agenciasIataService';
import { destinosService } from '@/api/services/mantenimiento/destinosSevice';
import { origenesService } from '@/api/services/mantenimiento/origenesService';

interface CatalogsState {
    consignatarios: any[];
    aerolineas: any[];
    productos: any[];
    agenciasIata: any[];
    destinos: any[];
    origenes: any[];
    loading: boolean;
    error: Error | null;
}

export const useCatalogosCoordinaciones = () => {
    const [state, setState] = useState<CatalogsState>({
        consignatarios: [],
        aerolineas: [],
        productos: [],
        agenciasIata: [],
        destinos: [],
        origenes: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const [
                    consignatariosRes,
                    aerolineasRes,
                    productosRes,
                    agenciasRes,
                    destinosRes,
                    origenesRes
                ] = await Promise.all([
                    consignatarioService.getConsignatarios(),
                    aerolineasService.getAerolineas(),
                    productosService.getProductos(),
                    agenciaIataService.getAgenciasIata(),
                    destinosService.getDestinos(),
                    origenesService.getOrigenes()
                ]);

                setState({
                    consignatarios: consignatariosRes,
                    aerolineas: aerolineasRes,
                    productos: productosRes,
                    agenciasIata: agenciasRes,
                    destinos: destinosRes,
                    origenes: origenesRes,
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error('Error al cargar catálogos:', error);
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: error as Error
                }));
            }
        };

        fetchCatalogs();
    }, []);

    return state;
};