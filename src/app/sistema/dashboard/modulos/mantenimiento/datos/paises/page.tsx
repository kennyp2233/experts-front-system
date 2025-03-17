'use client';
import PaginaGenerica from "@/components/sistema/datos_components/PaginaGenerica";

import { acuerdosArancelariosService } from "@/api/services/mantenimiento/acuerdosArancelariosService";
import { paisesService } from "@/api/services/mantenimiento/paisesSevice";
import { FiGlobe } from "react-icons/fi";
export default function PaisesPage() {
    return (
        <PaginaGenerica
            nombrePagina="Paises"
            iconoPagina={
                <FiGlobe />
            }
            fetchData={paisesService.getPaisesJoinAcuerdos.bind(paisesService)}
            createData={paisesService.postPais.bind(paisesService)}
            updateData={paisesService.putPais.bind(paisesService)}
            deleteData={paisesService.deletePaises.bind(paisesService)}
            catalogFetchers={[acuerdosArancelariosService.getAcuerdosArancelarios.bind(acuerdosArancelariosService)]}
            formFieldsConfig={(data) => [
                { label: "Siglas País", key: "siglas_pais", example: 'EC', type: 'text', required: true },
                { label: "Nombre País", key: "nombre", example: 'Ecuador', type: 'text', required: true },
                { label: "ID País SESA", key: "pais_id", example: '1', type: 'number', required: true },
                { label: "Acuerdo Arancelario", key: "acuerdos_arancelario", options: data[0], type: 'select', required: true }
            ]}
            visibleColumns={{
                siglas_pais: "Siglas País",
                nombre: "Nombre País",
                pais_id: "ID País SESA",
                acuerdos_arancelario: "Acuerdo Arancelario"
            }}
            modificationLabelId={{ label: "ID Pais", key: "id_pais" }}
        />
    );
}
