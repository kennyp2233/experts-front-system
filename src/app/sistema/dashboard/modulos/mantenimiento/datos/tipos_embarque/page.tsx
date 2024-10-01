'use client';
import PaginaGenerica from "@/app/sistema/components/datos_components/PaginaGenerica";
import {
    getTiposEmbarqueJoinAll,
    postTiposEmbarque,
    putTiposEmbarque,
    deleteTiposEmbarque,
} from "@/api/mantenimiento/tipos_embarque.api";
import {
    getCatalogosEmbarqueCarga,
    getCatalogosEmbarqueEmbalaje,
} from "@/api/mantenimiento/catalogos/catalogos_tipos_embarque.api";

export default function TiposDeEmbarquePage() {
    return (
        <PaginaGenerica
            nombrePagina="Tipos De Embarque"
            iconoPagina={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><defs><mask id="ipSTransport0"><g fill="none" strokeWidth="4"><rect width="28" height="18" x="16" y="12" fill="#fff" stroke="#fff" strokeLinejoin="round" rx="3" /><path stroke="#000" strokeLinecap="round" d="M24 18v6m12-6v6" /><path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M36 12V6H24v6m20 24H12a2 2 0 0 1-2-2V11a2 2 0 0 0-2-2H4" /><path fill="#fff" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M19 42a3 3 0 0 1-3-3v-3h6v3a3 3 0 0 1-3 3m18 0a3 3 0 0 1-3-3v-3h6v3a3 3 0 0 1-3 3" /></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSTransport0)" /></svg>}
            fetchData={getTiposEmbarqueJoinAll}
            createData={postTiposEmbarque}
            updateData={putTiposEmbarque}
            deleteData={deleteTiposEmbarque}
            catalogFetchers={[getCatalogosEmbarqueCarga, getCatalogosEmbarqueEmbalaje]}
            formFieldsConfig={(data) => [
                { label: "Código", key: "codigo_embarque", required: true, type: "text", example: "Kilogramos" },
                { label: "Descripcion", key: "nombre", type: "textarea", example: "Nombre" },
                { label: "Tipo Carga", key: "carga", required: true, type: "select", options: data[0] },
                { label: "Tipo Embalaje", key: "embalaje", required: true, type: "select", options: data[1] },
                { label: "Regimen", key: "regimen", type: "text", example: "Regimen" },
                { label: "Mercancia", key: "mercancia", type: "text", example: "Mercancia" },
                { label: "Harmonised Comidity Code", key: "harmonised_comidity", type: "text", example: "Harmonised Comidity Code" },
            ]}
            visibleColumns={{
                codigo_embarque: "Código",
                nombre: "Nombre",
                carga: "Tipo Carga",
                embalaje: "Tipo Embalaje",
                regimen: "Regimen",
                mercancia: "Mercancia",
                harmonised_comidity: "Harmonised Comidity Code",
            }}
            modificationLabelId={{ label: "ID Embarque", key: "id_tipo_embarque" }}
        />
    );
}
