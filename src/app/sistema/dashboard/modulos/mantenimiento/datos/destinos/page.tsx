'use client';

import PaginaGenerica from "@/components/sistema/datos_components/PaginaGenerica";

import { destinosService } from "@/api/services/mantenimiento/destinosSevice";
import { paisesService } from "@/api/services/mantenimiento/paisesSevice";
import { FiMap } from "react-icons/fi";
export default function DestinosPage() {
    return (
        <PaginaGenerica
            nombrePagina="Destinos"
            iconoPagina={
                <FiMap />
            }
            fetchData={destinosService.getDestinosJoinPaisesAduanas.bind(destinosService)} // Fetch para obtener los destinos
            createData={destinosService.postDestino.bind(destinosService)}
            updateData={destinosService.putDestino.bind(destinosService)}
            deleteData={destinosService.deleteDestinos.bind(destinosService)}
            catalogFetchers={[paisesService.getPaises.bind(paisesService)]} // Fetch para obtener los países
            formFieldsConfig={(data) => [
                { label: "Código Destino", key: "codigo_destino", example: 'EC', type: 'text', required: true },
                { label: "Nombre", key: "nombre", example: 'Ecuador', type: 'text' },
                { label: "Aeropuerto", key: "aeropuerto", example: 'Aeropuerto', type: 'text' },
                { label: "País", key: "pais", options: data[0], type: 'select' }, // Usamos data[0] para los países
                { label: "Sesa ID", key: "sesa_id", example: 'Sesa ID', type: 'number' },
                { label: "Leyenda Fito", key: "leyenda_fito", example: 'Leyenda Fito', type: 'textarea' },
                { label: "Cobro Fitos", key: "cobro_fitos", example: 'Cobro Fitos', type: 'checkbox' },
            ]}
            visibleColumns={{
                codigo_destino: "Código Destino",
                nombre: "Nombre",
                aeropuerto: "Aeropuerto",
                pais: "País",
                sesa_id: "Sesa ID",
                leyenda_fito: "Leyenda Fito",
                cobro_fitos: "Cobro Fitos"
            }}
            modificationLabelId={{ label: "ID Destino", key: "id_destino" }}
        />
    );
}
