import React, { useState, useEffect } from "react";
import { FaPlus, FaSync, FaTrash, FaTimes } from 'react-icons/fa';
import { FormField, FormState } from "../formulario/types";
import { FieldInput } from "../formulario/field-input";
import { customFieldsUtils } from "../formulario/custom-fields-utils";
import { DeleteConfirmationModal } from "../formulario/delete-confirmation-modal";
import { EstadoSeleccionado } from "../formulario/estado-seleccionado";

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
            const customNames = customFieldsUtils.extractCustomNames(formFields);
            const transformedData = customFieldsUtils.transformCustomValues(initialValues, customNames, formFields);

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

    // Resetear estado del control
    const resetControlState = () => {
        controlState("default");
        if (setSelectedRow) setSelectedRow(-1);
        if (setSelectedRows) setSelectedRows([]);
    };

    // Renderizar campos de formulario
    const renderFormFields = () => {
        return formFields?.map((field, index) => {
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
                <FieldInput
                    key={field.key}
                    field={field}
                    value={formState[field.key]}
                    onChange={(e) => handleChange(e, field)}
                />
            );
        });
    };

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
                onClick={resetControlState}
            >
                <FaTimes className="mr-2" />
                Cancelar
            </button>
        </div>
    );

    // Renderizar componente principal
    return (
        <div className={`card shrink-0 shadow-2xl bg-base-100 max-xl:max-w-[55%] max-lg:max-w-[60%] max-md:max-w-[65%] max-sm:max-w-[100%] max-w-[50%] ${className}`}>
            <form className="card-body" onSubmit={handleOnSubmit}>
                <div className={`form-control max-h-96 overflow-y-auto ${classNameForm}`}>
                    {renderFormFields()}
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