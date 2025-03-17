'use client';

import PaginaGenerica from "@/components/sistema/datos_components/PaginaGenerica";
import { bodeguerosService } from "@/api/services/mantenimiento/bodeguerosSevice";
import { FaBriefcase } from "react-icons/fa";
export default function AerolineasPage() {
    return (
        <PaginaGenerica
            nombrePagina="Bodegueros"
            iconoPagina={
                <FaBriefcase />
            }
            fetchData={bodeguerosService.getBodegueros.bind(bodeguerosService)}
            createData={bodeguerosService.postBodeguero.bind(bodeguerosService)}
            updateData={bodeguerosService.putBodeguero.bind(bodeguerosService)}
            deleteData={bodeguerosService.deleteBodegueros.bind(bodeguerosService)}
            formFieldsConfig={() => [
                { label: "Nombre", key: "nombre", example: 'PACIFIC CARGO', type: 'text' },
                { label: "C.I.", key: "ci", example: '17xxxxxxxx', type: 'text' },
                { label: "Clave Bodega", key: "clave_bodega", example: '*******', type: 'text' },
                { label: "Estado", key: "estado", type: "checkbox" },

            ]}
            visibleColumns={{
                nombre: "Nombre",
                ci: "C.I.",
            }}
            modificationLabelId={{ label: "ID Bodeguero", key: "id_bodeguero" }}
            formClassName="grid-cols-3 max-lg:grid-cols-2" // Clases para el diseño del formulario
        />
    );
}
