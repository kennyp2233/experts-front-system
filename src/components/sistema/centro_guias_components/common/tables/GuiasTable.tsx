// src/components/sistema/documentos_components/tables/GuiasTable.tsx
import React from 'react';
import { AppIcons } from '@/utils/icons';

interface GuiaTableProps {
    guias: any[];
    onSelectGuia?: (guia: any) => void;
    onDeleteGuia?: (id: number) => void;
    showActions?: boolean;
    isLoading?: boolean;
}

export const GuiasTable: React.FC<GuiaTableProps> = ({
    guias,
    onSelectGuia,
    onDeleteGuia,
    showActions = true,
    isLoading = false
}) => {
    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (guias.length === 0) {
        return (
            <div className="alert alert-info">
                <AppIcons.Info className="w-6 h-6" />
                <span>No hay guías disponibles</span>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Prefijo</th>
                        <th>Secuencial</th>
                        {showActions && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {guias.map((guia) => (
                        <tr key={guia.id}>
                            <td>{guia.id}</td>
                            <td>{guia.prefijo}</td>
                            <td>{guia.secuencial}</td>
                            {showActions && (
                                <td>
                                    <div className="flex space-x-2">
                                        {onSelectGuia && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-primary"
                                                onClick={() => onSelectGuia(guia)}
                                            >
                                                <AppIcons.Search className="w-4 h-4 mr-1" />
                                                Seleccionar
                                            </button>
                                        )}
                                        {onDeleteGuia && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-error"
                                                onClick={() => onDeleteGuia(guia.id)}
                                            >
                                                <AppIcons.Delete className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};