// src/components/sistema/common/form/NumberField.tsx
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface NumberFieldProps {
    name: string;
    label: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number | string;
    className?: string;
    helpText?: string;
    showCurrency?: boolean;
    currencySymbol?: string;
    onChange?: (value: number) => void;
}

export const NumberField: React.FC<NumberFieldProps> = ({
    name,
    label,
    required = false,
    disabled = false,
    placeholder = '',
    min,
    max,
    step = 0.01,
    className = '',
    helpText,
    showCurrency = false,
    currencySymbol = '$',
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
                    showCurrency ? (
                        <label className="input-group">
                            <span className="font-mono">{currencySymbol}</span>
                            <input
                                type="number"
                                id={name}
                                disabled={disabled}
                                placeholder={placeholder}
                                min={min}
                                max={max}
                                step={step}
                                className={`input input-bordered w-full ${errorMessage ? 'input-error' : ''} ${className}`}
                                value={field.value === 0 && !field.value ? '' : field.value}
                                onChange={(e) => {
                                    const value = e.target.value === '' ? '' : Number(e.target.value);
                                    field.onChange(value);
                                    if (onChange && typeof value === 'number') onChange(value);
                                }}
                            />
                        </label>
                    ) : (
                        <input
                            type="number"
                            id={name}
                            disabled={disabled}
                            placeholder={placeholder}
                            min={min}
                            max={max}
                            step={step}
                            className={`input input-bordered w-full ${errorMessage ? 'input-error' : ''} ${className}`}
                            value={field.value === 0 && !field.value ? '' : field.value}
                            onChange={(e) => {
                                const value = e.target.value === '' ? '' : Number(e.target.value);
                                field.onChange(value);
                                if (onChange && typeof value === 'number') onChange(value);
                            }}
                        />
                    )
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