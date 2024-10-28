'use client';

import React, { ChangeEvent } from 'react';

interface InputFieldProps {
    label: string;
    id: string;
    type: string;
    value: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    options?: any[];
    editable?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    id,
    type,
    value,
    onChange,
    options,
    editable = true
}) => (
    <div className="flex gap-3 items-center mb-4">
        <label className="font-bold w-1/3" htmlFor={id}>{label}</label>
        {type === 'select' && options ? (
            <select
                id={id}
                className="select select-bordered w-1/2"
                value={value}
                onChange={onChange}
                disabled={!editable}
            >
                <option value="">Seleccione una opción</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}

            </select>
        ) : (
            <input
                id={id}
                className="input input-bordered w-1/2"
                type={type}
                value={value}
                onChange={onChange}
                disabled={!editable}
            />
        )}
    </div>
);

export default InputField;
