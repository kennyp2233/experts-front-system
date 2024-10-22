import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/app/providers/authProvider";
import { useRouter } from "next/navigation";
import { dispatchMenssage } from "@/app/utils/menssageDispatcher";

import MantenimientoRoute from "./mantenimientoRoute";
import ReturnButton from "@/app/sistema/components/returnButton";
import Formulario from "@/app/sistema/components/formulario";
import Tabla from "@/app/sistema/components/tabla";
import ControlButtons from "./controllButtons"; // Asegúrate de que el nombre del archivo es correcto

interface ModificationLabelId {
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
    modificationLabelId: ModificationLabelId;
    formClassName?: string;
    formularioSegments?: boolean;
    formClassNameOuter?: string;
}

type ControlStateType = "default" | "crear" | "modificar" | "eliminar";

const PaginaDatos: React.FC<PaginaDatosProps> = ({
    nombre,
    icono,
    visibleColumns,
    fetchData,
    createData,
    updateData,
    deleteData,
    formFields,
    modificationLabelId,
    formClassName = "",
    formularioSegments = false,
    formClassNameOuter = "",
}) => {
    const router = useRouter();
    const { checkToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [controlState, setControlState] = useState<ControlStateType>("default");

    const [data, setData] = useState<any[]>([]);
    const [tableData, setTableData] = useState<{ [key: string]: any }[]>([]);
    const [selectedRow, setSelectedRow] = useState<number>(-1);
    const [selectedRowData, setSelectedRowData] = useState<any>({});
    const [currentVisibleColumns, setCurrentVisibleColumns] = useState(visibleColumns);

    const [formFieldsCreation, setFormFieldsCreation] = useState<any[]>([]);
    const [formFieldsModification, setFormFieldsModification] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    // Función para crear campos de formulario
    const createFormFields = useCallback(
        (fields: any[], isModification = false): any[] => {
            let newFields = fields.map((field) => ({
                ...field,
                placeholder: `Ej: ${field.example}`,
            }));

            if (isModification) {
                newFields.unshift({
                    label: modificationLabelId.label,
                    key: modificationLabelId.key,
                    type: "number",
                    disabled: true,
                });
            }

            return newFields;
        },
        [modificationLabelId]
    );

    // Actualizar datos
    const handleUpdateData = useCallback(async () => {
        try {
            const fetchedData = await fetchData();
            setData(fetchedData);
            setTableData(fetchedData);
        } catch (error) {
            dispatchMenssage("error", "Error al obtener los datos");
        }
    }, [fetchData]);

    // Manejo del envío del formulario
    const handleFormSubmit = useCallback(
        async (formState: any) => {
            try {
                let response;
                if (controlState === "crear") {
                    response = await createData(formState);
                } else if (controlState === "modificar") {
                    response = await updateData(formState);
                } else if (controlState === "eliminar") {
                    response = await deleteData(selectedRows);
                }

                if (response?.ok) {
                    const successMessages: { [key in ControlStateType]?: string } = {
                        crear: "Registro creado con éxito",
                        modificar: "Registro modificado con éxito",
                        eliminar: "Registro eliminado con éxito",
                    };
                    dispatchMenssage("success", successMessages[controlState] || "Operación exitosa");
                    setControlState("default");
                    await handleUpdateData();
                } else {
                    dispatchMenssage("error", response?.msg || "Error en la operación");
                }
            } catch (error) {
                dispatchMenssage("error", "Ocurrió un error inesperado");
            } finally {
                checkToken();
            }
        },
        [controlState, createData, updateData, deleteData, selectedRows, handleUpdateData, checkToken]
    );



    // Inicializar datos
    useEffect(() => {
        const initializeData = async () => {
            await handleUpdateData();
            setLoading(false);
        };
        initializeData();
    }, [handleUpdateData]);

    // Configurar campos de formulario cuando los datos cambian
    useEffect(() => {
        if (data) {
            setFormFieldsCreation(createFormFields(formFields));
            setFormFieldsModification(createFormFields(formFields, true));
        }
    }, [data, createFormFields, formFields]);

    // Componente para manejar estados de selección y cancelar
    const EstadoSeleccionado: React.FC<{ mensaje: string; onCancelar: () => void }> = ({
        mensaje,
        onCancelar,
    }) => (
        <>
            <h2 className="text-2xl self-center pt-8 max-sm:text-xl">{mensaje}</h2>
            <button className="btn btn-error w-fit self-center" onClick={onCancelar}>
                <svg
                    className="text-xl"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="currentColor"
                        d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 
                        10-4.47 10-10S17.53 2 12 2m4.3 14.3a.996.996 0 0 1-1.41 0L12 
                        13.41l-2.89 2.89a.996.996 0 1 1-1.41-1.41L10.59 
                        12 7.7 9.11a.996.996 0 1 1 1.41-1.41L12 
                        10.59l2.89-2.89a.996.996 0 1 1 1.41 1.41L13.41 
                        12l2.89 2.89c.38.38.38 1.02 0 1.41z"
                    ></path>
                </svg>
                Cancelar
            </button>
        </>
    );

    // Función para reiniciar el estado de control
    const resetControlState = useCallback(() => {
        setControlState("default");
        setSelectedRow(-1);
        setSelectedRows([]);
    }, []);

    // Renderizado del formulario basado en el estado de control
    const renderForm = useMemo(() => {
        switch (controlState) {
            case "crear":
                return (
                    <>
                        <h2 className="text-xl self-start pt-8 max-sm:text-lg">Ingresar datos:</h2>
                        <Formulario
                            formType="crear"
                            controlState={setControlState} // Tipo: (state: string) => void
                            formFields={formFieldsCreation}
                            classNameForm={`grid grid-cols-2 gap-4 max-sm:grid-cols-1 ${formClassName}`}
                            className={`w-fit self-center ${formClassNameOuter}`}
                            handleSubmit={handleFormSubmit}
                            handleUpdateData={handleUpdateData}
                        />
                    </>
                );
            case "modificar":
                return selectedRow >= 0 ? (
                    <>
                        <h2 className="text-xl self-start pt-8 max-sm:text-lg">Actualizar datos:</h2>
                        <Formulario
                            formType="modificar"
                            controlState={setControlState} // Tipo: (state: string) => void
                            formFields={formFieldsModification}
                            classNameForm={`grid grid-cols-2 gap-4 max-sm:grid-cols-1 ${formClassName}`}
                            className={`w-fit self-center ${formClassNameOuter}`}
                            initialValues={selectedRowData}
                            setSelectedRow={setSelectedRow}
                            selectedRow={selectedRow}
                            handleSubmit={handleFormSubmit}
                            handleUpdateData={handleUpdateData}
                        />
                    </>
                ) : (
                    <EstadoSeleccionado
                        mensaje="Seleccione un registro de la tabla"
                        onCancelar={resetControlState}
                    />
                );
            case "eliminar":
                return selectedRows.length > 0 ? (
                    <Formulario
                        formType="eliminar"
                        controlState={setControlState} // Tipo: (state: string) => void
                        classNameForm=""
                        className={`w-fit self-center ${formClassNameOuter}`}
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                        handleSubmit={handleFormSubmit}
                        handleUpdateData={handleUpdateData}
                        TablaEliminados={
                            <Tabla
                                visibleColumns={{
                                    [modificationLabelId.key]: modificationLabelId.label,
                                    ...currentVisibleColumns,
                                }}
                                data={tableData.filter((row) =>
                                    selectedRows.includes(row[modificationLabelId.key])
                                )}
                                selectedRows={selectedRows}
                                setSelectedRows={setSelectedRows}
                                className="bg-transparent shadow-none p-0"
                                classNameTableContainer="h-fit max-h-96"
                                controlState="eliminar"
                            />
                        }
                    />
                ) : (
                    <EstadoSeleccionado
                        mensaje="Seleccione uno o varios registros de la tabla"
                        onCancelar={resetControlState}
                    />
                );
            default:
                return null;
        }
    }, [
        controlState,
        formFieldsCreation,
        formFieldsModification,
        formClassName,
        formClassNameOuter,
        handleFormSubmit,
        handleUpdateData,
        selectedRow,
        selectedRowData,
        selectedRows,
        currentVisibleColumns,
        modificationLabelId,
        tableData,
        resetControlState,
    ]);

    if (loading) {
        return (
            <div className="flex flex-col p-4 gap-4 w-full h-full">
                <div className="skeleton w-full h-1/3"></div>
                <div className="skeleton w-full h-full"></div>
            </div>
        );
    }

    return (
        <div className="hero-content flex-col justify-start h-full w-full max-w-screen-xl">
            <MantenimientoRoute icon={icono} titulo={nombre} desde="sistema" />


            <h1 className="text-3xl font-bold self-start pt-8 max-sm:text-xl flex gap-2">
                {nombre}
                <span className="my-auto">{icono}</span>
            </h1>

            <div className="flex flex-col w-full gap-3">
                {controlState === "default" && (
                    <ControlButtons
                        handleCrear={() => {
                            setControlState("crear");
                            setSelectedRow(-1);
                            setSelectedRows([]);
                        }}
                        handleModificar={() => {
                            setControlState("modificar");
                            setSelectedRow(-1);
                            setSelectedRows([]);
                        }}
                        handleEliminar={() => {
                            setControlState("eliminar");
                            setSelectedRow(-1);
                            setSelectedRows([]);
                        }}
                    />
                )}

                {renderForm}

                <h2 className="text-xl self-start pt-8 max-sm:text-lg">{`${nombre}:`}</h2>

                {tableData?.length > 0 ? (
                    <Tabla
                        visibleColumns={currentVisibleColumns}
                        data={tableData}
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                        selectedRowData={selectedRowData}
                        setSelectedRowData={setSelectedRowData}
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                        controlState={controlState}
                        classNameTableContainer="h-96"
                        className="w-full"
                    />
                ) : (
                    <h2 className="text-2xl self-center pt-8 max-sm:text-xl">No hay datos</h2>
                )}
            </div>
        </div>
    );
};

export default PaginaDatos;
