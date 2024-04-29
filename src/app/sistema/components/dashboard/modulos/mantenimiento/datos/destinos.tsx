import { useEffect, useState } from "react";
import { useAuth } from "@/app/sistema/authProvider";
import { useMantenimiento } from "@/app/sistema/mantenimientoProvider";

import { deleteDestinos, getDestinosJoinPaisesAduanas, postDestino, putDestino } from "@/api/mantenimiento/destinos.api";
import { getPaises } from "@/api/mantenimiento/paises.api";

import MantenimientoRoute from "../mantenimientoRoute";
import ReturnButton from "../../../../returnButton";
import Formulario from "../../formulario";
import Tabla from "../../tabla";
import ControlButtons from "../controllButtons";

interface Pais {
    id_pais: number;
    nombre: string;
}


interface Destino {
    id_destino: number;
    codigo_destino: string;
    nombre: string;
    aeropuerto?: string;
    id_pais: number;
    sesa_id?: string;
    leyenda_fito?: string;
    cobro_fitos?: boolean;
    paise: Pais;
}


export default function Destinos() {
    const { setMantenimientoState } = useMantenimiento();
    const { checkToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [constrolState, setControlState] = useState<"crear" | "modificar" | "eliminar" | "default">("default");
    const [destinos, setDestinos] = useState([] as Destino[]);
    const [pais, setPais] = useState([] as Pais[]);

    const [tableData, setTableData] = useState({} as { [key: string]: any }[]);
    const [selectedRow, setSelectedRow] = useState(-1);
    const [selectedRowData, setSelectedRowData] = useState({} as any);

    const [visibleColumns, setVisibleColumns] = useState({
        codigo_destino: "Codigo Destino",
        nombre: "Nombre",
        aeropuerto: "Aeropuerto",
        paise: "Pais",
        sesa_id: "Sesa ID",
        leyenda_fito: "Leyenda Fito",
        cobro_fitos: "Cobro Fitos",
    } as any);

    const [formFieldsCreation, setFormFieldsCration] = useState([] as any[]);
    const [formFieldsModification, setFormFieldsModification] = useState([] as any[]);
    const [selectedRows, setSelectedRows] = useState([] as any[]);



    const handleFormSubmit = (formState: any) => {
        const newFormState = Object.fromEntries(
            Object.entries(formState).map(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    // Si el valor es un objeto, reemplázalo con su primer valor
                    return [Object.keys(value)[0], Object.values(value)[0]];
                } else {
                    // De lo contrario, deja el valor tal como está
                    return [key, value];
                }
            })
        );

        if (constrolState === "crear") {
            postDestino(newFormState)
                .then((response: any) => {
                    console.log(response);
                    if (response.ok) {
                        const event = new CustomEvent('success', { detail: 'Pais creado con exito' });
                        setControlState("default");
                        window.dispatchEvent(event);
                        handleUpdateData();
                    } else {
                        const event = new CustomEvent('error', { detail: response.msg });
                        window.dispatchEvent(event);
                    }
                });
        }
        if (constrolState === "modificar") {
            putDestino(newFormState)
                .then((response: any) => {
                    console.log(response);
                    if (response.ok) {
                        const event = new CustomEvent('success', { detail: 'Pais modificado con exito' });
                        setControlState("default");
                        window.dispatchEvent(event);
                        handleUpdateData();
                    } else {
                        const event = new CustomEvent('error', { detail: response.msg });
                        window.dispatchEvent(event);
                    }
                });
        }

        if (constrolState === "eliminar") {
            deleteDestinos(selectedRows)
                .then((response: any) => {
                    if (response.ok) {
                        const event = new CustomEvent('success', { detail: 'Paises eliminados con exito' });
                        window.dispatchEvent(event);
                        setControlState("default");
                        handleUpdateData();
                    } else {
                        const event = new CustomEvent('error', { detail: response.msg });
                        window.dispatchEvent(event);
                    }
                });
        }
        checkToken();
    }

    const handleUpdateData = () => {

        getDestinosJoinPaisesAduanas().then(data => {
            setDestinos(data);
            setTableData(destinos);
        });
    }


    useEffect(() => {

        getDestinosJoinPaisesAduanas().then(data => {
            setDestinos(data);
            setLoading(false);
        });

        getPaises().then(data => {
            setPais(data);
        });


    }, []);


    useEffect(() => {
        if (destinos) {

            setTableData(destinos);


            const createFormFields = (fields: any, idLabel?: string, idKey?: string, isModification = false) => {
                let newFields = fields.map((field: any) => {
                    return { ...field, placeholder: `Ej: ${field.example}` };
                });

                if (isModification && idKey && idLabel) {
                    newFields.unshift({ label: idLabel, key: idKey, type: 'number', disabled: true });
                }

                return newFields;
            }

            const keys = Object.keys(visibleColumns).filter(key => visibleColumns[key]);

            /*
            const fields = [
                { label: visibleColumns[keys[0]], key: keys[0], example: 'EC', type: 'text' },
                { label: visibleColumns[keys[1]], key: keys[1], example: 'Ecuador', type: 'text' },
                { label: visibleColumns[keys[2]], key: keys[2], example: '1', type: 'number' },
                { label: visibleColumns[keys[3]], key: keys[3], options: acuerdoArancelario, type: 'select' },
            ];
            */
            const fields = [
                { label: visibleColumns[keys[0]], key: keys[0], example: 'EC', type: 'text' },
                { label: visibleColumns[keys[1]], key: keys[1], example: 'Ecuador', type: 'text' },
                { label: visibleColumns[keys[2]], key: keys[2], example: 'Aeropuerto', type: 'text' },
                { label: visibleColumns[keys[3]], key: keys[3], options: pais, type: 'select' },
                { label: visibleColumns[keys[4]], key: keys[4], example: 'Sesa ID', type: 'number' },
                { label: visibleColumns[keys[5]], key: keys[5], example: 'Leyenda Fito', type: 'textarea' },
                { label: visibleColumns[keys[6]], key: keys[6], example: 'Cobro Fitos', type: 'checkbox' },
            ];
            setFormFieldsCration(createFormFields(fields));
            setFormFieldsModification(createFormFields(fields, "ID Destino", "id_destino", true));

        }
    }, [destinos, pais]);

    return (
        <>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col justify-start w-full h-full">
                    <MantenimientoRoute
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M8.445 3.168a1 1 0 0 1 1.002-.062L15 5.882l5.553-2.776A1 1 0 0 1 22 4v12a1 1 0 0 1-.445.832l-6 4a1 1 0 0 1-1.002.062L9 18.118l-5.553 2.776A1 1 0 0 1 2 20V8a1 1 0 0 1 .445-.832zM5 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m5 1a1 1 0 0 1-1-1a1 1 0 1 1 2 0v.001a1 1 0 0 1-1 1zm4.707-3.708a1 1 0 1 0-1.414 1.414L14.586 12l-1.293 1.293a1 1 0 0 0 1.414 1.414L16 13.414l1.293 1.293a1 1 0 0 0 1.414-1.414L17.414 12l1.293-1.293a1 1 0 0 0-1.414-1.414L16 10.586l-1.293-1.293z" clipRule="evenodd" /></svg>
                        }
                        titulo="Destinos"
                    />
                    <ReturnButton
                        className=""
                        onClick={() => setMantenimientoState("init")}
                        text="Regresar"
                    />

                    <h1 className="text-5xl font-bold self-start pt-8  max-sm:text-4xl">
                        Destinos{" "}
                        <svg className="inline-block" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M8.445 3.168a1 1 0 0 1 1.002-.062L15 5.882l5.553-2.776A1 1 0 0 1 22 4v12a1 1 0 0 1-.445.832l-6 4a1 1 0 0 1-1.002.062L9 18.118l-5.553 2.776A1 1 0 0 1 2 20V8a1 1 0 0 1 .445-.832zM5 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m5 1a1 1 0 0 1-1-1a1 1 0 1 1 2 0v.001a1 1 0 0 1-1 1zm4.707-3.708a1 1 0 1 0-1.414 1.414L14.586 12l-1.293 1.293a1 1 0 0 0 1.414 1.414L16 13.414l1.293 1.293a1 1 0 0 0 1.414-1.414L17.414 12l1.293-1.293a1 1 0 0 0-1.414-1.414L16 10.586l-1.293-1.293z" clipRule="evenodd" /></svg>
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
                                <h2 className="text-3xl self-start  max-sm:text-2xl">Ingresar datos:</h2>
                                <Formulario
                                    formType="crear"
                                    controlState={setControlState as (str: string) => void}
                                    formFields={formFieldsCreation}
                                    classNameForm="grid grid-cols-2 gap-4 max-sm:grid-cols-1"
                                    className="w-fit self-center"
                                    handleSubmit={handleFormSubmit}
                                    handleUpdateData={handleUpdateData}
                                />
                            </>
                        }
                        {(constrolState === "modificar" && selectedRow >= 0) &&
                            <>
                                <h2 className="text-3xl self-start  max-sm:text-2xl">Actualizar datos:</h2>
                                <Formulario
                                    formType="modificar"
                                    controlState={setControlState as (str: string) => void}
                                    formFields={formFieldsModification}
                                    classNameForm="grid grid-cols-2 gap-4 max-sm:grid-cols-1"
                                    className="w-fit self-center"
                                    initialValues={selectedRowData}
                                    setSelectedRow={setSelectedRow}
                                    selectedRow={selectedRow}
                                    handleSubmit={handleFormSubmit}
                                    handleUpdateData={handleUpdateData}
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
                                            visibleColumns={{ id_destino: "ID Destino", ...visibleColumns }}
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

                        <h2 className="text-3xl self-start pt-8  max-sm:text-2xl">Paises:</h2>

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