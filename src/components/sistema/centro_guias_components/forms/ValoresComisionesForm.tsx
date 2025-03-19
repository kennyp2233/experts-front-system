// src/components/sistema/documentos_components/forms/ValoresComisionesForm.tsx
import React from 'react';

interface ValorFieldProps {
    label: string;
    name: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    showCurrency?: boolean;
}

const ValorField: React.FC<ValorFieldProps> = ({
    label,
    name,
    value,
    onChange,
    disabled = false,
    showCurrency = true
}) => {
    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            {showCurrency ? (
                <label className="input-group">
                    <span className="font-mono">$</span>
                    <input
                        type="number"
                        step="0.01"
                        name={name}
                        className="input input-bordered w-full"
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                </label>
            ) : (
                <input
                    type="number"
                    step="0.01"
                    name={name}
                    className="input input-bordered w-full"
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                />
            )}
        </div>
    );
};

interface ValoresComisionesFormProps {
    formData: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

export const ValoresComisionesForm: React.FC<ValoresComisionesFormProps> = ({
    formData,
    onChange,
    disabled = false
}) => {
    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Costo Guía */}
                <ValorField
                    label="Costo Guía"
                    name="costo_guia_valor"
                    value={formData.costo_guia_valor}
                    onChange={onChange}
                    disabled={disabled}
                />

                {/* Combustible */}
                <ValorField
                    label="Combustible"
                    name="combustible_valor"
                    value={formData.combustible_valor}
                    onChange={onChange}
                    disabled={disabled}
                />

                {/* Seguridad */}
                <ValorField
                    label="Seguridad"
                    name="seguridad_valor"
                    value={formData.seguridad_valor}
                    onChange={onChange}
                    disabled={disabled}
                />

                {/* Tarifa Rate */}
                <ValorField
                    label="Tarifa Rate"
                    name="tarifa_rate"
                    value={formData.tarifa_rate}
                    onChange={onChange}
                    disabled={disabled}
                />

                {/* Char Weight */}
                <ValorField
                    label="Char Weight"
                    name="char_weight"
                    value={formData.char_weight}
                    onChange={onChange}
                    disabled={disabled}
                    showCurrency={false}
                />

                {/* Otros */}
                <ValorField
                    label="Otros Valores"
                    name="otros_valor"
                    value={formData.otros_valor}
                    onChange={onChange}
                    disabled={disabled}
                />
            </div>

            <div className="divider text-sm opacity-70">Valores Adicionales</div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Form A */}
                <ValorField
                    label="Form A"
                    name="form_a"
                    value={formData.form_a}
                    onChange={onChange}
                    disabled={disabled}
                    showCurrency={false}
                />

                {/* Transport */}
                <ValorField
                    label="Transport"
                    name="transport"
                    value={formData.transport}
                    onChange={onChange}
                    disabled={disabled}
                    showCurrency={false}
                />

                {/* PCA */}
                <ValorField
                    label="PCA"
                    name="pca"
                    value={formData.pca}
                    onChange={onChange}
                    disabled={disabled}
                    showCurrency={false}
                />

                {/* Fitos */}
                <ValorField
                    label="Fitos"
                    name="fitos"
                    value={formData.fitos}
                    onChange={onChange}
                    disabled={disabled}
                    showCurrency={false}
                />

                {/* Termografo */}
                <ValorField
                    label="Termógrafo"
                    name="termografo"
                    value={formData.termografo}
                    onChange={onChange}
                    disabled={disabled}
                    showCurrency={false}
                />

                {/* MCA */}
                <ValorField
                    label="MCA"
                    name="mca"
                    value={formData.mca}
                    onChange={onChange}
                    disabled={disabled}
                    showCurrency={false}
                />
            </div>
        </>
    );
};