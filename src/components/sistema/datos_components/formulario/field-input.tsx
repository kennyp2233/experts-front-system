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
                            <option key={optIdx} value={JSON.stringify(option)}>
                                {(() => {
                                    const keys = Object.keys(option);
                                    const nombreKey = keys.find(key => key.toLowerCase().includes('nombre'));
                                    const codigoKey = keys.find(key => key.toLowerCase().includes('codigo'));
                                    let displayText = '';

                                    if (nombreKey || codigoKey) {
                                        if (nombreKey) {
                                            // Se prioriza el valor del nombre
                                            displayText = option[nombreKey];
                                            if (codigoKey) {
                                                displayText += ` (${option[codigoKey]})`;
                                            }
                                        } else if (codigoKey) {
                                            // Si no existe nombre, se usa el código y se concatena el nombre (si se llegara a encontrar)
                                            displayText = option[codigoKey];
                                            if (nombreKey) {
                                                displayText += ` (${option[nombreKey]})`;
                                            }
                                        }
                                    } else {
                                        // Si no se encuentran ni 'nombre' ni 'codigo', se usa el primer valor del objeto
                                        displayText = option[keys[0]];
                                    }

                                    return displayText;
                                })()}
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