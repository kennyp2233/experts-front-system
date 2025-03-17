'use client';
import PaginaGenerica from "@/components/sistema/datos_components/PaginaGenerica";
import { tiposEmbarqueService } from "@/api/services/mantenimiento/tiposEmbarqueService";
import { catalogosTiposEmbarqueService } from "@/api/services/catalogos/catalogosTipoEmbarqueService";

import { MdOutlineLocalShipping } from "react-icons/md";

export default function TiposDeEmbarquePage() {
    return (
        <PaginaGenerica
            nombrePagina="Tipos De Embarque"
            iconoPagina={<MdOutlineLocalShipping />}
            fetchData={tiposEmbarqueService.getTiposEmbarque.bind(tiposEmbarqueService)}
            createData={tiposEmbarqueService.postTiposEmbarque.bind(tiposEmbarqueService)}
            updateData={tiposEmbarqueService.putTiposEmbarque.bind(tiposEmbarqueService)}
            deleteData={tiposEmbarqueService.deleteTiposEmbarque.bind(tiposEmbarqueService)}
            catalogFetchers={[
                catalogosTiposEmbarqueService.getCatalogosEmbarqueCarga.bind(catalogosTiposEmbarqueService),
                catalogosTiposEmbarqueService.getCatalogosEmbarqueEmbalaje.bind(catalogosTiposEmbarqueService)
            ]}
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
