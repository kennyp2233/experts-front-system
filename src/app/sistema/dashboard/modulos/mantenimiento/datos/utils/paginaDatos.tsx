import { useEffect, useState } from "react";
import { useAuth } from "@/app/sistema/providers/authProvider";
import { useRouter } from "next/navigation";
import { dispatchMenssage } from "@/app/utils/menssageDispatcher";

import MantenimientoRoute from "./mantenimientoRoute";
import ReturnButton from "@/app/sistema/components/returnButton";
import Formulario from "@/app/sistema/components/formulario";
import Tabla from "@/app/sistema/components/tabla";
import ControlButtons from "./controllButtons";

interface modificationLabelId {
    label: string;
    key: string;
}

interface PaginaDatosProps {
    nombre: string;
    icono: JSX.Element;
    visibleColumns: { [key: string]: string };
    fetchData: () => Promise<any>;
    createData: (formData: any) => Promise<any>;
    updateData: (formData: any) => Promise<any>;
    deleteData: (selectedRows: any[]) => Promise<any>;
    formFields: any[];
    modificationLabelId: modificationLabelId;
    formClassName?: string;
    formularioSegments?: boolean;
}



export default function PaginaDatos(props: PaginaDatosProps) {
    const router = useRouter();
    const { checkToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [constrolState, setControlState] = useState<"crear" | "modificar" | "eliminar" | "default">("default");

    const [data, setData] = useState([] as any[]);

    const [tableData, setTableData] = useState({} as { [key: string]: any }[]);
    const [selectedRow, setSelectedRow] = useState(-1);
    const [selectedRowData, setSelectedRowData] = useState({} as any);
    const [visibleColumns, setVisibleColumns] = useState(props.visibleColumns as any);

    const [formFields, setFormFields] = useState(props.formFields as any[]);
    const [formFieldsCreation, setFormFieldsCration] = useState([] as any[]);
    const [formFieldsModification, setFormFieldsModification] = useState([] as any[]);
    const [selectedRows, setSelectedRows] = useState([] as any[]);

    const createFormFields = (fields: any, idLabel?: string, idKey?: string, isModification = false) => {
        let newFields = fields.map((field: any) => {
            return { ...field, placeholder: `Ej: ${field.example}` };
        });

        if (isModification && idKey && idLabel && props.formularioSegments) {
            newFields.splice(1, 0, { label: idLabel, key: idKey, type: 'number', disabled: true });

        } else if (isModification && idKey && idLabel) {
            newFields.unshift({ label: idLabel, key: idKey, type: 'number', disabled: true });
        }

        return newFields;
    }

    const handleFormSubmit = (formState: any) => {
        const newFormState = formState /*Object.fromEntries(
            Object.entries(formState).map(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    return [Object.keys(value)[0], Object.values(value)[0]];
                } else {
                    return [key, value];
                }
            })
        );*/

        if (constrolState === "crear") {
            props.createData(newFormState)
                .then((response: any) => {
                    console.log(response);
                    if (response?.ok) {
                        setControlState("default");
                        dispatchMenssage('success', 'Registro creado con exito');
                        handleUpdateData();
                    } else {
                        dispatchMenssage('error', response?.msg || 'Error al crear registro');
                    }
                });
        }

        if (constrolState === "modificar") {
            props.updateData(newFormState)
                .then((response: any) => {
                    console.log(response);
                    if (response?.ok) {
                        setControlState("default");
                        dispatchMenssage('success', 'Registro modificado con exito');
                        handleUpdateData();
                    } else {
                        dispatchMenssage('error', response?.msg || 'Error al modificar registro');
                    }
                });
        }

        if (constrolState === "eliminar") {
            props.deleteData(selectedRows)
                .then((response: any) => {
                    if (response?.ok) {

                        dispatchMenssage('success', 'Registro eliminado con exito');
                        setControlState("default");
                        handleUpdateData();
                    } else {
                        dispatchMenssage('error', response?.msg || 'Error al eliminar registro');
                    }
                });
        }
        checkToken();
    }

    const handleUpdateData = () => {

        props.fetchData().then(data => {
            setData(data);
            setTableData(data);
        });
    }

    useEffect(() => {

        props.fetchData().then(data => {
            setData(data);
            setLoading(false);
        });

    }, []);

    useEffect(() => {
        if (data) {
            setTableData(data);
            setFormFieldsCration(createFormFields(formFields));
            setFormFieldsModification(createFormFields(formFields, props.modificationLabelId.label, props.modificationLabelId.key, true));
        }
    }, [data]);

    return (
        <>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col justify-start h-full w-[100dvw] max-w-screen-xl">
                    <MantenimientoRoute
                        icon={props.icono}
                        titulo={props.nombre}
                    />
                    <ReturnButton
                        className=""
                        onClick={() => router.back()}
                        text="Regresar"
                    />

                    <h1 className="text-3xl font-bold self-start pt-8 max-sm:text-xl flex gap-2">
                        {props.nombre}
                        <div className="my-auto">
                            {props.icono}
                        </div>

                    </h1>

                    <div className="flex flex-col w-full gap-3">
                        {constrolState === "default" &&
                            <ControlButtons
                                handleCrear={() => {
                                    setControlState("crear")
                                    setSelectedRow(-1)
                                    setSelectedRows([])
                                }}
                                handleModificar={() => {
                                    setControlState("modificar")
                                    setSelectedRow(-1)
                                    setSelectedRows([])
                                }}
                                handleEliminar={() => {
                                    setControlState("eliminar")
                                    setSelectedRow(-1)
                                    setSelectedRows([])
                                }}
                            />
                        }

                        {constrolState === "crear" &&
                            <>
                                <h2 className="text-xl self-start max-sm:text-lg">Ingresar datos:</h2>
                                <Formulario
                                    formType="crear"
                                    controlState={setControlState as (str: string) => void}
                                    formFields={formFieldsCreation}
                                    classNameForm={"grid grid-cols-2 gap-4 max-sm:grid-cols-1 " + props.formClassName}
                                    className="w-fit self-center"
                                    handleSubmit={handleFormSubmit}
                                    handleUpdateData={handleUpdateData}
                                    formularioSegments={props.formularioSegments}
                                />
                            </>
                        }
                        {(constrolState === "modificar" && selectedRow >= 0) &&
                            <>
                                <h2 className="text-xl self-start max-sm:text-lg">Actualizar datos:</h2>
                                <Formulario
                                    formType="modificar"
                                    controlState={setControlState as (str: string) => void}
                                    formFields={formFieldsModification}
                                    classNameForm={"grid grid-cols-2 gap-4 max-sm:grid-cols-1 " + props.formClassName}
                                    className="w-fit self-center"
                                    initialValues={selectedRowData}
                                    setSelectedRow={setSelectedRow}
                                    selectedRow={selectedRow}
                                    handleSubmit={handleFormSubmit}
                                    handleUpdateData={handleUpdateData}
                                    formularioSegments={props.formularioSegments}
                                />
                            </>
                        }

                        {(constrolState === "eliminar" && selectedRows.length > 0) &&
                            <>

                                <Formulario
                                    formType={constrolState}
                                    controlState={setControlState as (str: string) => void}
                                    classNameForm=""
                                    className="w-fit self-center"
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    handleSubmit={handleFormSubmit}
                                    handleUpdateData={handleUpdateData}
                                    TablaEliminados={
                                        <Tabla
                                            visibleColumns={{ [props.modificationLabelId.key]: props.modificationLabelId.label, ...visibleColumns }}
                                            data={
                                                tableData?.filter((row: any) => selectedRows.includes(row[Object.keys(row)[0]]))
                                            }
                                            selectedRows={selectedRows}
                                            setSelectedRows={setSelectedRows}
                                            className="bg-transparent shadow-none p-0"
                                            classNameTableContainer="h-fit max-h-96"
                                            controlState="eliminar"
                                        />
                                    }
                                />
                            </>
                        }


                        {(constrolState === "eliminar" && selectedRows.length <= 0) &&

                            <>
                                <h2 className="text-2xl self-center pt-8  max-sm:text-1xl">Seleccione uno o varios registros de la tabla</h2>
                                <button className="btn btn-error w-fit self-center" onClick={() => {
                                    setControlState("default")
                                    setSelectedRow(-1)
                                    setSelectedRows([])

                                }}>
                                    <svg className="text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m4.3 14.3a.996.996 0 0 1-1.41 0L12 13.41L9.11 16.3a.996.996 0 1 1-1.41-1.41L10.59 12L7.7 9.11A.996.996 0 1 1 9.11 7.7L12 10.59l2.89-2.89a.996.996 0 1 1 1.41 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41"></path></svg>
                                    Cancelar
                                </button>
                            </>

                        }


                        {(constrolState === "modificar" && selectedRow < 0) &&

                            <>
                                <h2 className="text-2xl self-center pt-8  max-sm:text-1xl">Seleccione un registro de la tabla</h2>
                                <button className="btn btn-error w-fit self-center" onClick={() => {
                                    setControlState("default")
                                    setSelectedRow(-1)
                                    setSelectedRows([])

                                }}>
                                    <svg className="text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m4.3 14.3a.996.996 0 0 1-1.41 0L12 13.41L9.11 16.3a.996.996 0 1 1-1.41-1.41L10.59 12L7.7 9.11A.996.996 0 1 1 9.11 7.7L12 10.59l2.89-2.89a.996.996 0 1 1 1.41 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41"></path></svg>
                                    Cancelar
                                </button>
                            </>

                        }

                        <h2 className="text-xl self-start pt-8 max-sm:text-lg">
                            {props.nombre + ":"}
                        </h2>

                        {tableData.length > 0 && !loading &&
                            <Tabla

                                visibleColumns={visibleColumns}
                                data={tableData}
                                selectedRow={selectedRow}
                                setSelectedRow={setSelectedRow}
                                selectedRowData={selectedRowData}
                                setSelectedRowData={setSelectedRowData}
                                selectedRows={selectedRows}
                                setSelectedRows={setSelectedRows}
                                controlState={constrolState}
                                classNameTableContainer="h-96"
                                className="w-full"
                            />
                        }

                        {(tableData.length === 0 && !loading) &&
                            <h2 className="text-2xl self-center pt-8  max-sm:text-1xl">No hay datos</h2>

                        }

                        {loading &&
                            <div className="skeleton w-full h-96"></div>
                        }

                    </div>

                </div>
            </div>
        </>
    );
}