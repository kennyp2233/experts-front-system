'use client';

import PaginaGenerica from "@/components/sistema/datos_components/PaginaGenerica";
import { subagenciasService } from "@/api/services/mantenimiento/subagenciasService";
import { FaNetworkWired } from "react-icons/fa";
export default function AerolineasPage() {
    return (
        <PaginaGenerica
            nombrePagina="Sub Agencias"
            iconoPagina={
                <FaNetworkWired />
            }
            fetchData={subagenciasService.getSubagencias.bind(subagenciasService)}
            createData={subagenciasService.postSubagencia.bind(subagenciasService)}
            updateData={subagenciasService.putSubagencia.bind(subagenciasService)}
            deleteData={subagenciasService.deleteSubagencias.bind(subagenciasService)}
            formFieldsConfig={() => [
                { label: "Nombre", key: "nombre", example: 'PACIFIC CARGO', type: 'text' },
                { label: "CI/RUC", key: "ci_ruc", example: '1234567890', type: 'text' },
                { label: "Direccion", key: "direccion", example: 'Calle 123', type: 'textarea' },
                { label: "Telefono", key: "telefono", example: '0987654321', type: 'text' },
                { label: "Email", key: "email", example: '', type: 'email' },
                { label: "Ciudad", key: "ciudad", example: 'Quito', type: 'text' },
                { label: "Pais", key: "pais", example: 'Ecuador', type: 'text' },
                { label: "Provincia", key: "provincia", example: '', type: 'text' },
                { label: "Representante", key: "representante", example: '', type: 'text' },
                { label: "Comision", key: "comision", example: '0.00', type: 'number', step: '0.01' },
                { label: "Estado", key: "estado", type: "checkbox" },

            ]}
            visibleColumns={{
                nombre: "Nombre",
                ci_ruc: "CI/RUC",
                direccion: "Direccion",
            }}
            modificationLabelId={{ label: "ID SubAgencia", key: "id_subagencia" }}
            formClassName="grid-cols-3 max-lg:grid-cols-2" // Clases para el diseño del formulario
        />
    );
}
