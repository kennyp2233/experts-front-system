'use client';

import PaginaGenerica from "@/app/sistema/components/datos_components/PaginaGenerica";
import { getOrigenesJoinPaisesAduanas, deleteOrigenes, postOrigen, putOrigen } from "@/api/mantenimiento/origenes.api";
import { getPaises } from "@/api/mantenimiento/paises.api";
import { getAduanas } from "@/api/mantenimiento/cae_aduanas.api";

export default function OrigenesPage() {
    return (
        <PaginaGenerica
            nombrePagina="Orígenes"
            iconoPagina={
                <svg className="inline-block" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14 11.5A2.5 2.5 0 0 0 16.5 9A2.5 2.5 0 0 0 14 6.5A2.5 2.5 0 0 0 11.5 9a2.5 2.5 0 0 0 2.5 2.5M14 2c3.86 0 7 3.13 7 7c0 5.25-7 13-7 13S7 14.25 7 9a7 7 0 0 1 7-7M5 9c0 4.5 5.08 10.66 6 11.81L10 22S3 14.25 3 9c0-3.17 2.11-5.85 5-6.71C6.16 3.94 5 6.33 5 9" /></svg>
            }
            fetchData={getOrigenesJoinPaisesAduanas}
            createData={postOrigen}
            updateData={putOrigen}
            deleteData={deleteOrigenes}
            catalogFetchers={[getPaises, getAduanas]} // Fetches adicionales para países y aduanas
            formFieldsConfig={(data) => [
                { label: "Código Origen", key: "codigo_origen", example: 'EC', type: 'text', required: true },
                { label: "Nombre", key: "nombre", example: 'Aeropuerto de Quito', type: 'text', required: true },
                { label: "Aeropuerto", key: "aeropuerto", example: 'Mariscal Sucre', type: 'text', required: true },
                { label: "País", key: "paise", options: data[0], type: 'select', required: true },
                { label: "Aduana", key: "cae_aduana", options: data[1], type: 'select', required: true }
            ]}
            visibleColumns={{
                codigo_origen: "Código Origen",
                nombre: "Nombre",
                aeropuerto: "Aeropuerto",
                paise: "País",
                cae_aduana: "Cae Aduana"
            }}
            modificationLabelId={{ label: "ID Origen", key: "id_origen" }}
        />
    );
}
