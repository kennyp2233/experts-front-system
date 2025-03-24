// src/components/sistema/common/form/SelectField.tsx
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface SelectFieldProps {
    name: string;
    label: string;
    options: any[];
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    nameKey?: string;
    valueKey?: string;
    guiaLabel?: boolean;
    className?: string;
    helpText?: string;
    onChange?: (value: any) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    name,
    label,
    options,
    required = false,
    disabled = false,
    placeholder = 'Seleccionar...',
    nameKey = 'nombre',
    valueKey = 'id',
    guiaLabel = false,
    className = '',
    helpText,
    onChange,
}) => {
    const { control, formState: { errors } } = useFormContext();
    const errorMessage = errors[name]?.message as string;

    return (
        <div className="form-control w-full">
            <label className="label" htmlFor={name}>
                <span className="label-text font-medium">
                    {label} {required && <span className="text-error">*</span>}
                </span>
            </label>

            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <select
                        id={name}
                        disabled={disabled}
                        className={`select select-bordered w-full ${errorMessage ? 'select-error' : ''} ${className}`}
                        value={field.value || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value);
                            if (onChange) onChange(value);
                        }}
                    >
                        <option value="">{placeholder}</option>
                        {options.map(option => {
                            const key = option[valueKey] ?? option.id ?? option[Object.keys(option)[0]];
                            const displayValue = guiaLabel
                                ? `${option.prefijo}-${option.secuencial}`
                                : option[nameKey] || option[Object.keys(option)[1]];

                            return (
                                <option key={key} value={key}>
                                    {displayValue}
                                </option>
                            );
                        })}
                    </select>
                )}
            />

            {helpText && !errorMessage && (
                <label className="label">
                    <span className="label-text-alt text-base-content/70">{helpText}</span>
                </label>
            )}

            {errorMessage && (
                <label className="label">
                    <span className="label-text-alt text-error">{errorMessage}</span>
                </label>
            )}
        </div>
    );
};