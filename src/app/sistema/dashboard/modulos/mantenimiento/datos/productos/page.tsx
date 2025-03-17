'use client';
import PaginaGenerica from "@/components/sistema/datos_components/PaginaGenerica";

import { productosService } from "@/api/services/mantenimiento/productosService";

import { FiBox } from "react-icons/fi";
import { catalogoProductoService } from "@/api/services/catalogos/catalogosProductosService";

export default function ProductosPage() {
    return (
        <PaginaGenerica
            nombrePagina="Productos"
            iconoPagina={<FiBox />}
            fetchData={productosService.getProductosJoinAll.bind(productosService)}
            createData={productosService.postProducto.bind(productosService)}
            updateData={productosService.putProducto.bind(productosService)}
            deleteData={productosService.deleteProductos.bind(productosService)}
            catalogFetchers={[
                catalogoProductoService.getCatalogosProductoOpciones.bind(catalogoProductoService),
                catalogoProductoService.getCatalogosProductoUnidad.bind(catalogoProductoService)
            ]}
            formFieldsConfig={(data) => [
                { division: true, label: 'Producto' },
                { label: "Código", key: "codigo_producto", required: true, type: "text", example: "Código del producto" },
                { label: "Nombre", key: "nombre", required: true, type: "text", example: "Nombre del producto" },
                { label: "Descripción", key: "descripcion", type: "textarea", example: "Descripción del producto" },
                { label: "Nombre Botánico", key: "nombre_botanico", type: "text", uppercase: false, example: "Nombre botánico del producto" },
                { label: "Especie", key: "especie", type: "text", uppercase: false },
                { label: "Unidad de Medida", key: "medida", type: "select", options: data[1], required: true, },
                { label: "Precio Unitario", key: "precio_unitario", type: "number", required: true, example: "0.00", step: "0.01" },
                { label: "Estado", key: "estado", type: "checkbox" },
                { label: "Simple/Compuesto", key: "opcion", type: "select", options: data[0], required: true },
                { label: "Stems por Full", key: "stems_por_full", type: "number", example: "100", },
                { label: "ID SESA", key: "id_sesa", type: "number", example: "0.00" },
                { division: true, label: 'MIPRO' },
                {
                    custom: [
                        {
                            label: "Acuerdo",
                            key: "mipro_acuerdo",
                            type: "text",
                            required: false,
                        },
                        {
                            label: "DJOCode",
                            key: "mipro_djocode",
                            type: "text",
                            required: false,
                        },
                        {
                            label: "TariffCode",
                            key: "mipro_tariffcode",
                            type: "text",
                            required: false,
                        }
                    ],
                    custom_name: "mipro"
                },
                { division: true, label: 'Aranceles' },
                {
                    custom: [
                        {
                            label: "Destino",
                            key: "aranceles_destino",
                            type: "text",
                            required: false,
                        },
                        {
                            label: "Codigo Arancelario",
                            key: "aranceles_codigo",
                            type: "text",
                            required: false,
                        },
                    ],
                    custom_name: "aranceles"
                },
                { division: true, label: 'Producto Compuesto' },
                {
                    custom: [
                        {
                            label: "Destino",
                            key: "producto_compuesto_destino",
                            type: "text",
                            required: false,
                        },
                        {
                            label: "Cantidad",
                            key: "producto_compuesto_declaracion",
                            type: "number",
                            required: false,
                        },
                    ],
                    custom_name: "producto_compuesto"
                },
            ]}
            visibleColumns={{
                codigo_producto: "Código",
                nombre: "Nombre",
                descripcion: "Descripción",
                nombre_botanico: "Nombre Botánico",
                especie: "Especie",
                medida: "Unidad de Medida",
                precio_unitario: "Precio Unitario",
            }}
            modificationLabelId={{ label: "ID Producto", key: "id_producto" }}
        />
    );
}
