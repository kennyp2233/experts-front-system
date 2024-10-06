'use client';

import PaginaGenerica from "@/app/sistema/components/datos_components/PaginaGenerica";
import { getPaises } from "@/api/mantenimiento/paises.api";
import { deleteDestinos, getDestinosJoinPaisesAduanas, postDestino, putDestino } from "@/api/mantenimiento/destinos.api";

export default function DestinosPage() {
    return (
        <PaginaGenerica
            nombrePagina="Destinos"
            iconoPagina={
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="currentColor" fillRule="evenodd" d="M8.445 3.168a1 1 0 0 1 1.002-.062L15 5.882l5.553-2.776A1 1 0 0 1 22 4v12a1 1 0 0 1-.445.832l-6 4a1 1 0 0 1-1.002.062L9 18.118l-5.553 2.776A1 1 0 0 1 2 20V8a1 1 0 0 1 .445-.832zM5 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m5 1a1 1 0 0 1-1-1a1 1 0 1 1 2 0v.001a1 1 0 0 1-1 1zm4.707-3.708a1 1 0 1 0-1.414 1.414L14.586 12l-1.293 1.293a1 1 0 0 0 1.414 1.414L16 13.414l1.293 1.293a1 1 0 0 0 1.414-1.414L17.414 12l1.293-1.293a1 1 0 0 0-1.414-1.414L16 10.586l-1.293-1.293z" clipRule="evenodd" />
                </svg>
            }
            fetchData={getDestinosJoinPaisesAduanas}
            createData={postDestino}
            updateData={putDestino}
            deleteData={deleteDestinos}
            catalogFetchers={[getPaises]} // Fetch para obtener los países
            formFieldsConfig={(data) => [
                { label: "Código Destino", key: "codigo_destino", example: 'EC', type: 'text', required: true },
                { label: "Nombre", key: "nombre", example: 'Ecuador', type: 'text' },
                { label: "Aeropuerto", key: "aeropuerto", example: 'Aeropuerto', type: 'text' },
                { label: "País", key: "paise", options: data[0], type: 'select' }, // Usamos data[0] para los países
                { label: "Sesa ID", key: "sesa_id", example: 'Sesa ID', type: 'number' },
                { label: "Leyenda Fito", key: "leyenda_fito", example: 'Leyenda Fito', type: 'textarea' },
                { label: "Cobro Fitos", key: "cobro_fitos", example: 'Cobro Fitos', type: 'checkbox' },
            ]}
            visibleColumns={{
                codigo_destino: "Código Destino",
                nombre: "Nombre",
                aeropuerto: "Aeropuerto",
                paise: "País",
                sesa_id: "Sesa ID",
                leyenda_fito: "Leyenda Fito",
                cobro_fitos: "Cobro Fitos"
            }}
            modificationLabelId={{ label: "ID Destino", key: "id_destino" }}
        />
    );
}
