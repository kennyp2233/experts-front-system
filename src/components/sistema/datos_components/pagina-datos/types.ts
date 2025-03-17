import { ReactNode } from "react";

export interface ModificationLabelId {
    label: string;
    key: string;
}

export interface PaginaDatosProps {
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

export type ControlStateType = "default" | "crear" | "modificar" | "eliminar";