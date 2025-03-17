'use client';

import PaginaGenerica from "@/components/sistema/datos_components/PaginaGenerica";
import { origenesService } from "@/api/services/mantenimiento/origenesService";
import { paisesService } from "@/api/services/mantenimiento/paisesSevice";
import { aduanasService } from "@/api/services/mantenimiento/aduanasService";
import { FiMapPin } from "react-icons/fi";

export default function OrigenesPage() {
    return (
        <PaginaGenerica
            nombrePagina="Orígenes"
            iconoPagina={
                <FiMapPin />
            }
            fetchData={origenesService.getOrigenesJoinPaisesAduanas.bind(origenesService)}
            createData={origenesService.postOrigen.bind(origenesService)}
            updateData={origenesService.putOrigen.bind(origenesService)}
            deleteData={origenesService.deleteOrigenes.bind(origenesService)}
            catalogFetchers={[
                paisesService.getPaises.bind(paisesService), // Fetches para países
                aduanasService.getAduanas.bind(aduanasService) // Fetches para aduanas
            ]} // Fetches adicionales para países y aduanas
            formFieldsConfig={(data) => [
                { label: "Código Origen", key: "codigo_origen", example: 'EC', type: 'text', required: true },
                { label: "Nombre", key: "nombre", example: 'Aeropuerto de Quito', type: 'text', required: true },
                { label: "Aeropuerto", key: "aeropuerto", example: 'Mariscal Sucre', type: 'text', required: true },
                { label: "País", key: "pais", options: data[0], type: 'select', required: true },
                { label: "Aduana", key: "cae_aduana", options: data[1], type: 'select', required: true }
            ]}
            visibleColumns={{
                codigo_origen: "Código Origen",
                nombre: "Nombre",
                aeropuerto: "Aeropuerto",
                pais: "País",
                cae_aduana: "Cae Aduana"
            }}
            modificationLabelId={{ label: "ID Origen", key: "id_origen" }}
        />
    );
}
