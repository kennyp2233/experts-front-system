'use client';
import PaginaGenerica from "@/app/sistema/components/datos_components/PaginaGenerica";
import {
    getProductos,
    postProducto,
    putProducto,
    deleteProductos,
    getProductosJoinAll,
} from "@/api/mantenimiento/productos.api";
import {
    getCatalogosProductoOpciones,
    getCatalogosProductoUnidad,
} from "@/api/mantenimiento/catalogos/catalogos_producto.api";

export default function ProductosPage() {
    return (
        <PaginaGenerica
            nombrePagina="Productos"
            iconoPagina={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 2048 2048"><path fill="currentColor" d="m1344 2l704 352v785l-128-64V497l-512 256v258l-128 64V753L768 497v227l-128-64V354zm0 640l177-89l-463-265l-211 106zm315-157l182-91l-497-249l-149 75zm-507 654l-128 64v-1l-384 192v455l384-193v144l-448 224L0 1735v-676l576-288l576 288zm-640 710v-455l-384-192v454zm64-566l369-184l-369-185l-369 185zm576-1l448-224l448 224v527l-448 224l-448-224zm384 576v-305l-256-128v305zm384-128v-305l-256 128v305zm-320-288l241-121l-241-120l-241 120z" /></svg>}
            fetchData={getProductosJoinAll}
            createData={postProducto}
            updateData={putProducto}
            deleteData={deleteProductos}
            catalogFetchers={[getCatalogosProductoOpciones, getCatalogosProductoUnidad]}
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
