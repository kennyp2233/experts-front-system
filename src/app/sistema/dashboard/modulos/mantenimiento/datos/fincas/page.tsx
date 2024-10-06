'use client';

import PaginaGenerica from "@/app/sistema/components/datos_components/PaginaGenerica";
import { getFincasJoinAll, deleteFincas, postFinca, putFinca } from "@/api/mantenimiento/fincas.api";
import { getProductos } from "@/api/mantenimiento/productos.api";
import { getCatalogosTipoDocumento } from "@/api/mantenimiento/catalogos/catalogos_tipo_documento.api";
import { getChoferes } from "@/api/mantenimiento/choferes.api";

export default function FincasPage() {
    return (
        <PaginaGenerica
            nombrePagina="Fincas"
            iconoPagina={
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M17 16h-2v6h-3v-5H8v5H5v-6H3l7-6zM6 2l4 4H9v3H7V6H5v3H3V6H2zm12 1l5 5h-1v4h-3V9h-2v3h-1.66L14 10.87V8h-1z" />
                </svg>
            }
            fetchData={getFincasJoinAll}
            createData={postFinca}
            updateData={putFinca}
            deleteData={deleteFincas}
            catalogFetchers={[getProductos, getCatalogosTipoDocumento, getChoferes]} // Fetch de productos, tipo de documento y choferes
            formFieldsConfig={(data) => [
                { division: true, label: 'Finca' },
                { label: "Nombre", key: "nombre_finca", required: true, type: "text", example: "Nombre de la finca" },
                { label: "Código", key: "codigo_finca", required: true, type: "text", example: "Código de la finca" },
                { label: "RUC", key: "ruc_finca", type: "text", example: "RUC de la finca" },
                { label: "Tipo de Documento", key: "id_tipo_documento", required: true, type: "select", options: data[1], optionLabel: "nombre", optionValue: "id_tipo_documento" },
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
                            options: data[2], // Usamos data[2] para choferes
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
                            options: data[0], // Usamos data[0] para productos
                        }
                    ],
                    custom_name: "fincas_productos"
                }
            ]}
            visibleColumns={{
                nombre_finca: "Nombre Finca",
                ruc_finca: "Identificación Finca",
                direccion_finca: "Dirección Finca"
            }}
            modificationLabelId={{ label: "ID Finca", key: "id_finca" }}
        />
    );
}
