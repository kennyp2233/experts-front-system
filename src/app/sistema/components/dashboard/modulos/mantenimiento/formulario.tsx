
import { ChangeEvent, useEffect, useState } from "react";

interface FormField {
    label: string;
    type: string;
    key: string;
    example?: string;
    placeholder?: string;
    options?: string[];
    disabled?: boolean;
}

interface FormState {
    [key: string]: string;
}

interface propsFormulario {
    controlState: (state: string) => void;
    className: string;
    formFields: FormField[];
    classNameForm: string;
    formType: string;
    initialValues?: any;
    setSelectedRow?: (row: number) => void;
    selectedRow?: number;
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
        selectedRow
    }: propsFormulario) {

    const [formState, setFormState] = useState<FormState>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, key: string) => {
        setFormState({ ...formState, [key]: e.target.value });
    };

    useEffect(() => {
        if (formType === "modificar" && selectedRow !== -1) {
            const newFormState = formFields.reduce((obj, field) => {
                if (field.key in initialValues) {
                    obj[field.key] = initialValues[field.key];
                }
                return obj;
            }, {} as any);
            setFormState(newFormState);
        }
    }, [initialValues]);

    return (
        <>
            <div className={"card shrink-0 shadow-2xl bg-base-100 " + className}>
                <form className="card-body" onSubmit={() => ""}>
                    <div className={"form-control " + classNameForm}>
                        {formFields.map((field, index) => (
                            <div key={index}>
                                <label className="label">
                                    <span className="label-text flex text-center justify-center">
                                        {field.label}
                                    </span>
                                </label>
                                {field.type === 'select' &&
                                    <select
                                        className="select select-bordered w-full"
                                        value={formState[field.label]}
                                        onChange={(e) => handleChange(e, field.key)}
                                        required
                                    >
                                        <option value="" disabled>Seleccionar</option>
                                        {field.options?.map((option: any, index: number) => (
                                            <option
                                                key={index}
                                                value={option}
                                                selected={false}
                                            >
                                                {option[Object.keys(option)[1]]}
                                            </option>
                                        ))}
                                    </select>
                                }

                                {field.type !== 'select' &&
                                    <input
                                        type={field.type}
                                        placeholder={field.example}
                                        className="input input-bordered w-full"
                                        value={formState[field.label]}
                                        onChange={(e) => handleChange(e, field.key)}
                                        required
                                        disabled={field.disabled}
                                    />
                                }
                            </div>
                        ))}

                    </div>

                    <div className="form-control mt-6 gap-2">
                        <button className="btn btn-primary">
                            <svg className="text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><defs><mask id="ipSAddOne0"><g fill="none" strokeLinejoin="round" strokeWidth={4}><path fill="#fff" stroke="#fff" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"></path><path stroke="#000" strokeLinecap="round" d="M24 16v16m-8-8h16"></path></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSAddOne0)"></path></svg>
                            Agregar
                        </button>
                        <a className="btn btn-error" onClick={() => {
                            controlState("default")
                            if (setSelectedRow) setSelectedRow(-1)

                        }}>
                            <svg className="text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m4.3 14.3a.996.996 0 0 1-1.41 0L12 13.41L9.11 16.3a.996.996 0 1 1-1.41-1.41L10.59 12L7.7 9.11A.996.996 0 1 1 9.11 7.7L12 10.59l2.89-2.89a.996.996 0 1 1 1.41 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41"></path></svg>
                            Cancelar
                        </a>
                    </div>
                </form>
            </div>
        </>
    );
}
