import React, { useEffect, useState } from "react";

interface FormField {
    label: string;
    type: string;
    key: string;
    example?: string;
    placeholder?: string;
    options?: string[];
    disabled?: boolean;
    division?: boolean;
    required?: boolean;
    pattern?: string;
    maxLength?: number;
    step?: number;
    min?: number;
    custom?: any;
    custom_name?: string;
    uppercase?: boolean; // Nueva propiedad
}

interface FormState {
    [key: string]: any;
}

interface propsFormulario {
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


export default function Formulario(
    {
        controlState,
        className,
        formFields,
        classNameForm,
        formType,
        initialValues,
        setSelectedRow,
        selectedRow,
        TablaEliminados,
        selectedRows,
        setSelectedRows,
        handleSubmit,
        handleUpdateData,

    }: propsFormulario) {

    const [formState, setFormState] = useState<FormState>({});
    const [isUpdateButtonDisabled, setUpdateButtonDisabled] = useState(true);
    const [customData, setCustomData] = useState({} as any);

    useEffect(() => {
        if (formFields) {
            // Filtrar los campos custom
            const customFields = formFields.filter(field => field.custom);

            // Inicializar el objeto para el estado
            const customDataObject = {} as any;

            customFields.forEach((field) => {
                const customName = field.custom_name || "custom";

                // Si no existe el array para customName, inicializarlo
                if (!customDataObject[customName]) {
                    customDataObject[customName] = [];
                }

                // Crear un objeto con los campos personalizados
                /*
                const customFieldsObject: any = {};
                field.custom.forEach((customField: any) => {
                    customFieldsObject[customField.key] = "";
                });
             
                // Agregar el objeto al array de customName
                customDataObject[customName].push(customFieldsObject);
                   */

            });

            // Actualizar el estado
            setCustomData(customDataObject);
        }
    }, [formFields]);



    useEffect(() => {
        console.log("customData", customData);
    }, [customData]);

    useEffect(() => {
        if (formType === "modificar" && selectedRow !== -1 && initialValues) {
            const newFormState = formFields?.reduce((obj, field) => {
                if (field.key in initialValues) {
                    obj[field.key] = initialValues[field.key];
                }
                return obj;
            }, {} as any);

            const customNames = extractCustomNames(formFields!);
            setCustomData(transformCustomValues(initialValues, customNames, formFields!));
            setFormState(newFormState);
        }
    }, [initialValues, formFields, selectedRow]);


    // useEffect para comparar y habilitar el botón de actualizar
    useEffect(() => {
        if (formType === "modificar") {
            const newFormState = formFields?.reduce((obj, field) => {
                if (field.key in initialValues) {
                    obj[field.key] = initialValues[field.key];
                }
                return obj;
            }, {} as any);

            // Compara formState con newFormState y customDataObj con customData
            const hasFormStateChanged =
                JSON.stringify(formState) !== JSON.stringify(newFormState) ||
                JSON.stringify(customData) !== JSON.stringify(initialValues.customData);

            // Habilita o deshabilita el botón de actualizar
            setUpdateButtonDisabled(!hasFormStateChanged);
        }
    }, [formState, formFields, initialValues, customData, formType]);



    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        field: FormField
    ) => {
        let value = e.target.value;

        // Si es un input de texto o textarea, convertir el valor a mayúsculas si uppercase no es false
        if ((e.target.type === 'text' || e.target.type === 'textarea') && field.uppercase !== false) {
            value = value.toUpperCase();
        }

        // Validar input numérico para no permitir letras
        if (e.target.type === 'number') {
            // Determinar el número de decimales permitidos basado en el step
            const decimalPlaces = (e.target as HTMLInputElement).step ?
                ((e.target as HTMLInputElement).step.includes('.') ? (e.target as HTMLInputElement).step.split('.')[1].length : 0) :
                0;

            // Crear una expresión regular basada en el número de decimales permitidos
            const regex = decimalPlaces > 0 ?
                new RegExp(`^-?\\d*(\\.\\d{0,${decimalPlaces}})?$`) :
                /^-?\d*$/;

            if (!regex.test(value)) {
                // Si no es un número válido según el step, no actualizar el estado
                return;
            }

            // Opcional: convertir a número y validar contra min/max si están definidos
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                const min = parseFloat((e.target as HTMLInputElement).min);
                const max = parseFloat((e.target as HTMLInputElement).max);

                if (!isNaN(min) && numValue < min) return;
                if (!isNaN(max) && numValue > max) return;
            }
        }

        if (e.target.type === 'checkbox') {
            value = (e.target as HTMLInputElement).checked ? "1" : "0";

        }

        if (e.target.type === 'select-one') {
            value = JSON.parse(e.target.value); // Aquí obtienes directamente el valor del select
        }

        setFormState({ ...formState, [field.key]: value });
        console.log("formState", formState);
    };

    const handleOnSubmit = (e: any) => {
        e.preventDefault();

        if (handleSubmit && handleUpdateData) {
            const combinedData = {
                ...formState,
                ...customData
            };

            console.log("Datos enviados:", combinedData);
            handleSubmit(combinedData);
            //handleUpdateData();
        }

    }

    const FormControl = ({ formType, isUpdateButtonDisabled, controlState, setSelectedRow, setSelectedRows }: any) => {
        return (
            <>
                <div className={"form-control mt-6 gap-2 "} >
                    {formType !== "eliminar" &&
                        <button className={"btn btn-primary " + (isUpdateButtonDisabled && formType == "modificar" ? "btn-disabled" : "")}>
                            {formType === "crear" &&
                                <>
                                    <svg className="text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><defs><mask id="ipSAddOne0"><g fill="none" strokeLinejoin="round" strokeWidth={4}><path fill="#fff" stroke="#fff" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"></path><path stroke="#000" strokeLinecap="round" d="M24 16v16m-8-8h16"></path></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSAddOne0)"></path></svg>
                                    <span>Agregar</span>
                                </>

                            }

                            {formType === "modificar" &&
                                <>
                                    <svg className="text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M5.7 9c.4-2 2.2-3.5 4.3-3.5c1.5 0 2.7.7 3.5 1.8l1.7-2C14 3.9 12.1 3 10 3C6.5 3 3.6 5.6 3.1 9H1l3.5 4L8 9zm9.8-2L12 11h2.3c-.5 2-2.2 3.5-4.3 3.5c-1.5 0-2.7-.7-3.5-1.8l-1.7 1.9C6 16.1 7.9 17 10 17c3.5 0 6.4-2.6 6.9-6H19z"></path></svg>
                                    <span>Modificar</span>
                                </>
                            }
                        </button>

                    }

                    {formType === "eliminar" &&
                        <>
                            <label htmlFor="my_modal_6" className="btn btn-primary">
                                <svg className="text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 12 12"><path fill="currentColor" d="M5 3h2a1 1 0 0 0-2 0M4 3a2 2 0 1 1 4 0h2.5a.5.5 0 0 1 0 1h-.441l-.443 5.17A2 2 0 0 1 7.623 11H4.377a2 2 0 0 1-1.993-1.83L1.941 4H1.5a.5.5 0 0 1 0-1zm3.5 3a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0zM5 5.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 1 0V6a.5.5 0 0 0-.5-.5"></path></svg>
                                Eliminar
                            </label>

                            <input type="checkbox" id="my_modal_6" className="modal-toggle" />
                            <div className="modal" role="dialog">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg flex">
                                        <svg className="text-2xl text-error my-auto mr-2" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path strokeDasharray={60} strokeDashoffset={60} d="M12 3L21 20H3L12 3Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0"></animate></path><path strokeDasharray={6} strokeDashoffset={6} d="M12 10V14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="6;0"></animate><animate attributeName="stroke-width" begin="1s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2"></animate></path></g><circle cx={12} cy={17} r={1} fill="currentColor" fillOpacity={0}><animate fill="freeze" attributeName="fill-opacity" begin="0.8s" dur="0.4s" values="0;1"></animate><animate attributeName="r" begin="1.3s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="1;2;2;1;1"></animate></circle></svg>
                                        <span>Advertencia</span>
                                    </h3>
                                    <p className="py-4">Desea eliminar los elementos seleccionados?</p>
                                    <div className="modal-action">
                                        <button className="btn btn-error">Eliminar</button>
                                        <label htmlFor="my_modal_6" className="btn">Cerrar</label>
                                    </div>
                                </div>
                            </div>
                        </>
                    }

                    <button type="button" className="btn btn-error" onClick={() => {
                        controlState("default")
                        if (setSelectedRow) setSelectedRow(-1)
                        if (setSelectedRows) setSelectedRows([])

                    }}>
                        <svg className="text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m4.3 14.3a.996.996 0 0 1-1.41 0L12 13.41L9.11 16.3a.996.996 0 1 1-1.41-1.41L10.59 12L7.7 9.11A.996.996 0 1 1 9.11 7.7L12 10.59l2.89-2.89a.996.996 0 1 1 1.41 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41"></path></svg>
                        Cancelar
                    </button>
                </div>
            </>
        )
    };

    const handleCustomDataChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        fieldConfig: any,
        customName: string,
        index: number,
        key: string
    ) => {
        let value = e.target.value;

        // Convertir a mayúsculas si `uppercase` no es false
        if ((e.target.type === 'text' || e.target.type === 'textarea') && fieldConfig.uppercase !== false) {
            value = value.toUpperCase();
        }

        setCustomData((prevData: any) => {
            const updatedData = [...prevData[customName]];

            if (fieldConfig?.type === 'select') {
                // Para campos de tipo 'select', reemplazar el objeto completo en el índice
                const parsedValue = JSON.parse(value);
                updatedData[index] = {
                    ...updatedData[index],
                    ...parsedValue,
                };
            } else {
                // Para otros campos, actualizar solo la clave específica
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

    const addCustomField = (customName: string, customFields: any[]) => {
        setCustomData((prevData: any) => {
            // Obtener el array actual de campos personalizados para el nombre proporcionado
            const currentFieldsArray = prevData[customName] || [];

            // Crear un nuevo objeto basado en los campos personalizados proporcionados
            const newFieldsObject: any = {};
            customFields.forEach(field => {
                newFieldsObject[field.key] = "";
            });

            // Agregar el nuevo objeto al array existente
            const newFieldsArray = [...currentFieldsArray, newFieldsObject];

            // Devolver el nuevo estado
            return {
                ...prevData,
                [customName]: newFieldsArray
            };
        });
    };

    const removeCustomField = (customName: string) => {
        setCustomData((prevData: any) => {
            // Obtener el array actual de campos personalizados para el nombre proporcionado
            const currentFieldsArray = prevData[customName] || [];

            // Remover el último objeto del array
            const newFieldsArray = currentFieldsArray.slice(0, -1);

            // Devolver el nuevo estado
            return {
                ...prevData,
                [customName]: newFieldsArray
            };
        });
    };



    function extractCustomNames(fields: any[]): string[] {
        return fields
            .filter(field => field.custom && field.custom_name)
            .map(field => field.custom_name);
    }

    function transformCustomValues(initialValues: any, customNames: string[], formFields: any[]): any {
        const transformedData: any = {};

        customNames.forEach(customName => {
            const customDataArray = initialValues[customName] || [];
            const fieldConfig = formFields.find(field => field.custom_name === customName) || {};

            // Determinar si el campo es de tipo 'select'
            const isSelect = fieldConfig.custom[0].type === 'select';

            transformedData[customName] = customDataArray.map((item: any) => {
                const newItem: any = {};

                if (isSelect) {
                    // Si es un 'select', mantener todos los campos
                    Object.keys(item).forEach(key => {
                        newItem[key] = item[key];
                    });
                } else {
                    // Si no es un 'select', omitir claves que empiezan con 'id_'
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




    return (
        <>

            <div className={"card shrink-0 shadow-2xl bg-base-100 max-xl:max-w-[55%] max-lg:max-w-[60%] max-md:max-w-[65%] max-sm:max-w-[100%] max-w-[50%] " + className}>
                <form className="card-body" onSubmit={(e: any) => handleOnSubmit(e)}>

                    <div className={"form-control max-h-96 overflow-y-auto " + classNameForm}>
                        {formFields?.map((field, index) => {
                            if (field.division) {
                                return (
                                    <>
                                        {index > 0 && <div className="divider col-span-full" />}
                                        <h2 key={index} className="text-xl self-start max-sm:text-lg col-span-full font-bold">{field.label}</h2>

                                    </>
                                )
                            }



                            let inputElement;

                            switch (field.type) {
                                case 'select':
                                    inputElement = (
                                        <select
                                            id={field.key}
                                            name={field.key}
                                            className="select select-bordered w-full"
                                            value={formState[field.key] !== null && formState[field.key] ? JSON.stringify(formState[field.key]) : ""}
                                            onChange={(e) => handleChange(e, field)}
                                            required={field.required}
                                        >
                                            <option value="" disabled>
                                                Seleccionar
                                            </option>
                                            {field.options?.map((option: any) => (
                                                <option
                                                    key={option[0]}
                                                    value={JSON.stringify(option)}
                                                >
                                                    {Object.keys(option).includes('nombre') ?
                                                        (Object.keys(option).some(key => key.startsWith('codigo')) ?
                                                            option[Object.keys(option).find(key => key.startsWith('codigo')) || '']
                                                            : option.nombre
                                                        )
                                                        : option[Object.keys(option)[0]]
                                                    }
                                                </option>
                                            ))}
                                        </select>
                                    );
                                    break;

                                case 'text':
                                case 'number':
                                case 'email':
                                case 'tel':
                                case 'cedula':
                                    inputElement = (
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
                                            pattern={field.pattern || undefined}
                                            maxLength={field.maxLength || undefined}
                                            min={field.min || undefined}
                                            step={field.step || undefined}
                                        />
                                    );
                                    break;

                                case 'textarea':
                                    inputElement = (
                                        <textarea
                                            id={field.key}
                                            placeholder={field.example}
                                            className="textarea textarea-bordered w-full"
                                            value={formState[field.key] || ""}
                                            onChange={(e) => handleChange(e, field)}
                                            required={field.required}
                                        />
                                    );
                                    break;

                                case 'checkbox':
                                    inputElement = (
                                        <input
                                            id={field.key}
                                            type="checkbox"
                                            className="checkbox my-auto ml-2"
                                            checked={Boolean(Number(formState[field.key]))}
                                            onChange={(e) => handleChange(e, field)}
                                        />
                                    );
                                    break;

                                default:
                                    inputElement = null;
                            }

                            return (
                                <>
                                    <div key={field.key} className={(field.type === "checkbox" ? "flex flex-row " : "") + (field.custom ? "col-span-full gap-3 w-full" : "") + " self-center"}>
                                        {!field.custom &&
                                            <label htmlFor={field.key} className="label">
                                                <span className="label-text flex text-left justify-center">{field.label}</span>
                                            </label>
                                        }

                                        {inputElement}

                                        {customData && customData[field.custom_name!] &&
                                            <div className={`grid gap-3 grid-cols-${Object.keys(field.custom).length}`}>
                                                {customData[field.custom_name!]?.map((customObject: any, index: number) => {
                                                    // Verifica si el objeto es un campo de tipo select
                                                    const fieldConfig = field.custom.find((f: any) => f.key in customObject);

                                                    if (fieldConfig?.type === 'select') {
                                                        // Solo renderiza el valor asociado al `key` para campos select
                                                        const selectValue = customObject[fieldConfig.key];  // Obtener el valor del campo select
                                                        //  console.log("CUSTOMDATA", customData[field.custom_name!][index][fieldConfig.key])
                                                        return (
                                                            <div key={`${fieldConfig.key}_${index}`} className="custom-field">
                                                                <label className="label label-text flex text-left" htmlFor={`${fieldConfig.key}_${index}`}>
                                                                    {fieldConfig?.label || fieldConfig.key}
                                                                </label>
                                                                <select
                                                                    id={`${fieldConfig.key}_${index}`}
                                                                    name={`${fieldConfig.key}_${index}`}
                                                                    className="select select-bordered w-full"
                                                                    value={customData[field.custom_name!][index][fieldConfig.key] !== "" ? JSON.stringify(customData[field.custom_name!][index][fieldConfig.key]) : ""}
                                                                    onChange={(e) => handleCustomDataChange(e, fieldConfig, field.custom_name!, index, fieldConfig.key)}
                                                                    required={fieldConfig?.required}
                                                                >
                                                                    <option value="" disabled>Seleccionar</option>
                                                                    {fieldConfig?.options?.map((option: any) => (
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
                                                        // Manejo para otros tipos de campos
                                                        return Object.entries(customObject).map(([key, value]) => {
                                                            const fieldConfig = field.custom.find((f: any) => f.key === key);

                                                            let inputElement;
                                                            switch (fieldConfig?.type) {
                                                                case 'text':
                                                                case 'number':
                                                                    inputElement = (
                                                                        <input
                                                                            key={`${key}_${index}`}
                                                                            id={`${key}_${index}`}
                                                                            type={fieldConfig?.type}
                                                                            name={`${key}_${index}`}
                                                                            placeholder={fieldConfig?.example}
                                                                            className="input input-bordered w-full"
                                                                            value={(value || "") as string}
                                                                            onChange={(e) => handleCustomDataChange(e, fieldConfig, field.custom_name!, index, key)}
                                                                            required={fieldConfig?.required}
                                                                            disabled={fieldConfig?.disabled}
                                                                            pattern={fieldConfig?.pattern || undefined}
                                                                            maxLength={fieldConfig?.maxLength || undefined}
                                                                            min={fieldConfig?.min || undefined}
                                                                            step={fieldConfig?.step || undefined}
                                                                        />
                                                                    );
                                                                    break;

                                                                default:
                                                                    inputElement = null;
                                                            }

                                                            return (
                                                                <div key={`${key}_${index}`} className="custom-field">
                                                                    <label className="label label-text flex text-left" htmlFor={`${key}_${index}`}>
                                                                        {fieldConfig?.label || key}
                                                                    </label>
                                                                    {inputElement}
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
                                        }

                                    </div>
                                </>
                            );
                        })}

                    </div>



                    {TablaEliminados && <h2 className="text-xl self-start  max-sm:text-lg">Datos a eliminar:</h2>}
                    {TablaEliminados && TablaEliminados}
                    <FormControl formType={formType} isUpdateButtonDisabled={isUpdateButtonDisabled} controlState={controlState} setSelectedRow={setSelectedRow} setSelectedRows={setSelectedRows} />

                </form>
            </div>


        </>
    );
}
