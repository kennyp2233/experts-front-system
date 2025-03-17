'use client';
import PaginaGenerica from "@/components/sistema/datos_components/PaginaGenerica";
import { unidadesMedidaService } from "@/api/services/catalogos/catalogosUnidadesMedidaService";
import { MdOutlineSpeed } from "react-icons/md";

export default function UnidadesDeMedidaPage() {
    return (
        <PaginaGenerica
            nombrePagina="Unidades De Medida"
            iconoPagina={
                <MdOutlineSpeed />
            }
            fetchData={unidadesMedidaService.getUnidadesMedida.bind(unidadesMedidaService)}
            createData={unidadesMedidaService.postUnidadMedida.bind(unidadesMedidaService)}
            updateData={unidadesMedidaService.putUnidadMedida.bind(unidadesMedidaService)}
            deleteData={unidadesMedidaService.deleteUnidadesMedida.bind(unidadesMedidaService)}

            formFieldsConfig={() => [
                { label: "Nombre", key: "nombre", required: true, type: "text", example: "KG" },
            ]}
            visibleColumns={{
                nombre: "Nombre",
            }}
            modificationLabelId={{ label: "ID Medida", key: "id_medida" }}
        />
    );
}
