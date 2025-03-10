import React, { useState, useEffect } from "react";

import {
    FaPlus,
    FaSync,
    FaTrash,
    FaTimes
} from 'react-icons/fa'; // Puedes usar react-icons

interface FormField {
    label: string;
    type: string;
    key: string;
    example?: string;
    placeholder?: string;
    options?: any[];
    disabled?: boolean;
    division?: boolean;
    required?: boolean;
    pattern?: string;
    maxLength?: number;
    step?: string | number;
    min?: number;
    custom?: any;
    custom_name?: string;
    uppercase?: boolean;
}

interface FormState {
    [key: string]: any;
}

interface FormularioProps {
    controlState: React.Dispatch<React.SetStateAction<any>>;
    className: string;
    formFields?: FormField[];
    classNameForm: string;
    formType: string;
    initialValues?: any;
    setSelectedRow?: (row: number) => void;
    selectedRow?: number;
    TablaEliminados?: any,
    selectedRows?: any[],
    setSelectedRows?: (data: any) => void,
    handleSubmit?: (e: any) => void,
    handleUpdateData?: () => void,
}

export default function Formulario({
    controlState,
    className,
    formFields,
    classNameForm,
    formType,
    initialValues,
    setSelectedRow,
    selectedRow,
    TablaEliminados,
    setSelectedRows,
    handleSubmit,
}: FormularioProps) {
    const [formState, setFormState] = useState<FormState>({});
    const [isUpdateButtonDisabled, setUpdateButtonDisabled] = useState(true);
    const [customData, setCustomData] = useState<Record<string, any[]>>({});

    // Inicializar customData cuando los formFields cambian
    useEffect(() => {
        if (!formFields) return;

        const customDataObject: Record<string, any[]> = {};
        formFields
            .filter(field => field.custom)
            .forEach(field => {
                const customName = field.custom_name || "custom";
                if (!customDataObject[customName]) {
                    customDataObject[customName] = [];
                }
            });

        setCustomData(customDataObject);
    }, [formFields]);

    // Actualizar formState y customData cuando cambia selectedRow o initialValues
    useEffect(() => {
        if (formType === "modificar" && selectedRow !== -1 && initialValues && formFields) {
            // Actualizar formState
            const newFormState = formFields.reduce((obj, field) => {
                if (field.key in initialValues) {
                    obj[field.key] = initialValues[field.key];
                }
                return obj;
            }, {} as FormState);

            // Actualizar customData
            const customNames = extractCustomNames(formFields);
            const transformedData = transformCustomValues(initialValues, customNames, formFields);

            setFormState(newFormState);
            setCustomData(transformedData);
        }
    }, [initialValues, formFields, selectedRow, formType]);

    // Habilitar/deshabilitar botón de actualizar
    useEffect(() => {
        if (formType === "modificar" && initialValues && formFields) {
            const newFormState = formFields.reduce((obj, field) => {
                if (field.key in initialValues) {
                    obj[field.key] = initialValues[field.key];
                }
                return obj;
            }, {} as FormState);

            const hasFormStateChanged =
                JSON.stringify(formState) !== JSON.stringify(newFormState) ||
                JSON.stringify(customData) !== JSON.stringify(initialValues.customData);

            setUpdateButtonDisabled(!hasFormStateChanged);
        }
    }, [formState, formFields, initialValues, customData, formType]);

    // Manejador de cambios para campos normales
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        field: FormField
    ) => {
        let value = e.target.value;

        // Convertir a mayúsculas si corresponde
        if ((e.target.type === 'text' || e.target.type === 'textarea') && field.uppercase !== false) {
            value = value.toUpperCase();
        }

        // Validar campos numéricos
        if (e.target.type === 'number') {
            const decimalPlaces = (e.target as HTMLInputElement).step ?
                ((e.target as HTMLInputElement).step.toString().includes('.') ?
                    (e.target as HTMLInputElement).step.toString().split('.')[1].length : 0) : 0;

            const regex = decimalPlaces > 0 ?
                new RegExp(`^-?\\d*(\\.\\d{0,${decimalPlaces}})?$`) :
                /^-?\d*$/;

            if (!regex.test(value)) return;

            // Validar contra min/max
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                const min = parseFloat((e.target as HTMLInputElement).min);
                const max = parseFloat((e.target as HTMLInputElement).max);

                if (!isNaN(min) && numValue < min) return;
                if (!isNaN(max) && numValue > max) return;
            }
        }

        // Manejar checkbox
        if (e.target.type === 'checkbox') {
            value = (e.target as HTMLInputElement).checked ? "1" : "0";
        }

        // Manejar select
        if (e.target.type === 'select-one' && value) {
            try {
                value = JSON.parse(value);
            } catch (error) {
                console.error("Error parsing select value:", error);
            }
        }

        setFormState({ ...formState, [field.key]: value });
    };

    // Manejador para enviar el formulario
    const handleOnSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (handleSubmit) {
            const combinedData = {
                ...formState,
                ...customData
            };

            handleSubmit(combinedData);
        }
    };

    // Manejador de cambios para campos personalizados
    const handleCustomDataChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        fieldConfig: any,
        customName: string,
        index: number,
        key: string
    ) => {
        let value = e.target.value;

        // Convertir a mayúsculas si corresponde
        if ((e.target.type === 'text' || e.target.type === 'textarea') && fieldConfig.uppercase !== false) {
            value = value.toUpperCase();
        }

        setCustomData(prevData => {
            const updatedData = [...(prevData[customName] || [])];

            if (fieldConfig?.type === 'select' && value) {
                try {
                    const parsedValue = JSON.parse(value);
                    updatedData[index] = {
                        ...updatedData[index],
                        ...parsedValue,
                    };
                } catch (error) {
                    console.error("Error parsing select value:", error);
                }
            } else {
                updatedData[index] = {
                    ...updatedData[index],
                    [key]: value,
                };
            }

            return {
                ...prevData,
                [customName]: updatedData,
            };
        });
    };

    // Agregar campo personalizado
    const addCustomField = (customName: string, customFields: any[]) => {
        setCustomData(prevData => {
            const currentFieldsArray = prevData[customName] || [];
            const newFieldsObject: Record<string, string> = {};

            customFields.forEach(field => {
                newFieldsObject[field.key] = "";
            });

            return {
                ...prevData,
                [customName]: [...currentFieldsArray, newFieldsObject]
            };
        });
    };

    // Eliminar campo personalizado
    const removeCustomField = (customName: string) => {
        setCustomData(prevData => {
            const currentFieldsArray = prevData[customName] || [];
            if (currentFieldsArray.length === 0) return prevData;

            return {
                ...prevData,
                [customName]: currentFieldsArray.slice(0, -1)
            };
        });
    };

    // Extraer nombres personalizados de los campos
    function extractCustomNames(fields: FormField[]): string[] {
        return fields
            .filter(field => field.custom && field.custom_name)
            .map(field => field.custom_name as string);
    }

    // Transformar valores personalizados
    function transformCustomValues(initialValues: any, customNames: string[], formFields: FormField[]): Record<string, any[]> {
        const transformedData: Record<string, any[]> = {};

        customNames.forEach(customName => {
            const customDataArray = initialValues[customName] || [];
            const fieldConfig = formFields.find(field => field.custom_name === customName);

            if (!fieldConfig?.custom) return;

            const isSelect = fieldConfig.custom[0].type === 'select';

            transformedData[customName] = customDataArray.map((item: any) => {
                const newItem: Record<string, any> = {};

                if (isSelect) {
                    // Mantener todos los campos para select
                    Object.keys(item).forEach(key => {
                        newItem[key] = item[key];
                    });
                } else {
                    // Omitir claves que empiezan con 'id_'
                    Object.keys(item).forEach(key => {
                        if (!key.startsWith('id_')) {
                            newItem[key] = item[key];
                        }
                    });
                }

                return newItem;
            });
        });

        return transformedData;
    }

    // Componente para controles de formulario
    const FormControl = () => (
        <div className="form-control mt-6 gap-2">
            {formType !== "eliminar" && (
                <button
                    type="submit"
                    className={`btn btn-primary ${isUpdateButtonDisabled && formType === "modificar" ? "btn-disabled" : ""}`}
                >
                    {formType === "crear" ? (
                        <>
                            <FaPlus className="mr-2" />
                            <span>Agregar</span>
                        </>
                    ) : (
                        <>
                            <FaSync className="mr-2" />
                            <span>Modificar</span>
                        </>
                    )}
                </button>
            )}

            {formType === "eliminar" && (
                <label htmlFor="my_modal_6" className="btn btn-primary">
                    <FaTrash className="mr-2" />
                    Eliminar
                </label>
            )}

            <button
                type="button"
                className="btn btn-error"
                onClick={() => {
                    controlState("default");
                    if (setSelectedRow) setSelectedRow(-1);
                    if (setSelectedRows) setSelectedRows([]);
                }}
            >
                <FaTimes className="mr-2" />
                Cancelar
            </button>
        </div>
    );

    // Modal de confirmación para eliminación
    const DeleteConfirmationModal = () => (
        <>
            <input type="checkbox" id="my_modal_6" className="modal-toggle" />
            <div className="modal" role="dialog">
                <div className="modal-box">
                    <h3 className="font-bold text-lg flex">
                        <svg className="text-2xl text-error my-auto mr-2" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                <path strokeDasharray={60} strokeDashoffset={60} d="M12 3L21 20H3L12 3Z">
                                    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0"></animate>
                                </path>
                                <path strokeDasharray={6} strokeDashoffset={6} d="M12 10V14">
                                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="6;0"></animate>
                                    <animate attributeName="stroke-width" begin="1s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2"></animate>
                                </path>
                            </g>
                            <circle cx={12} cy={17} r={1} fill="currentColor" fillOpacity={0}>
                                <animate fill="freeze" attributeName="fill-opacity" begin="0.8s" dur="0.4s" values="0;1"></animate>
                                <animate attributeName="r" begin="1.3s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="1;2;2;1;1"></animate>
                            </circle>
                        </svg>
                        <span>Advertencia</span>
                    </h3>
                    <p className="py-4">¿Desea eliminar los elementos seleccionados?</p>
                    <div className="modal-action">
                        <button type="submit" className="btn btn-error">Eliminar</button>
                        <label htmlFor="my_modal_6" className="btn">Cerrar</label>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className={`card shrink-0 shadow-2xl bg-base-100 max-xl:max-w-[55%] max-lg:max-w-[60%] max-md:max-w-[65%] max-sm:max-w-[100%] max-w-[50%] ${className}`}>
            <form className="card-body" onSubmit={handleOnSubmit}>
                <div className={`form-control max-h-96 overflow-y-auto ${classNameForm}`}>
                    {formFields?.map((field, index) => {
                        // Render divisions
                        if (field.division) {
                            return (
                                <React.Fragment key={`div-${index}`}>
                                    {index > 0 && <div className="divider col-span-full" />}
                                    <h2 className="text-xl self-start max-sm:text-lg col-span-full font-bold">{field.label}</h2>
                                </React.Fragment>
                            );
                        }

                        // Render custom fields
                        if (field.custom) {
                            return (
                                <div key={`custom-${index}`} className="col-span-full gap-3 w-full self-center">
                                    {customData[field.custom_name!] && (
                                        <div className={`grid gap-3 grid-cols-${Object.keys(field.custom).length}`}>
                                            {customData[field.custom_name!]?.map((customObject, idx) => {
                                                const fieldConfig = field.custom.find((f: { key: string; }) => f.key in customObject);

                                                if (fieldConfig?.type === 'select') {
                                                    return (
                                                        <div key={`${fieldConfig.key}_${idx}`} className="custom-field">
                                                            <label className="label label-text flex text-left" htmlFor={`${fieldConfig.key}_${idx}`}>
                                                                {fieldConfig?.label || fieldConfig.key}
                                                            </label>
                                                            <select
                                                                id={`${fieldConfig.key}_${idx}`}
                                                                name={`${fieldConfig.key}_${idx}`}
                                                                className="select select-bordered w-full"
                                                                value={customData[field.custom_name!][idx][fieldConfig.key] !== ""
                                                                    ? JSON.stringify(customData[field.custom_name!][idx][fieldConfig.key])
                                                                    : ""}
                                                                onChange={(e) => handleCustomDataChange(e, fieldConfig, field.custom_name!, idx, fieldConfig.key)}
                                                                required={fieldConfig?.required}
                                                            >
                                                                <option value="" disabled>Seleccionar</option>
                                                                {fieldConfig?.options?.map((option: any[]) => (
                                                                    <option
                                                                        key={option[fieldConfig.valueField]}
                                                                        value={JSON.stringify(option)}
                                                                    >
                                                                        {option[fieldConfig.textField] || option[fieldConfig.valueField] || option[0]}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    );
                                                } else {
                                                    return Object.entries(customObject).map(([key, value]) => {
                                                        const fieldConfig = field.custom.find((f: { key: string; }) => f.key === key);
                                                        if (!fieldConfig) return null;

                                                        return (
                                                            <div key={`${key}_${idx}`} className="custom-field">
                                                                <label className="label label-text flex text-left" htmlFor={`${key}_${idx}`}>
                                                                    {fieldConfig?.label || key}
                                                                </label>
                                                                <input
                                                                    id={`${key}_${idx}`}
                                                                    type={fieldConfig?.type}
                                                                    name={`${key}_${idx}`}
                                                                    placeholder={fieldConfig?.example}
                                                                    className="input input-bordered w-full"
                                                                    value={(value || "") as string}
                                                                    onChange={(e) => handleCustomDataChange(e, fieldConfig, field.custom_name!, idx, key)}
                                                                    required={fieldConfig?.required}
                                                                    disabled={fieldConfig?.disabled}
                                                                    pattern={fieldConfig?.pattern}
                                                                    maxLength={fieldConfig?.maxLength}
                                                                    min={fieldConfig?.min}
                                                                    step={fieldConfig?.step}
                                                                />
                                                            </div>
                                                        );
                                                    });
                                                }
                                            })}

                                            <div className="col-span-full gap-2 flex">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-neutral"
                                                    onClick={() => addCustomField(field.custom_name!, field.custom)}
                                                >
                                                    Agregar campo
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-error"
                                                    onClick={() => removeCustomField(field.custom_name!)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        // Render regular fields
                        return (
                            <div key={field.key} className={`${field.type === "checkbox" ? "flex flex-row" : ""} self-center`}>
                                <label htmlFor={field.key} className="label">
                                    <span className="label-text flex text-left justify-center">{field.label}</span>
                                </label>

                                {field.type === 'select' ? (
                                    <select
                                        id={field.key}
                                        name={field.key}
                                        className="select select-bordered w-full"
                                        value={formState[field.key] !== null && formState[field.key] ? JSON.stringify(formState[field.key]) : ""}
                                        onChange={(e) => handleChange(e, field)}
                                        required={field.required}
                                    >
                                        <option value="" disabled>Seleccionar</option>
                                        {field.options?.map((option, optIdx) => (
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
                                ) : field.type === 'textarea' ? (
                                    <textarea
                                        id={field.key}
                                        placeholder={field.example}
                                        className="textarea textarea-bordered w-full"
                                        value={formState[field.key] || ""}
                                        onChange={(e) => handleChange(e, field)}
                                        required={field.required}
                                    />
                                ) : field.type === 'checkbox' ? (
                                    <input
                                        id={field.key}
                                        type="checkbox"
                                        className="checkbox my-auto ml-2"
                                        checked={Boolean(Number(formState[field.key]))}
                                        onChange={(e) => handleChange(e, field)}
                                    />
                                ) : (
                                    <input
                                        id={field.key}
                                        type={field.type.includes('cedula') ? 'text' : field.type}
                                        name={field.key}
                                        placeholder={field.example}
                                        className="input input-bordered w-full"
                                        value={formState[field.key] || ""}
                                        onChange={(e) => handleChange(e, field)}
                                        required={field.required}
                                        disabled={field.disabled}
                                        pattern={field.pattern}
                                        maxLength={field.maxLength}
                                        min={field.min}
                                        step={field.step}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {TablaEliminados && (
                    <>
                        <h2 className="text-xl self-start max-sm:text-lg">Datos a eliminar:</h2>
                        {TablaEliminados}
                    </>
                )}

                <FormControl />
                {formType === "eliminar" && <DeleteConfirmationModal />}
            </form>
        </div>
    );
}