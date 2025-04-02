// src/components/sistema/centro_guias_components/forms/RutasForm.tsx
import React, { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
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
    const { formState: { errors }, setValue, control } = useFormContext();

    // Observar los valores actuales para habilitación condicional
    const from1 = useWatch({ name: 'from1', control });
    const by1 = useWatch({ name: 'by1', control });
    const to2 = useWatch({ name: 'to2', control });
    const by2 = useWatch({ name: 'by2', control });

    // Prepara las opciones para los selectores
    const origenesOptions = origenes.map(o => ({
        value: o.id_origen,
        label: `${o.nombre || o.nombre_origen} ${o.codigo_origen ? `(${o.codigo_origen})` : ''}`
    }));

    const aerolineasOptions = aerolineas.map(a => ({
        value: a.id_aerolinea,
        label: `${a.nombre} ${a.codigo ? `(${a.codigo})` : ''}`
    }));

    const destinosOptions = destinos.map(d => ({
        value: d.id_destino,
        label: `${d.nombre} ${d.codigo ? `(${d.codigo})` : ''}`
    }));

    return (
        <div className="space-y-6">
            {/* Ruta 1 */}
            <div className="mb-4">
                <h4 className="font-medium mb-2">Ruta 1</h4>
                <div className="grid md:grid-cols-3 gap-4">
                    {/* Origen */}
                    <FormField
                        label="Origen"
                        name="from1"
                        type="select"
                        options={origenesOptions}
                        disabled={disabled}
                        placeholder="Seleccionar origen"
                    />

                    {/* Destino */}
                    <FormField
                        label="Destino"
                        name="to1"
                        type="select"
                        options={destinosOptions}
                        disabled={disabled}
                        placeholder="Seleccionar destino"
                    />

                    {/* Aerolínea */}
                    <FormField
                        label="Aerolínea"
                        name="by1"
                        type="select"
                        options={aerolineasOptions}
                        disabled={disabled}
                        placeholder="Seleccionar aerolínea"
                    />
                </div>
            </div>

            {/* Ruta 2 - Solo habilitada si se completó al menos parte de la ruta 1 */}
            <div className="mb-4">
                <h4 className="font-medium mb-2">Ruta 2 (opcional)</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Destino */}
                    <FormField
                        label="Destino"
                        name="to2"
                        type="select"
                        options={destinosOptions}
                        disabled={disabled || (!from1 && !by1)}
                        placeholder="Seleccionar destino"
                        helpText={(!from1 && !by1) ? "Complete la ruta 1 primero" : undefined}
                    />

                    {/* Aerolínea */}
                    <FormField
                        label="Aerolínea"
                        name="by2"
                        type="select"
                        options={aerolineasOptions}
                        disabled={disabled || (!from1 && !by1)}
                        placeholder="Seleccionar aerolínea"
                        helpText={(!from1 && !by1) ? "Complete la ruta 1 primero" : undefined}
                    />
                </div>
            </div>

            {/* Ruta 3 - Solo habilitada si se completó al menos parte de la ruta 2 */}
            <div>
                <h4 className="font-medium mb-2">Ruta 3 (opcional)</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Destino */}
                    <FormField
                        label="Destino"
                        name="to3"
                        type="select"
                        options={destinosOptions}
                        disabled={disabled || (!to2 && !by2)}
                        placeholder="Seleccionar destino"
                        helpText={(!to2 && !by2) ? "Complete la ruta 2 primero" : undefined}
                    />

                    {/* Aerolínea */}
                    <FormField
                        label="Aerolínea"
                        name="by3"
                        type="select"
                        options={aerolineasOptions}
                        disabled={disabled || (!to2 && !by2)}
                        placeholder="Seleccionar aerolínea"
                        helpText={(!to2 && !by2) ? "Complete la ruta 2 primero" : undefined}
                    />
                </div>
            </div>
        </div>
    );
};