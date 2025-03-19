// src/components/sistema/documentos_components/forms/RutasForm.tsx
import React from 'react';

interface RutasSectionProps {
    formData: any;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    destinos: any[];
    aerolineas: any[];
    disabled?: boolean;
}

export const RutasForm: React.FC<RutasSectionProps> = ({
    formData,
    onChange,
    destinos,
    aerolineas,
    disabled = false
}) => {
    return (
        <>
            {/* Ruta 1 */}
            <div className="mb-4">
                <h4 className="font-medium mb-2">Ruta 1</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Origen */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Aerolínea</span>
                        </label>
                        <select
                            name="by1"
                            className="select select-bordered w-full"
                            value={formData.by1 || ''}
                            onChange={onChange}
                            disabled={disabled}
                        >
                            <option value="">Seleccionar aerolínea</option>
                            {aerolineas.map(a => (
                                <option key={a.id_aerolinea} value={a.id_aerolinea}>
                                    {a.nombre} {a.codigo ? `(${a.codigo})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Ruta 2 */}
            <div className="mb-4">
                <h4 className="font-medium mb-2">Ruta 2 (opcional)</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Destino */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Destino</span>
                        </label>
                        <select
                            name="to2"
                            className="select select-bordered w-full"
                            value={formData.to2 || ''}
                            onChange={onChange}
                            disabled={disabled}
                        >
                            <option value="">Seleccionar destino</option>
                            {destinos.map(d => (
                                <option key={d.id_destino} value={d.id_destino}>
                                    {d.nombre} {d.codigo ? `(${d.codigo})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Aerolínea */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Aerolínea</span>
                        </label>
                        <select
                            name="by2"
                            className="select select-bordered w-full"
                            value={formData.by2 || ''}
                            onChange={onChange}
                            disabled={disabled}
                        >
                            <option value="">Seleccionar aerolínea</option>
                            {aerolineas.map(a => (
                                <option key={a.id_aerolinea} value={a.id_aerolinea}>
                                    {a.nombre} {a.codigo ? `(${a.codigo})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Ruta 3 */}
            <div>
                <h4 className="font-medium mb-2">Ruta 3 (opcional)</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Destino */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Destino</span>
                        </label>
                        <select
                            name="to3"
                            className="select select-bordered w-full"
                            value={formData.to3 || ''}
                            onChange={onChange}
                            disabled={disabled}
                        >
                            <option value="">Seleccionar destino</option>
                            {destinos.map(d => (
                                <option key={d.id_destino} value={d.id_destino}>
                                    {d.nombre} {d.codigo ? `(${d.codigo})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Aerolínea */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Aerolínea</span>
                        </label>
                        <select
                            name="by3"
                            className="select select-bordered w-full"
                            value={formData.by3 || ''}
                            onChange={onChange}
                            disabled={disabled}
                        >
                            <option value="">Seleccionar aerolínea</option>
                            {aerolineas.map(a => (
                                <option key={a.id_aerolinea} value={a.id_aerolinea}>
                                    {a.nombre} {a.codigo ? `(${a.codigo})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
};