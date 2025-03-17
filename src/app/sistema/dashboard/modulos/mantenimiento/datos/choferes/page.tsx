'use client';

import PaginaGenerica from "@/components/sistema/datos_components/PaginaGenerica";

import { choferesService } from "@/api/services/mantenimiento/choferesService";
import { FaTruck } from "react-icons/fa";
export default function ClientesPage() {
    return (
        <PaginaGenerica
            nombrePagina="Choferes"
            iconoPagina={
                <FaTruck />
            }
            fetchData={choferesService.getChoferes.bind(choferesService)}
            createData={choferesService.postChofer.bind(choferesService)}
            updateData={choferesService.putChofer.bind(choferesService)}
            deleteData={choferesService.deleteChoferes.bind(choferesService)}
            formFieldsConfig={() => [

                { label: "Nombre", key: "nombre_chofer", example: 'Nombre del cliente', type: 'text' },
                { label: "C.I.", key: "ruc_chofer", example: '17xxxxxxxx', type: 'text' },
                { label: "Placas Camion", key: "placas_camion", example: 'PFFXXX', type: 'text' },
                { label: "Telefono Chofer", key: "telefono_chofer", example: '09xxxxxxxx', type: 'text' },
                { label: "Camión", key: "camion", example: 'FTR', type: 'text' },
                { label: "Estado Chofer", key: "estado_chofer", type: 'checkbox' },
            ]}
            visibleColumns={{
                nombre_chofer: "Nombre",
                ruc_chofer: "C.I.",
                placas_camion: "Placas Camion",
                telefono_chofer: "Telefono Chofer",
                camion: "Camión",
                estado_chofer: "Estado Chofer",
            }}
            modificationLabelId={{ label: "ID Chofer", key: "id_chofer" }}
            formClassName="grid-cols-3 max-lg:grid-cols-2" // Clases para el diseño de las columnas
        />
    );
}
