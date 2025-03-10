import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/providers/authProvider";
import { useRouter } from "next/navigation";
import { dispatchMenssage } from "@/utils/menssageDispatcher";
import BaseRoute from "../../BaseRoute";
import Formulario from "./formulario";
import Tabla from "../../tabla";
import ControlButtons from "./controllButtons";
// Importar iconos de react-icons
import { MdCancel, MdError, MdSettings } from "react-icons/md";
import { FaTools } from "react-icons/fa";

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
    formClassNameOuter = "",
}) => {
    const router = useRouter();
    const { checkToken } = useAuth();

    // Estados básicos
    const [loading, setLoading] = useState(true);
    const [controlState, setControlState] = useState<ControlStateType>("default");
    const [data, setData] = useState<any[]>([]);
    const [tableData, setTableData] = useState<{ [key: string]: any }[]>([]);

    // Estados relacionados con la selección
    const [selectedRow, setSelectedRow] = useState<number>(-1);
    const [selectedRowData, setSelectedRowData] = useState<any>({});
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    // Estados para campos de formulario
    const [formFieldsCreation, setFormFieldsCreation] = useState<any[]>([]);
    const [formFieldsModification, setFormFieldsModification] = useState<any[]>([]);

    // Crear la ruta de navegación correcta sin duplicados
    const getBreadcrumbRoutes = useCallback(() => {
        // Definición de rutas básicas
        const baseRoutes = [
            { name: "App", path: "/sistema" },
            { name: "Dashboard", path: "/sistema/dashboard" },
            { name: "Módulos", path: "/sistema/dashboard/modulos" },
            {
                name: "Mantenimiento",
                path: "/sistema/dashboard/modulos/mantenimiento",
                icon: <FaTools className="w-4 h-4" />
            }
        ];

        // Añadir la ruta actual sin duplicar "Mantenimiento"
        // Solo añadimos el nombre de la página actual si es diferente a "Mantenimiento"
        if (nombre.toLowerCase() !== "mantenimiento") {
            return [
                ...baseRoutes,
                { name: nombre, path: "", icon: icono }
            ];
        }

        return baseRoutes;
    }, [nombre, icono]);

    // Crear campos de formulario con o sin ID de modificación
    const createFormFields = useCallback(
        (fields: any[], isModification = false): any[] => {
            const newFields = fields.map(field => ({
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

    // Cargar/Actualizar datos
    const handleUpdateData = useCallback(async () => {
        try {
            const fetchedData = await fetchData();
            setData(fetchedData);
            setTableData(fetchedData);
        } catch (error) {
            dispatchMenssage("error", "Error al obtener los datos");
        }
    }, [fetchData]);

    // Manejar envío del formulario según controlState
    const handleFormSubmit = useCallback(
        async (formState: any) => {
            try {
                let response;
                const actions = {
                    "crear": () => createData(formState),
                    "modificar": () => updateData(formState),
                    "eliminar": () => deleteData(selectedRows)
                };

                response = await actions[controlState as keyof typeof actions]?.();

                if (response?.ok) {
                    const successMessages = {
                        crear: "Registro creado con éxito",
                        modificar: "Registro modificado con éxito",
                        eliminar: "Registro eliminado con éxito",
                    };

                    dispatchMenssage("success", successMessages[controlState as keyof typeof successMessages] || "Operación exitosa");
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

    // Configurar campos de formulario
    useEffect(() => {
        if (data) {
            setFormFieldsCreation(createFormFields(formFields));
            setFormFieldsModification(createFormFields(formFields, true));
        }
    }, [data, createFormFields, formFields]);

    // Componente para mensajes de selección
    const EstadoSeleccionado = ({ mensaje, onCancelar }: { mensaje: string; onCancelar: () => void }) => (
        <>
            <h2 className="text-2xl self-center pt-8 max-sm:text-xl">{mensaje}</h2>
            <button className="btn btn-error w-fit self-center" onClick={onCancelar}>
                <MdCancel className="text-xl" />
                Cancelar
            </button>
        </>
    );

    // Resetear estados de control
    const resetControlState = useCallback(() => {
        setControlState("default");
        setSelectedRow(-1);
        setSelectedRows([]);
    }, []);

    // Renderizado condicional del formulario
    const renderForm = useMemo(() => {
        const formProps = {
            handleSubmit: handleFormSubmit,
            handleUpdateData: handleUpdateData,
            controlState: setControlState,
            className: `w-fit self-center ${formClassNameOuter}`,
        };

        switch (controlState) {
            case "crear":
                return (
                    <>
                        <h2 className="text-xl self-start pt-8 max-sm:text-lg">Ingresar datos:</h2>
                        <Formulario
                            formType="crear"
                            formFields={formFieldsCreation}
                            classNameForm={`grid grid-cols-2 gap-4 max-sm:grid-cols-1 ${formClassName}`}
                            {...formProps}
                        />
                    </>
                );
            case "modificar":
                return selectedRow >= 0 ? (
                    <>
                        <h2 className="text-xl self-start pt-8 max-sm:text-lg">Actualizar datos:</h2>
                        <Formulario
                            formType="modificar"
                            formFields={formFieldsModification}
                            classNameForm={`grid grid-cols-2 gap-4 max-sm:grid-cols-1 ${formClassName}`}
                            initialValues={selectedRowData}
                            setSelectedRow={setSelectedRow}
                            selectedRow={selectedRow}
                            {...formProps}
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
                        classNameForm=""
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                        TablaEliminados={
                            <Tabla
                                visibleColumns={{
                                    [modificationLabelId.key]: modificationLabelId.label,
                                    ...visibleColumns,
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
                        {...formProps}
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
        visibleColumns,
        modificationLabelId,
        tableData,
        resetControlState,
    ]);

    // Mostrar skeleton loader mientras carga
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
            {/* Usar BaseRoute con las rutas generadas */}
            <BaseRoute routes={getBreadcrumbRoutes()} />

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
                        visibleColumns={visibleColumns}
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