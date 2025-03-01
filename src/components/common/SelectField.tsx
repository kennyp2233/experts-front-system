import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';

interface SelectFieldProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    options: any[];
    required?: boolean;
    error?: string;
    disabled?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    nameKey?: string;
    guiaLabel?: boolean;
}

export function SelectField<T extends FieldValues>({
    label,
    name,
    register,
    options,
    required = false,
    error,
    disabled = false,
    onChange,
    nameKey = 'nombre',
    guiaLabel = false
}: SelectFieldProps<T>) {
    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <select
                className={`select select-bordered w-full ${error ? 'select-error' : ''}`}
                disabled={disabled}
                {...register(name, { required: required ? 'Este campo es requerido' : false })}
                onChange={onChange} // Se agrega el evento onChange
            >
                <option value="">Seleccionar...</option>
                {options.map(option => {
                    const key = option.id ?? option[Object.keys(option)[0]];
                    const displayValue = guiaLabel ? `${option.prefijo}-${option.secuencial}` : option[nameKey] || option[Object.keys(option)[1]];
                    return (
                        <option key={key} value={key}>
                            {displayValue}
                        </option>
                    );
                })}
            </select>
            {error && <span className="text-error text-sm mt-1">{error}</span>}
        </div>
    );
}
