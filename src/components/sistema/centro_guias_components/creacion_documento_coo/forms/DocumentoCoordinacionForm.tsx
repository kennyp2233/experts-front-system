// src/components/sistema/centro_guias_components/forms/DocumentoCoordinacionForm.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from '@/components/sistema/common/form';
import { AppIcons } from '@/utils/icons';

interface DocumentoCoordinacionFormProps {
    catalogs: {
        consignatarios: any[];
        productos: any[];
        agenciasIata: any[];
        destinos: any[];
        origenes: any[];
        aerolineas: any[];
    };
    disabled?: boolean;
}

export const DocumentoCoordinacionForm: React.FC<DocumentoCoordinacionFormProps> = ({
    catalogs,
    disabled = false
}) => {
    const { formState: { errors } } = useFormContext();
    const { consignatarios, productos, agenciasIata, destinos, origenes, aerolineas } = catalogs;

    return (
        <div className="grid md:grid-cols-2 gap-4">
            {/* Consignatario */}
            <FormField
                label="Consignatario"
                name="id_consignatario"
                type="select"
                options={consignatarios.map(c => ({
                    value: c.id_consignatario,
                    label: c.nombre_consignatario || c.nombre
                }))}
                required
                disabled={disabled}
            />

            {/* Producto */}
            <FormField
                label="Producto"
                name="id_producto"
                type="select"
                options={productos.map(p => ({
                    value: p.id_producto,
                    label: p.nombre
                }))}
                required
                disabled={disabled}
            />

            {/* Agencia IATA */}
            <FormField
                label="Agencia IATA"
                name="id_agencia_iata"
                type="select"
                options={agenciasIata.map(a => ({
                    value: a.id_agencia_iata,
                    label: `${a.alias_shipper || a.nombre} ${a.iata_code_carrier ? `(${a.iata_code_carrier})` : ''}`
                }))}
                required
                disabled={disabled}
            />

            {/* Destino AWB */}
            <FormField
                label="Destino AWB"
                name="id_destino_awb"
                type="select"
                options={destinos.map(d => ({
                    value: d.id_destino,
                    label: `${d.nombre} ${d.codigo ? `(${d.codigo})` : ''}`
                }))}
                required
                disabled={disabled}
            />

            {/* Destino Final Docs */}
            <FormField
                label="Destino Final Docs"
                name="id_destino_final_docs"
                type="select"
                options={destinos.map(d => ({
                    value: d.id_destino,
                    label: `${d.nombre} ${d.codigo ? `(${d.codigo})` : ''}`
                }))}
                required
                disabled={disabled}
            />

            {/* Tipo de Pago */}
            <FormField
                label="Tipo de Pago"
                name="pago"
                type="radio"
                options={[
                    { value: 'PREPAID', label: 'PREPAID' },
                    { value: 'COLLECT', label: 'COLLECT' }
                ]}
                required
                disabled={disabled}
            />

            {/* Fecha de Vuelo */}
            <FormField
                label="Fecha de Vuelo"
                name="fecha_vuelo"
                type="date"
                required
                disabled={disabled}
            />

            {/* Fecha de Asignación */}
            <FormField
                label="Fecha de Asignación"
                name="fecha_asignacion"
                type="date"
                required
                disabled={disabled}
            />
        </div>
    );
};