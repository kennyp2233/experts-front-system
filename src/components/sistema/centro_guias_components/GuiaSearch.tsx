// src/components/sistema/centro_guias_components/GuiaSearch.tsx
import React, { useState } from 'react';
import { AppIcons } from '@/utils/icons';
import { GuiaMadreSelector } from './common/GuiaMadreSelector';
import { guiasHijasService } from '@/api/services/documentos/guiasHijasService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';

interface GuiaSearchProps {
    onGuiaHijaFound?: (guiaHija: any) => void;
    onGuiaMadreFound?: (guiaMadre: any) => void;
    defaultSearchType?: 'madre' | 'hija';
    compact?: boolean;
}

export const GuiaSearch: React.FC<GuiaSearchProps> = ({
    onGuiaHijaFound,
    onGuiaMadreFound,
    defaultSearchType = 'madre',
    compact = false
}) => {
    const [searchType, setSearchType] = useState<'madre' | 'hija'>(defaultSearchType);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Búsqueda de guía hija
    const handleGuiaHijaSearch = async () => {
        if (!searchTerm) {
            setError('Ingrese un número de guía hija para buscar');
            return;
        }

        setIsSearching(true);
        setError(null);

        try {
            // Formato esperado: AAAA-SECUENCIAL (2023-0001)
            const [anio, secuencial] = searchTerm.split('-');

            if (!anio || !secuencial || isNaN(Number(anio)) || isNaN(Number(secuencial))) {
                throw new Error('Formato de guía incorrecto. Use el formato: AAAA-SECUENCIAL (ej: 2023-0001)');
            }

            // Buscar guías hijas (esto es un ejemplo, es posible que necesites adaptar la llamada API)
            const response = await guiasHijasService.getGuiasHijas(1, 10, {
                anio: Number(anio),
                secuencial: Number(secuencial)
            });

            if (response.data && response.data.length > 0) {
                const guiaHija = response.data[0];
                if (onGuiaHijaFound) {
                    onGuiaHijaFound(guiaHija);
                }
            } else {
                setError('No se encontró ninguna guía hija con esos datos');
                dispatchMenssage('info', 'No se encontró ninguna guía hija con esos datos');
            }
        } catch (error: any) {
            console.error('Error al buscar guía hija:', error);
            setError(error.message || 'Error al buscar guía hija');
            dispatchMenssage('error', 'Error al buscar guía hija');
        } finally {
            setIsSearching(false);
        }
    };

    // Renderizado condicional según tipo de búsqueda
    const renderSearchContent = () => {
        if (searchType === 'madre') {
            return (
                <div>
                    <GuiaMadreSelector
                        onGuiaSelected={onGuiaMadreFound}
                        onError={setError}
                    />
                </div>
            );
        } else {
            return (
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium">Buscar Guía Hija</span>
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Formato: AAAA-SECUENCIAL (ej: 2023-0001)"
                            className="input input-bordered w-full"
                            disabled={isSearching}
                        />
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleGuiaHijaSearch}
                            disabled={isSearching || !searchTerm}
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
            );
        }
    };

    return (
        <div className={`card bg-base-100 shadow-sm ${compact ? 'p-3' : 'p-5'}`}>
            <div className={compact ? 'mb-3' : 'mb-5'}>
                <div className="tabs tabs-boxed">
                    <a
                        className={`tab ${searchType === 'madre' ? 'tab-active' : ''}`}
                        onClick={() => setSearchType('madre')}
                    >
                        Guía Madre
                    </a>
                    <a
                        className={`tab ${searchType === 'hija' ? 'tab-active' : ''}`}
                        onClick={() => setSearchType('hija')}
                    >
                        Guía Hija
                    </a>
                </div>
            </div>

            {renderSearchContent()}
        </div>
    );
};