// src/components/sistema/centro_guias_components/forms/RutasForm.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from '@/components/sistema/common/form';

interface RutasFormProps {
    destinos: any[];
    aerolineas: any[];
    origenes: any[];
    disabled?: boolean;
}

export const RutasForm: React.FC<RutasFormProps> = ({
    destinos,
    aerolineas,
    origenes,
    disabled = false
}) => {
    const { formState: { errors } } = useFormContext();

    return (
        <>
            {/* Ruta 1 */}
            <div className="mb-4">
                <h4 className="font-medium mb-2">Ruta 1</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Origen */}
                    <div>
                        <FormField
                            label="Origen"
                            name="from1"
                            type="select"
                            options={origenes.map(o => ({
                                value: o.id_origen,
                                label: `${o.nombre} ${o.codigo_origen ? `(${o.codigo_origen})` : ''}`
                            }))}
                            disabled={disabled}
                        />
                    </div>

                    {/* Aerolínea */}
                    <div>
                        <FormField
                            label="Aerolínea"
                            name="by1"
                            type="select"
                            options={aerolineas.map(a => ({
                                value: a.id_aerolinea,
                                label: `${a.nombre} ${a.codigo ? `(${a.codigo})` : ''}`
                            }))}
                            disabled={disabled}
                        />
                    </div>
                </div>
            </div>

            {/* Ruta 2 */}
            <div className="mb-4">
                <h4 className="font-medium mb-2">Ruta 2 (opcional)</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Destino */}
                    <div>
                        <FormField
                            label="Destino"
                            name="to2"
                            type="select"
                            options={destinos.map(d => ({
                                value: d.id_destino,
                                label: `${d.nombre} ${d.codigo ? `(${d.codigo})` : ''}`
                            }))}
                            disabled={disabled}
                        />
                    </div>

                    {/* Aerolínea */}
                    <div>
                        <FormField
                            label="Aerolínea"
                            name="by2"
                            type="select"
                            options={aerolineas.map(a => ({
                                value: a.id_aerolinea,
                                label: `${a.nombre} ${a.codigo ? `(${a.codigo})` : ''}`
                            }))}
                            disabled={disabled}
                        />
                    </div>
                </div>
            </div>

            {/* Ruta 3 */}
            <div>
                <h4 className="font-medium mb-2">Ruta 3 (opcional)</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Destino */}
                    <div>
                        <FormField
                            label="Destino"
                            name="to3"
                            type="select"
                            options={destinos.map(d => ({
                                value: d.id_destino,
                                label: `${d.nombre} ${d.codigo ? `(${d.codigo})` : ''}`
                            }))}
                            disabled={disabled}
                        />
                    </div>

                    {/* Aerolínea */}
                    <div>
                        <FormField
                            label="Aerolínea"
                            name="by3"
                            type="select"
                            options={aerolineas.map(a => ({
                                value: a.id_aerolinea,
                                label: `${a.nombre} ${a.codigo ? `(${a.codigo})` : ''}`
                            }))}
                            disabled={disabled}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};