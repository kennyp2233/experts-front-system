'use client';

import PaginaGenerica from "@/app/sistema/components/datos_components/PaginaGenerica";
import { getEmbarcadores, postEmbarcador, putEmbarcador, deleteEmbarcadores } from "@/api/mantenimiento/embarcadores.api";

export default function EmbarcadoresPage() {
    return (
        <PaginaGenerica
            nombrePagina="Embarcadores | Shipper's"
            iconoPagina={
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5m13.5-9l1.96 2.5H17V9.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5" />
                </svg>
            }
            fetchData={getEmbarcadores}
            createData={postEmbarcador}
            updateData={putEmbarcador}
            deleteData={deleteEmbarcadores}
            formFieldsConfig={() => [
                { label: "Nombre", key: "nombre", required: true, type: "text", example: "Juan Pérez" },
                { label: "CI/RUC", key: "ci", required: false, type: "text", example: "1234567890" },
                { label: "Dirección", key: "direccion", required: false, type: "text", example: "Av. 10 de Agosto" },
                { label: "Teléfono", key: "telefono", required: false, type: "text", example: "0987654321" },
                { label: "Email", key: "email", required: false, type: "email", example: "", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$" },
                { label: "Ciudad", key: "ciudad", required: false, type: "text", example: "Quito" },
                { label: "Provincia", key: "provincia", required: false, type: "text", example: "Pichincha" },
                { label: "País", key: "pais", required: false, type: "text", example: "Ecuador" },
                { label: "Código País", key: "codigo_pais", required: false, type: "number", example: "EC" },
                { label: "Handling", key: "handling", required: false, type: "number", example: "1" },
                { label: "Estado", key: "estado", required: false, type: "checkbox" },
            ]}
            visibleColumns={{
                nombre: "Nombre",
                ci: "CI/RUC",
                direccion: "Dirección",
                telefono: "Teléfono",
                email: "Email",
                ciudad: "Ciudad",
                provincia: "Provincia",
                pais: "País",
                codigo_pais: "Código País",
                handling: "Handling",
                estado: "Estado"
            }}
            modificationLabelId={{ label: "ID Embarcador", key: "id_embarcador" }}
        />
    );
}
