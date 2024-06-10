
import React, { ChangeEvent, useEffect, useState } from "react";

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
}

interface FormState {
    [key: string]: any;
}

interface propsFormulario {
    controlState: (state: string) => void;
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
    formularioTabs?: boolean,
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
        formularioTabs
    }: propsFormulario) {

    const [formState, setFormState] = useState<FormState>({});
    const [isUpdateButtonDisabled, setUpdateButtonDisabled] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (index: any) => {
        setActiveTab(index);
    };

    const tabs = [];
    let currentTabFields = [] as any[];
    let currentTabLabel = '';

    formFields?.forEach((field, index) => {
        if (field.division) {
            if (currentTabFields.length > 0) {
                tabs.push({ label: currentTabLabel, fields: currentTabFields });
                currentTabFields = [];
            }
            currentTabLabel = field.label;
        } else {
            currentTabFields.push(field);
        }
    });

    if (currentTabFields.length > 0) {
        tabs.push({ label: currentTabLabel, fields: currentTabFields });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, key: any) => {
        let value = e.target.value;

        // Si es un input de texto, convertir el valor a mayúsculas
        if (e.target.type === 'text' || e.target.type === 'textarea') {
            value = value.toUpperCase();
        }

        if (e.target.type === 'checkbox') {
            value = (e.target as HTMLInputElement).checked ? "1" : "0";

        }

        if ('options' in e.target && e.target.options) {
            const selectedOption = e.target.options[e.target.selectedIndex];
            try {
                value = JSON.parse(selectedOption.value);
            } catch (error) {
                console.error('Error al convertir el valor de la opción seleccionada:', error);
            }
        }

        setFormState({ ...formState, [key]: value });
    };

    useEffect(() => {
        if (formType === "modificar" && selectedRow !== -1) {
            const newFormState = formFields?.reduce((obj, field) => {
                if (field.key in initialValues) {
                    obj[field.key] = initialValues[field.key];
                }
                return obj;
            }, {} as any);

            setFormState(newFormState);
        }

    }, [initialValues, formFields, selectedRow]);

    useEffect(() => {
        // Compara formState con initialValues
        const hasFormStateChanged = JSON.stringify(formState) !== JSON.stringify(initialValues);

        // Habilita o deshabilita el botón de actualizar según si formState ha cambiado o no
        setUpdateButtonDisabled(!hasFormStateChanged);
    }, [formState, initialValues]);


    const handleOnSubmit = (e: any) => {
        e.preventDefault();
        if (handleSubmit && handleUpdateData) {
            //console.log("formState", formState);
            handleSubmit(formState);
            //handleUpdateData();
        }

    }



    const RenderField = ({ field, formState, handleChange }: any) => (
        <div key={field.key} className={
            (field.type === "checkbox" && "flex flex-row") + " self-center"
        }>
            <label className="label">
                <span className="label-text flex text-center justify-center">{field.label}</span>
            </label>

            {field.type === 'select' && (
                <select
                    className="select select-bordered w-full"
                    value={JSON.stringify(formState[field.key])}
                    onChange={(e) => handleChange(e, field.key)}
                    required//={field.required}
                >
                    <option value="" disabled selected>
                        Seleccionar
                    </option>
                    {field.options?.map((option: any, index: number) => (
                        <option
                            key={index}
                            value={JSON.stringify(option)}
                            selected={Boolean(formState[field.key]) && option[Object.keys(option)[0]] === (formState[field.key] as any)[Object.keys((formState[field.key]))[0]]}
                        >
                            {Object.keys(option).includes('nombre') ? option.nombre : option[Object.keys(option)[0]]}
                        </option>
                    ))}
                </select>
            )}

            {(field.type === 'text' || field.type === 'number') && (
                <input
                    type={field.type}
                    placeholder={"Ej: " + field.example}
                    className="input input-bordered w-full"
                    value={formState[field.key]}
                    onChange={(e) => handleChange(e, field.key)}
                    required={field.required}
                    disabled={field.disabled}
                />
            )}

            {field.type === 'textarea' && (
                <textarea
                    placeholder={"Ej: " + field.example}
                    className="textarea textarea-bordered w-full"
                    value={formState[field.key]}
                    onChange={(e) => handleChange(e, field.key)}
                    required={field.required}
                />
            )}

            {field.type === 'checkbox' && (
                <>
                    <input
                        type="checkbox"
                        className="checkbox my-auto ml-2"
                        checked={Boolean(Number(formState[field.key]))}
                        onChange={(e) => handleChange(e, field.key)}
                    />
                </>
            )}
        </div>
    );
    return (
        <>
            {!formularioTabs &&
                <div className={"card shrink-0 shadow-2xl bg-base-100 max-xl:max-w-[55%] max-lg:max-w-[60%] max-md:max-w-[65%] max-sm:max-w-[100%] max-w-[50%] " + className}>
                    <form className="card-body" onSubmit={(e: any) => handleOnSubmit(e)}>
                        <div className={"form-control " + classNameForm}>
                            {formFields?.map((field, index) => (
                                <RenderField field={field} formState={formState} handleChange={handleChange} />
                            ))}
                            {TablaEliminados && <h2 className="text-xl self-start  max-sm:text-lg">Datos a eliminar:</h2>}
                            {TablaEliminados && TablaEliminados}
                        </div>

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

                            <a className="btn btn-error" onClick={() => {
                                controlState("default")
                                if (setSelectedRow) setSelectedRow(-1)
                                if (setSelectedRows) setSelectedRows([])

                            }}>
                                <svg className="text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m4.3 14.3a.996.996 0 0 1-1.41 0L12 13.41L9.11 16.3a.996.996 0 1 1-1.41-1.41L10.59 12L7.7 9.11A.996.996 0 1 1 9.11 7.7L12 10.59l2.89-2.89a.996.996 0 1 1 1.41 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41"></path></svg>
                                Cancelar
                            </a>
                        </div>
                    </form>
                </div>
            }

            {formularioTabs &&
                <div className={"card shrink-0 shadow-2xl bg-base-100 max-xl:max-w-[55%] max-lg:max-w-[60%] max-md:max-w-[65%] max-sm:max-w-[100%] max-w-[50%] " + className}>

                    <form className="card-body" onSubmit={(e: any) => handleOnSubmit(e)}>
                        <div className={"form-control "}>
                            <div role="tablist" className={"tabs tabs-lifted"}>
                                {tabs.map((tab, tabIndex) => (
                                    <React.Fragment key={tabIndex}>
                                        <input
                                            type="radio"
                                            name="my_tabs"
                                            role="tab"
                                            className="tab"
                                            aria-label={tab.label}
                                            checked={activeTab === tabIndex}
                                            onChange={() => handleTabChange(tabIndex)}
                                        />
                                        <div
                                            role="tabpanel"
                                            className={`tab-content bg-base-100 border-base-300 rounded-box p-6 ${activeTab === tabIndex ? '' : 'hidden'}`}
                                        >
                                            <div className={" " + classNameForm}>
                                                {tab.fields.map((field, fieldIndex) => (
                                                    <RenderField
                                                        key={fieldIndex}
                                                        field={field}
                                                        formState={formState}
                                                        handleChange={handleChange}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </React.Fragment>

                                ))}
                            </div>

                            {TablaEliminados && <h2 className="text-xl self-start max-sm:text-lg">Datos a eliminar:</h2>}
                            {TablaEliminados && TablaEliminados}

                        </div>

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

                            <a className="btn btn-error" onClick={() => {
                                controlState("default")
                                if (setSelectedRow) setSelectedRow(-1)
                                if (setSelectedRows) setSelectedRows([])

                            }}>
                                <svg className="text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m4.3 14.3a.996.996 0 0 1-1.41 0L12 13.41L9.11 16.3a.996.996 0 1 1-1.41-1.41L10.59 12L7.7 9.11A.996.996 0 1 1 9.11 7.7L12 10.59l2.89-2.89a.996.996 0 1 1 1.41 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41"></path></svg>
                                Cancelar
                            </a>
                        </div>
                    </form>

                </div>
            }

        </>
    );
}
