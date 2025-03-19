// src/components/sistema/centro_guias_components/forms/ValoresComisionesForm.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { NumberField } from '@/components/sistema/common/form';

interface ValoresComisionesFormProps {
    disabled?: boolean;
}

export const ValoresComisionesForm: React.FC<ValoresComisionesFormProps> = ({
    disabled = false
}) => {
    // No necesitamos extraer formData ni onChange ya que React Hook Form
    // maneja todo esto a través del contexto y los métodos del formulario
    const { formState: { errors } } = useFormContext();

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Costo Guía */}
                <NumberField
                    name="costo_guia_valor"
                    label="Costo Guía"
                    disabled={disabled}
                    showCurrency={true}
                />

                {/* Combustible */}
                <NumberField
                    name="combustible_valor"
                    label="Combustible"
                    disabled={disabled}
                    showCurrency={true}
                />

                {/* Seguridad */}
                <NumberField
                    name="seguridad_valor"
                    label="Seguridad"
                    disabled={disabled}
                    showCurrency={true}
                />

                {/* Tarifa Rate */}
                <NumberField
                    name="tarifa_rate"
                    label="Tarifa Rate"
                    disabled={disabled}
                    showCurrency={true}
                />

                {/* Char Weight */}
                <NumberField
                    name="char_weight"
                    label="Char Weight"
                    disabled={disabled}
                    showCurrency={false}
                />

                {/* Otros */}
                <NumberField
                    name="otros_valor"
                    label="Otros Valores"
                    disabled={disabled}
                    showCurrency={true}
                />
            </div>

            <div className="divider text-sm opacity-70">Valores Adicionales</div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Form A */}
                <NumberField
                    name="form_a"
                    label="Form A"
                    disabled={disabled}
                    showCurrency={false}
                />

                {/* Transport */}
                <NumberField
                    name="transport"
                    label="Transport"
                    disabled={disabled}
                    showCurrency={false}
                />

                {/* PCA */}
                <NumberField
                    name="pca"
                    label="PCA"
                    disabled={disabled}
                    showCurrency={false}
                />

                {/* Fitos */}
                <NumberField
                    name="fitos"
                    label="Fitos"
                    disabled={disabled}
                    showCurrency={false}
                />

                {/* Termografo */}
                <NumberField
                    name="termografo"
                    label="Termógrafo"
                    disabled={disabled}
                    showCurrency={false}
                />

                {/* MCA */}
                <NumberField
                    name="mca"
                    label="MCA"
                    disabled={disabled}
                    showCurrency={false}
                />
            </div>
        </>
    );
};