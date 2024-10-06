'use client';

import PaginaGenerica from "@/app/sistema/components/datos_components/PaginaGenerica";
import { getAgenciasIata, deleteAgenciasIata, postAgenciaIata, putAgenciaIata } from "@/api/mantenimiento/agencias_iata.api";

export default function AerolineasPage() {
    return (
        <PaginaGenerica
            nombrePagina="Agencias IATA"
            iconoPagina={
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 50 50"><path fill="currentColor" d="M46 14H34v-3.976C34 7.173 32.159 4 29.311 4h-9.592C16.868 4 15 7.173 15 10.024V14H4c-1.1 0-2 .9-2 2v29c0 1.1.9 2 2 2h42c1.1 0 2-.9 2-2V16c0-1.1-.9-2-2-2M30 44H19v-1.067c0-.023.613-.053.906-.088s.55-.094.761-.176c.375-.141.795-.343.948-.606S22 41.45 22 41.017v-10.23c0-.41-.248-.771-.436-1.081s-.499-.56-.78-.747c-.211-.141-.359-.275-.787-.404S19 28.343 19 28.308v-1.283l8.175-.457l-.175.263v13.957c0 .41.316.759.492 1.046s.542.501.87.642c.234.105.485.199.767.281s.871.14.871.176zm-9.381-23.761c0-.891.343-1.652 1.028-2.285s1.503-.949 2.452-.949s1.764.316 2.443.949s1.02 1.395 1.02 2.285s-.343 1.649-1.028 2.276s-1.497.94-2.435.94c-.949 0-1.767-.313-2.452-.94s-1.028-1.385-1.028-2.276M31 14H18v-3.976C18 8.957 19.08 7 20.147 7h8.052C29.264 7 31 8.957 31 10.024z" /></svg>
            }
            fetchData={getAgenciasIata}
            createData={postAgenciaIata}
            updateData={putAgenciaIata}
            deleteData={deleteAgenciasIata}
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
