// src/components/sistema/common/form/FormField.tsx
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { AppIcons } from '@/utils/icons';

interface FormFieldProps {
    name: string;
    label: string;
    type?: 'text' | 'number' | 'select' | 'date' | 'radio' | 'checkbox' | 'textarea' | 'password' | 'email' | 'tel';
    options?: { value: string | number; label: string }[];
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    min?: number;
    max?: number;
    step?: number;
    rows?: number;
    icon?: React.ReactNode;
    tooltip?: string;
    helpText?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
    name,
    label,
    type = 'text',
    options = [],
    required = false,
    disabled = false,
    placeholder = '',
    className = '',
    min,
    max,
    step,
    rows = 3,
    icon,
    tooltip,
    helpText,
}) => {
    const { control, formState: { errors } } = useFormContext();
    const errorMessage = errors[name]?.message as string | undefined;

    const renderField = (field: any) => {
        switch (type) {
            case 'select':
                return (
                    <select
                        {...field}
                        id={name}
                        disabled={disabled}
                        className={`select select-bordered w-full ${errorMessage ? 'select-error' : ''} ${className}`}
                    >
                        <option value="">{placeholder || 'Seleccionar...'}</option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'radio':
                return (
                    <div className="flex gap-2">
                        {options.map((option) => (
                            <label key={option.value} className="label cursor-pointer border rounded-lg px-4 flex-1 justify-center">
                                <input
                                    type="radio"
                                    className="radio radio-primary mr-2"
                                    disabled={disabled}
                                    value={option.value}
                                    onChange={() => field.onChange(option.value)}
                                    checked={field.value === option.value}
                                />
                                <span className="label-text">{option.label}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="form-control">
                        <label className="cursor-pointer flex items-center">
                            <input
                                type="checkbox"
                                {...field}
                                onChange={(e) => field.onChange(e.target.checked)}
                                checked={field.value}
                                className="checkbox checkbox-primary mr-2"
                                disabled={disabled}
                            />
                            <span className="label-text">{placeholder || ''}</span>
                        </label>
                    </div>
                );

            case 'textarea':
                return (
                    <textarea
                        {...field}
                        id={name}
                        disabled={disabled}
                        placeholder={placeholder}
                        rows={rows}
                        className={`textarea textarea-bordered w-full ${errorMessage ? 'textarea-error' : ''} ${className}`}
                    />
                );

            default:
                return (
                    <div className="input-group">
                        {icon && (
                            <span className="px-2 flex items-center bg-base-300">
                                {icon}
                            </span>
                        )}
                        <input
                            {...field}
                            type={type}
                            id={name}
                            disabled={disabled}
                            placeholder={placeholder}
                            min={min}
                            max={max}
                            step={step}
                            className={`input input-bordered w-full ${errorMessage ? 'input-error' : ''} ${className}`}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="form-control w-full">
            <label className="label" htmlFor={name}>
                <span className="label-text font-medium">
                    {label} {required && <span className="text-error">*</span>}
                    {tooltip && (
                        <div className="tooltip tooltip-info ml-1" data-tip={tooltip}>
                            <AppIcons.Info className="w-4 h-4 opacity-70" />
                        </div>
                    )}
                </span>
            </label>

            <Controller
                name={name}
                control={control}
                render={({ field }) => renderField(field)}
            />

            {helpText && !errorMessage && (
                <label className="label">
                    <span className="label-text-alt text-base-content/70">{helpText}</span>
                </label>
            )}

            {errorMessage && (
                <label className="label">
                    <span className="label-text-alt text-error flex items-center">
                        <AppIcons.Error className="w-3 h-3 mr-1" />
                        {errorMessage}
                    </span>
                </label>
            )}
        </div>
    );
};