// src/components/sistema/centro_guias_components/common/TablaRelacionesGuia.tsx
import React from 'react';
import { AppIcons } from '@/utils/icons';

interface TablaRelacionesGuiaProps {
    guiasHijas?: any[];
    documentosCoordinacion?: any[];
    tipo: 'guiasHijas' | 'documentos';
    title?: string;
    empty?: string;
    onView?: (id: number) => void;
    onDelete?: (id: number) => void;
    loading?: boolean;
    compact?: boolean;
}

export const TablaRelacionesGuia: React.FC<TablaRelacionesGuiaProps> = ({
    guiasHijas = [],
    documentosCoordinacion = [],
    tipo,
    title = tipo === 'guiasHijas' ? 'Guías Hijas Asociadas' : 'Documentos de Coordinación',
    empty = `No hay ${tipo === 'guiasHijas' ? 'guías hijas' : 'documentos'} asociados`,
    onView,
    onDelete,
    loading = false,
    compact = false
}) => {
    // Determinar qué datos mostrar según el tipo
    const datos = tipo === 'guiasHijas' ? guiasHijas : documentosCoordinacion;

    // Renderizado condicional según tipo
    const renderTabla = () => {
        if (loading) {
            return (
                <div className="flex justify-center py-4">
                    <span className="loading loading-spinner loading-md"></span>
                </div>
            );
        }

        if (datos.length === 0) {
            return (
                <div className="alert alert-info">
                    <AppIcons.Info className="w-6 h-6" />
                    <span>{empty}</span>
                </div>
            );
        }

        if (tipo === 'guiasHijas') {
            return (
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Número</th>
                            <th>Finca</th>
                            {!compact && <th>Fecha</th>}
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guiasHijas.map((guia) => (
                            <tr key={guia.id}>
                                <td className="font-mono">
                                    {guia.anio}-{guia.secuencial.toString().padStart(4, '0')}
                                </td>
                                <td>{guia.fincaNombre || 'No especificada'}</td>
                                {!compact && (
                                    <td>{new Date(guia.createdAt).toLocaleDateString()}</td>
                                )}
                                <td className="text-center">
                                    <div className="flex justify-center gap-2">
                                        {onView && (
                                            <button
                                                className="btn btn-sm btn-info"
                                                onClick={() => onView(guia.id)}
                                            >
                                                <AppIcons.Search className="w-4 h-4" />
                                                {!compact && 'Ver'}
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                className="btn btn-sm btn-error"
                                                onClick={() => onDelete(guia.id)}
                                            >
                                                <AppIcons.Delete className="w-4 h-4" />
                                                {!compact && 'Eliminar'}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else {
            return (
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>COO</th>
                            <th>Consignatario</th>
                            {!compact && <th>Producto</th>}
                            <th>Fecha</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documentosCoordinacion.map((doc) => (
                            <tr key={doc.id}>
                                <td>{doc.cooLabel || `COO-${doc.id.toString().padStart(7, '0')}`}</td>
                                <td>{doc.consignatarioNombre || 'No especificado'}</td>
                                {!compact && (
                                    <td>{doc.productoNombre || 'No especificado'}</td>
                                )}
                                <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                                <td className="text-center">
                                    <div className="flex justify-center gap-2">
                                        {onView && (
                                            <button
                                                className="btn btn-sm btn-info"
                                                onClick={() => onView(doc.id)}
                                            >
                                                <AppIcons.Search className="w-4 h-4" />
                                                {!compact && 'Ver'}
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                className="btn btn-sm btn-error"
                                                onClick={() => onDelete(doc.id)}
                                            >
                                                <AppIcons.Delete className="w-4 h-4" />
                                                {!compact && 'Eliminar'}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
    };

    return (
        <div className="space-y-4">
            {title && <h3 className="font-bold text-lg">{title}</h3>}
            {renderTabla()}
        </div>
    );
};
