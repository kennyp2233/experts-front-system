import { ReactNode } from "react";

export interface ModificationLabelId {
    label: string;
    key: string;
}

export interface PaginaGenericaProps {
    nombrePagina: string;
    iconoPagina: React.ReactNode;
    fetchData: () => Promise<any>;
    createData: (data: any) => Promise<any>;
    updateData: (data: any) => Promise<any>;
    deleteData: (id: any) => Promise<any>;
    catalogFetchers?: (() => Promise<any>)[];
    formFieldsConfig: (data: any[]) => any[];
    visibleColumns: Record<string, string>;
    modificationLabelId: { label: string; key: string };
    formClassName?: string;
    formClassNameOuter?: string;
}