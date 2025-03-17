import { useCallback } from "react";
import { dispatchMenssage } from "@/utils/menssageDispatcher";
import { ControlStateType, ModificationLabelId } from "./types";

interface UseCrudOperationsProps {
    controlState: ControlStateType;
    createData: (data: any) => Promise<any>;
    updateData: (data: any) => Promise<any>;
    deleteData: (ids: any[]) => Promise<any>;
    selectedRows: any[];
    fetchData: () => Promise<any>;
    setData: (data: any[]) => void;
    setTableData: (data: any[]) => void;
    setControlState: (state: ControlStateType) => void;
    checkToken: () => Promise<boolean>;
}

export const useCrudOperations = ({
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
}: UseCrudOperationsProps) => {

    // Cargar/Actualizar datos
    const handleUpdateData = useCallback(async () => {
        try {
            const fetchedData = await fetchData();
            setData(fetchedData);
            setTableData(fetchedData);
        } catch (error) {
            dispatchMenssage("error", "Error al obtener los datos");
        }
    }, [fetchData, setData, setTableData]);

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
        [controlState, createData, updateData, deleteData, selectedRows, handleUpdateData, checkToken, setControlState]
    );

    // Crear campos de formulario con o sin ID de modificación
    const createFormFields = useCallback(
        (fields: any[], isModification = false, modificationLabelId?: ModificationLabelId): any[] => {
            const newFields = fields.map(field => ({
                ...field,
                placeholder: `Ej: ${field.example}`,
            }));

            if (isModification && modificationLabelId) {
                newFields.unshift({
                    label: modificationLabelId.label,
                    key: modificationLabelId.key,
                    type: "number",
                    disabled: true,
                });
            }

            return newFields;
        },
        []
    );

    return {
        handleUpdateData,
        handleFormSubmit,
        createFormFields
    };
};