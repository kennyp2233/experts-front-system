import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/providers/authProvider";
import { useRouter } from "next/navigation";
import BaseRoute from "../../BaseRoute";
import Formulario from "../common/formulario";
import Tabla from "../../tabla";
import ControlButtons from "../common/controllButtons";
import { TablaSkeleton, EstadoSeleccionado } from "./components";
import { useCrudOperations } from "./useCrudOperations";
import { useBreadcrumbRoutes } from "./useBreadcrumbRoutes";
import { ModificationLabelId, ControlStateType, PaginaDatosProps } from "./types";

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

    // Generar rutas de breadcrumb
    const breadcrumbRoutes = useBreadcrumbRoutes(nombre, icono);

    // Operaciones CRUD
    const {
        handleFormSubmit,
        handleUpdateData,
        createFormFields
    } = useCrudOperations({
        controlState,
        createData,
        updateData,
        deleteData,
        selectedRows,
        fetchData,
        setData,
        setTableData,
        setControlState,
        checkToken
    });

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
            setFormFieldsModification(createFormFields(formFields, true, modificationLabelId));
        }
    }, [data, createFormFields, formFields, modificationLabelId]);

    // Resetear estados de control
    const resetControlState = useCallback(() => {
        setControlState("default");
        setSelectedRow(-1);
        setSelectedRows([]);
    }, []);

    // Renderizado del formulario según el estado de control
    const renderForm = useMemo(() => {
        const formProps = {
            handleSubmit: handleFormSubmit,
            handleUpdateData,
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
        return <TablaSkeleton />;
    }

    return (
        <div className="hero-content flex-col justify-start h-full w-full max-w-screen-xl">
            {/* Breadcrumb */}
            <BaseRoute routes={breadcrumbRoutes} />

            {/* Título de la página */}
            <h1 className="text-3xl font-bold self-start pt-8 max-sm:text-xl flex gap-2">
                {nombre}
                <span className="my-auto">{icono}</span>
            </h1>

            <div className="flex flex-col w-full gap-3">
                {/* Controles de operaciones (Crear, Modificar, Eliminar) */}
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

                {/* Formulario condicional según controlState */}
                {renderForm}

                {/* Tabla de datos */}
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