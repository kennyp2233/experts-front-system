// src/hooks/useCatalogs.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { baseUrl } from '@/api/mantenimiento/config.api';


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
                    axios.get(`${baseUrl}/consignatariosJoinAll`),
                    axios.get(`${baseUrl}/asignacion/aerolineas`),
                    axios.get(`${baseUrl}/productos`),
                    axios.get(`${baseUrl}/agencias_iata`),
                    axios.get(`${baseUrl}/destinos`),
                    axios.get(`${baseUrl}/origenes`)
                ]);

                setState({
                    consignatarios: consignatariosRes.data,
                    aerolineas: aerolineasRes.data,
                    productos: productosRes.data,
                    agenciasIata: agenciasRes.data,
                    destinos: destinosRes.data,
                    origenes: origenesRes.data,
                    loading: false,
                    error: null
                });
            } catch (error) {
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