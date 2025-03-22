// src/components/sistema/centro_guias_components/forms/ValoresComisionesForm.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { NumberField } from '@/components/sistema/common/form';

interface ValoresComisionesFormProps {
    disabled?: boolean;
    showCardLayout?: boolean;
}

export const ValoresComisionesForm: React.FC<ValoresComisionesFormProps> = ({
    disabled = false,
    showCardLayout = false
}) => {
    const { formState: { errors } } = useFormContext();

    const renderContent = () => (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Costo Guía */}
                <NumberField
                    name="costo_guia_valor"
                    label="Costo Guía"
                    disabled={disabled}
                    showCurrency={true}
                    min={0}
                />

                {/* Combustible */}
                <NumberField
                    name="combustible_valor"
                    label="Combustible"
                    disabled={disabled}
                    showCurrency={true}
                    min={0}
                />

                {/* Seguridad */}
                <NumberField
                    name="seguridad_valor"
                    label="Seguridad"
                    disabled={disabled}
                    showCurrency={true}
                    min={0}
                />

                {/* Tarifa Rate */}
                <NumberField
                    name="tarifa_rate"
                    label="Tarifa Rate"
                    disabled={disabled}
                    showCurrency={true}
                    min={0}
                />

                {/* Char Weight */}
                <NumberField
                    name="char_weight"
                    label="Char Weight"
                    disabled={disabled}
                    showCurrency={false}
                    min={0}
                />

                {/* Otros */}
                <NumberField
                    name="otros_valor"
                    label="Otros Valores"
                    disabled={disabled}
                    showCurrency={true}
                    min={0}
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
                    min={0}
                />

                {/* Transport */}
                <NumberField
                    name="transport"
                    label="Transport"
                    disabled={disabled}
                    showCurrency={false}
                    min={0}
                />

                {/* PCA */}
                <NumberField
                    name="pca"
                    label="PCA"
                    disabled={disabled}
                    showCurrency={false}
                    min={0}
                />

                {/* Fitos */}
                <NumberField
                    name="fitos"
                    label="Fitos"
                    disabled={disabled}
                    showCurrency={false}
                    min={0}
                />

                {/* Termografo */}
                <NumberField
                    name="termografo"
                    label="Termógrafo"
                    disabled={disabled}
                    showCurrency={false}
                    min={0}
                />

                {/* MCA */}
                <NumberField
                    name="mca"
                    label="MCA"
                    disabled={disabled}
                    showCurrency={false}
                    min={0}
                />

                {/* Tax */}
                <NumberField
                    name="tax"
                    label="Tax"
                    disabled={disabled}
                    showCurrency={false}
                    min={0}
                />

                {/* Auxiliary 1 Value */}
                <NumberField
                    name="aux1_valor"
                    label="Aux 1"
                    disabled={disabled}
                    showCurrency={true}
                    min={0}
                />

                {/* Auxiliary 2 Value */}
                <NumberField
                    name="aux2_valor"
                    label="Aux 2"
                    disabled={disabled}
                    showCurrency={true}
                    min={0}
                />

                {/* Auxiliary Calculation Value */}
                <NumberField
                    name="aux_calculo_valor"
                    label="Aux Cálculo"
                    disabled={disabled}
                    showCurrency={true}
                    min={0}
                />
            </div>
        </>
    );

    // Render with or without card layout
    if (showCardLayout) {
        return (
            <div className="card bg-base-200 p-6">
                <h3 className="font-bold mb-4">Valores y Comisiones</h3>
                {renderContent()}
            </div>
        );
    }

    return renderContent();
};