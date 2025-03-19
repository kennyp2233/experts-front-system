// src/components/sistema/documentos_components/forms/DocumentoCoordinacionForm.tsx
import React from 'react';
import { AppIcons } from '@/utils/icons';

interface FormFieldProps {
    label: string;
    name: string;
    type: 'text' | 'number' | 'select' | 'date' | 'radio';
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    options?: { value: string | number; label: string }[];
    error?: string;
    required?: boolean;
    disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    name,
    type,
    value,
    onChange,
    options = [],
    error,
    required = false,
    disabled = false
}) => {
    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text font-medium">
                    {label} {required && <span className="text-error">*</span>}
                </span>
            </label>

            {type === 'select' ? (
                <select
                    name={name}
                    id={name}
                    className={`select select-bordered w-full ${error ? 'select-error' : ''}`}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                >
                    <option value="">Seleccionar...</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : type === 'radio' ? (
                <div className="flex gap-2">
                    {options.map((option) => (
                        <label key={option.value} className="label cursor-pointer border rounded-lg px-4 flex-1 justify-center">
                            <input
                                type="radio"
                                className="radio radio-primary mr-2"
                                name={name}
                                value={option.value}
                                checked={value === option.value}
                                onChange={onChange}
                                disabled={disabled}
                            />
                            <span className="label-text">{option.label}</span>
                        </label>
                    ))}
                </div>
            ) : (
                <input
                    type={type}
                    name={name}
                    id={name}
                    className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                />
            )}

            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
};

interface DocumentoCoordinacionFormProps {
    formData: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    errors: Record<string, string>;
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
    formData,
    onChange,
    errors,
    catalogs,
    disabled = false
}) => {
    const { consignatarios, productos, agenciasIata, destinos, origenes, aerolineas } = catalogs;

    return (
        <div className="grid md:grid-cols-2 gap-4">
            {/* Consignatario */}
            <FormField
                label="Consignatario"
                name="id_consignatario"
                type="select"
                value={formData.id_consignatario}
                onChange={onChange}
                options={consignatarios.map(c => ({ value: c.id_consignatario, label: c.nombre }))}
                error={errors.id_consignatario}
                required
                disabled={disabled}
            />

            {/* Producto */}
            <FormField
                label="Producto"
                name="id_producto"
                type="select"
                value={formData.id_producto}
                onChange={onChange}
                options={productos.map(p => ({ value: p.id_producto, label: p.nombre }))}
                error={errors.id_producto}
                required
                disabled={disabled}
            />

            {/* Agencia IATA */}
            <FormField
                label="Agencia IATA"
                name="id_agencia_iata"
                type="select"
                value={formData.id_agencia_iata}
                onChange={onChange}
                options={agenciasIata.map(a => ({
                    value: a.id_agencia_iata,
                    label: `${a.alias_shipper || a.nombre} ${a.iata_code_carrier ? `(${a.iata_code_carrier})` : ''}`
                }))}
                error={errors.id_agencia_iata}
                required
                disabled={disabled}
            />

            {/* Destino AWB */}
            <FormField
                label="Destino AWB"
                name="id_destino_awb"
                type="select"
                value={formData.id_destino_awb}
                onChange={onChange}
                options={destinos.map(d => ({
                    value: d.id_destino,
                    label: `${d.nombre} ${d.codigo ? `(${d.codigo})` : ''}`
                }))}
                error={errors.id_destino_awb}
                required
                disabled={disabled}
            />

            {/* Destino Final Docs */}
            <FormField
                label="Destino Final Docs"
                name="id_destino_final_docs"
                type="select"
                value={formData.id_destino_final_docs}
                onChange={onChange}
                options={destinos.map(d => ({
                    value: d.id_destino,
                    label: `${d.nombre} ${d.codigo ? `(${d.codigo})` : ''}`
                }))}
                error={errors.id_destino_final_docs}
                required
                disabled={disabled}
            />

            {/* Tipo de Pago */}
            <FormField
                label="Tipo de Pago"
                name="pago"
                type="radio"
                value={formData.pago}
                onChange={onChange}
                options={[
                    { value: 'PREPAID', label: 'PREPAID' },
                    { value: 'COLLECT', label: 'COLLECT' }
                ]}
                error={errors.pago}
                required
                disabled={disabled}
            />

            {/* Fecha de Vuelo */}
            <FormField
                label="Fecha de Vuelo"
                name="fecha_vuelo"
                type="date"
                value={formData.fecha_vuelo}
                onChange={onChange}
                error={errors.fecha_vuelo}
                required
                disabled={disabled}
            />

            {/* Fecha de Asignación */}
            <FormField
                label="Fecha de Asignación"
                name="fecha_asignacion"
                type="date"
                value={formData.fecha_asignacion}
                onChange={onChange}
                error={errors.fecha_asignacion}
                required
                disabled={disabled}
            />
        </div>
    );
};