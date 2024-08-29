'use client';
import PaginaDatos from "../utils/paginaDatos";
import { useEffect, useState } from "react";

import { getFincasJoinAll, deleteFincas, postFinca, putFinca } from "@/api/mantenimiento/fincas.api";
import { getProductos } from "@/api/mantenimiento/productos.api";
import { getCatalogosTipoDocumento } from "@/api/mantenimiento/catalogos/catalogos_tipo_documento.api";
import { getChoferes } from "@/api/mantenimiento/choferes.api";

interface Producto {
    id_producto: number;
    codigo_producto?: string;
    nombre?: string;
    descripcion?: string;
    nombre_botanico?: string;
    especie?: string;
    unidad_medida?: string;
    precio_unitario?: number;
    estado?: boolean;
    simple_compuesto?: number;
    stems_por_full?: number;
    id_sesa?: number;
}

type Finca = {
    id_finca: number;
    nombre_finca: string;
    codigo_finca: string;
    ruc_finca?: string;
    id_tipo_documento?: number;
    genera_guias_certificadas?: boolean;
    i_general_telefono?: string;
    i_general_email?: string;
    i_general_ciudad?: string;
    i_general_provincia?: string;
    i_general_pais?: string;
    i_general_cod_sesa?: string;
    i_general_cod_pais?: string;
    dim_x?: number;
    dim_y?: number;
    dim_z?: number;
    excel_plantilla?: string;
    a_nombre?: string;
    a_codigo?: string;
    a_direccion?: string;
};

export type FincaChoferes = {
    id_fincas_choferes: number;
    id_finca: number;
    finca_chofer: string;
};

export type FincaProducto = {
    id_fincas_productos: number;
    id_finca: number;
    id_producto: number;
}

export default function Page() {
    const [loading, setLoading] = useState(true);
    const nombrePagina = "Fincas";
    const iconoPagina = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M17 16h-2v6h-3v-5H8v5H5v-6H3l7-6zM6 2l4 4H9v3H7V6H5v3H3V6H2zm12 1l5 5h-1v4h-3V9h-2v3h-1.66L14 10.87V8h-1z" /></svg>
    const modificationLabelId = { label: "ID Finca", key: "id_finca" };
    const [formFields, setFormFields] = useState([] as any[]);

    const [productos, setProductos] = useState([] as any[]);
    const [tipoDocumento, setTipoDocumento] = useState([] as any[]);
    const [choferes, setChoferes] = useState([] as any[]);

    const visibleColumns = {
        nombre_finca: "Nombre Finca",
        ruc_finca: "Identificacion Finca",
        direccion_finca: "Dirección Finca"
    } as any;

    const keys = Object.keys(visibleColumns).filter(key => visibleColumns[key]);
    useEffect(() => {

        getProductos().then((data) => {
            setProductos(data);
        });

        getCatalogosTipoDocumento().then((data) => {
            setTipoDocumento(data);
        });

        getChoferes().then((data) => {
            setChoferes(data);
        });

    }, []);

    useEffect(() => {
        if (productos.length > 0 && tipoDocumento.length > 0 && choferes.length > 0) {
            setFormFields([
                { division: true, label: 'Finca' },
                { label: "Nombre", key: "nombre_finca", required: true, type: "text", example: "Nombre de la finca" },
                { label: "Código", key: "codigo_finca", required: true, type: "text", example: "Código de la finca" },
                { label: "RUC", key: "ruc_finca", type: "text", example: "RUC de la finca" },
                { label: "Tipo de Documento", key: "id_tipo_documento", required: true, type: "select", options: tipoDocumento, optionLabel: "nombre", optionValue: "id_tipo_documento" },
                { label: "Genera Guías Certificadas", key: "genera_guias_certificadas", type: "checkbox" },
                { division: true, label: 'Información General' },
                { label: "Teléfono", key: "i_general_telefono", type: "text", example: "Teléfono de la finca" },
                { label: "Email", key: "i_general_email", type: "text", example: "Email de la finca" },
                { label: "Ciudad", key: "i_general_ciudad", type: "text", example: "Ciudad de la finca" },
                { label: "Provincia", key: "i_general_provincia", type: "text", example: "Provincia de la finca" },
                { label: "País", key: "i_general_pais", type: "text", example: "País de la finca" },
                { label: "Código SESA", key: "i_general_cod_sesa", type: "text", example: "Código SESA de la finca" },
                { label: "Código País", key: "i_general_cod_pais", type: "text", example: "Código País de la finca" },
                { division: true, label: 'Dimensiones' },
                { label: "Dimensión X", key: "dim_x", type: "number", example: "Dimensión X de la finca" },
                { label: "Dimensión Y", key: "dim_y", type: "number", example: "Dimensión Y de la finca" },
                { label: "Dimensión Z", key: "dim_z", type: "number", example: "Dimensión Z de la finca" },
                { division: true, label: 'Excel' },
                { label: "Plantilla", key: "excel_plantilla", type: "text", example: "Plantilla de Excel de la finca" },
                { division: true, label: 'Agrocalidad' },
                { label: "Nombre", key: "a_nombre", type: "text", example: "Nombre del administrador de la finca" },
                { label: "Código", key: "a_codigo", type: "text", example: "Código del administrador de la finca" },
                { label: "Dirección", key: "a_direccion", type: "text", example: "Dirección del administrador de la finca" },
                { division: true, label: 'Choferes' },
                {
                    custom: [
                        {
                            label: "Chofer",
                            key: "id_chofer",
                            type: "select",
                            textField: 'nombre_chofer',
                            valueField: 'id_chofer',
                            options: choferes,
                        }
                    ],
                    custom_name: "fincas_choferes"
                },
                { division: true, label: 'Productos' },
                {
                    custom: [
                        {
                            label: "Producto",
                            key: "id_producto",
                            type: "select",
                            textField: 'nombre',
                            valueField: 'id_producto',
                            options: productos,
                        }
                    ],
                    custom_name: "fincas_productos"
                },

            ])
            setLoading(false);
        }
    }, [productos, tipoDocumento, choferes]);

    if (loading) {
        return (
            <>
                <div className="hero min-h-screen bg-base-200">
                    <div className="hero-content text-center">
                        <div className="max-w-md">
                            <span className="loading loading-ball loading-lg"></span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {formFields.length > 0 &&
                <PaginaDatos
                    nombre={nombrePagina}
                    icono={iconoPagina}
                    fetchData={getFincasJoinAll}
                    createData={postFinca}
                    updateData={putFinca}
                    deleteData={deleteFincas}
                    formFields={formFields}
                    modificationLabelId={modificationLabelId}
                    visibleColumns={visibleColumns}
                />
            }
        </>
    );

}