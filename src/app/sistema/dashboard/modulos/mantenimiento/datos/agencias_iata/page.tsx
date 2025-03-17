'use client';

import PaginaGenerica from "@/components/sistema/datos_components/PaginaGenerica";

import { agenciaIataService } from "@/api/services/mantenimiento/agenciasIataService";
import { HiOfficeBuilding } from "react-icons/hi";
export default function AerolineasPage() {
    return (
        <PaginaGenerica
            nombrePagina="Agencias IATA"
            iconoPagina={
                <HiOfficeBuilding />
            }
            fetchData={agenciaIataService.getAgenciasIata.bind(agenciaIataService)}
            createData={agenciaIataService.postAgenciaIata.bind(agenciaIataService)}
            updateData={agenciaIataService.putAgenciaIata.bind(agenciaIataService)}
            deleteData={agenciaIataService.deleteAgenciasIata.bind(agenciaIataService)}
            formFieldsConfig={() => [
                { division: true, label: "Shipper's Name and Address" },
                { label: "Alias", key: "alias_shipper", example: 'PACIFIC DIRECTO', type: 'text' },
                { label: "Nombre", key: "nombre_shipper", example: 'PACIFIC CARGO', type: 'text' },
                { label: "RUC", key: "ruc_shipper", example: '1234567890', type: 'text' },
                { label: "Direccion", key: "direccion_shipper", example: 'Calle 123', type: 'textarea' },
                { label: "Telefono", key: "telefono_shipper", example: '0987654321', type: 'text' },
                { label: "Ciudad", key: "ciudad_shipper", example: 'Quito', type: 'text' },
                { label: "Pais", key: "pais_shipper", example: 'Ecuador', type: 'text' },
                { label: "Estado", key: "estado_agencia_iata", type: "checkbox" },

                { division: true, label: "[Agencia IATA Relacionada] Issuing Carrier's Agent Name and City" },
                { label: "Nombre", key: "nombre_carrier", example: 'PACIFIC CARGO', type: 'text' },
                { label: "RUC", key: "ruc_carrier", example: '1234567890', type: 'text' },
                { label: "Direccion", key: "direccion_carrier", example: 'Calle 123', type: 'textarea' },
                { label: "Telefono", key: "telefono_carrier", example: '0987654321', type: 'text' },
                { label: "Ciudad", key: "ciudad_carrier", example: 'Quito', type: 'text' },
                { label: "Pais", key: "pais_carrier", example: 'Ecuador', type: 'text' },
                { label: "IATA Code", key: "iata_code_carrier", example: 'Ecuador', type: 'text' },

                { division: true, label: "Códigos de Operación" },
                { label: "Registro Exportador SESA ", key: "registro_exportador", example: 'CF/SESA-XXXX', type: 'text' },
                { label: "Codigo Operador de Carga SESA ", key: "codigo_operador", example: 'XXXX', type: 'text' },
                { label: "Codigo Consolidador de Carga SESA ", key: "codigo_consolidador", example: 'XXXX', type: 'text' },
                { division: true, label: "Comisión" },
                { label: "Comisión", key: "comision", example: 'XX.XX', type: 'number', step: '0.01' },

            ]}
            visibleColumns={{
                alias_shipper: "Alias",
                nombre_shipper: "Nombre",
                ruc_shipper: "RUC",
                direccion_shipper: "Direccion",
            }}
            modificationLabelId={{ label: "ID Agencia IATA", key: "id_agencia_iata" }}
            formClassName="grid-cols-3 max-lg:grid-cols-2" // Clases para el diseño del formulario
        />
    );
}
