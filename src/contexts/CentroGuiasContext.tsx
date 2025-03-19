// src/contexts/CentroGuiasContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { coordinacionesService } from '@/api/services/documentos/coordinacionesService';
import { fincasService } from '@/api/services/mantenimiento/fincasService';

interface CentroGuiasContextType {
    documentos: any[];
    fincas: any[];
    refreshDocumentos: () => Promise<void>;
    loading: boolean;
    error: string | null;
    selectedDocumentoId: number | null;
    setSelectedDocumentoId: (id: number | null) => void;
}

const CentroGuiasContext = createContext<CentroGuiasContextType | undefined>(undefined);

export const CentroGuiasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [documentos, setDocumentos] = useState<any[]>([]);
    const [fincas, setFincas] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDocumentoId, setSelectedDocumentoId] = useState<number | null>(null);

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [coordinacionesRes, fincasRes] = await Promise.all([
                    coordinacionesService.getDocuments(),
                    fincasService.getFincas()
                ]);

                setDocumentos(coordinacionesRes.data);
                setFincas(fincasRes);
            } catch (error) {
                console.error('Error cargando datos para Centro de Guías:', error);
                setError('Error al cargar datos iniciales');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Función para refrescar datos de documentos
    const refreshDocumentos = async () => {
        setLoading(true);
        try {
            const response = await coordinacionesService.getDocuments();
            setDocumentos(response.data);
        } catch (error) {
            console.error('Error al refrescar documentos:', error);
            setError('Error al actualizar los documentos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CentroGuiasContext.Provider
            value={{
                documentos,
                fincas,
                refreshDocumentos,
                loading,
                error,
                selectedDocumentoId,
                setSelectedDocumentoId
            }}
        >
            {children}
        </CentroGuiasContext.Provider>
    );
};

export const useCentroGuias = () => {
    const context = useContext(CentroGuiasContext);
    if (context === undefined) {
        throw new Error('useCentroGuias debe ser usado dentro de un CentroGuiasProvider');
    }
    return context;
};