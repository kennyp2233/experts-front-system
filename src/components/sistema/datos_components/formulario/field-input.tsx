import React from 'react';
import { FormField } from './types';

interface FieldInputProps {
    field: FormField;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const FieldInput: React.FC<FieldInputProps> = ({ field, value, onChange }) => {
    // Renderizar diferentes tipos de campos basados en field.type
    switch (field.type) {
        case 'select':
            return (
                <div className="self-center">
                    <label htmlFor={field.key} className="label">
                        <span className="label-text flex text-left justify-center">{field.label}</span>
                    </label>
                    <select
                        id={field.key}
                        name={field.key}
                        className="select select-bordered w-full"
                        value={value !== null && value ? JSON.stringify(value) : ""}
                        onChange={onChange}
                        required={field.required}
                    >
                        <option value="" disabled>Seleccionar</option>
                        {field.options?.map((option: any, optIdx: any) => (
                            <option
                                key={optIdx}
                                value={JSON.stringify(option)}
                            >
                                {Object.keys(option).includes('nombre')
                                    ? (Object.keys(option).some(key => key.startsWith('codigo'))
                                        ? option[Object.keys(option).find(key => key.startsWith('codigo')) || '']
                                        : option.nombre)
                                    : option[Object.keys(option)[0]]
                                }
                            </option>
                        ))}
                    </select>
                </div>
            );

        case 'textarea':
            return (
                <div className="self-center">
                    <label htmlFor={field.key} className="label">
                        <span className="label-text flex text-left justify-center">{field.label}</span>
                    </label>
                    <textarea
                        id={field.key}
                        placeholder={field.example}
                        className="textarea textarea-bordered w-full"
                        value={value || ""}
                        onChange={onChange}
                        required={field.required}
                    />
                </div>
            );

        case 'checkbox':
            return (
                <div className="flex flex-row self-center">
                    <label htmlFor={field.key} className="label">
                        <span className="label-text flex text-left justify-center">{field.label}</span>
                    </label>
                    <input
                        id={field.key}
                        type="checkbox"
                        className="checkbox my-auto ml-2"
                        checked={Boolean(Number(value))}
                        onChange={onChange}
                    />
                </div>
            );

        default:
            // Input por defecto (text, number, email, etc)
            return (
                <div className="self-center">
                    <label htmlFor={field.key} className="label">
                        <span className="label-text flex text-left justify-center">{field.label}</span>
                    </label>
                    <input
                        id={field.key}
                        type={field.type.includes('cedula') ? 'text' : field.type}
                        name={field.key}
                        placeholder={field.example}
                        className="input input-bordered w-full"
                        value={value || ""}
                        onChange={onChange}
                        required={field.required}
                        disabled={field.disabled}
                        pattern={field.pattern}
                        maxLength={field.maxLength}
                        min={field.min}
                        step={field.step}
                    />
                </div>
            );
    }
};