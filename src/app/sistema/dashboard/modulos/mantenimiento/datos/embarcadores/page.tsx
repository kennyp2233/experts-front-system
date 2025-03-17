'use client';

import PaginaGenerica from "@/components/sistema/datos_components/PaginaGenerica";

import { embarcadoresService } from "@/api/services/mantenimiento/embarcadoresService";
import { BiSolidTruck } from "react-icons/bi";
export default function EmbarcadoresPage() {
    return (
        <PaginaGenerica
            nombrePagina="Embarcadores | Shipper's"
            iconoPagina={
                <BiSolidTruck />
            }
            fetchData={embarcadoresService.getEmbarcadores.bind(embarcadoresService)}
            createData={embarcadoresService.postEmbarcador.bind(embarcadoresService)}
            updateData={embarcadoresService.putEmbarcador.bind(embarcadoresService)}
            deleteData={embarcadoresService.deleteEmbarcadores.bind(embarcadoresService)}
            formFieldsConfig={() => [
                { label: "Nombre", key: "nombre", required: true, type: "text", example: "Juan Pérez" },
                { label: "CI/RUC", key: "ci", required: false, type: "text", example: "1234567890" },
                { label: "Dirección", key: "direccion", required: false, type: "text", example: "Av. 10 de Agosto" },
                { label: "Teléfono", key: "telefono", required: false, type: "text", example: "0987654321" },
                { label: "Email", key: "email", required: false, type: "email", example: "", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$" },
                { label: "Ciudad", key: "ciudad", required: false, type: "text", example: "Quito" },
                { label: "Provincia", key: "provincia", required: false, type: "text", example: "Pichincha" },
                { label: "País", key: "pais", required: false, type: "text", example: "Ecuador" },
                { label: "Código País", key: "embarcador_codigo_pais", required: false, type: "number", example: "EC" },
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
                embarcador_codigo_pais: "Código País",
                handling: "Handling",
                estado: "Estado"
            }}
            modificationLabelId={{ label: "ID Embarcador", key: "id_embarcador" }}
        />
    );
}
