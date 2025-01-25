'use client';

import PaginaGenerica from "@/components/sistema/datos_components/PaginaGenerica";
import { getSubAgencias, deleteSubAgencias, postSubAgencia, putSubAgencia } from "@/api/mantenimiento/subagencias.api";
export default function AerolineasPage() {
    return (
        <PaginaGenerica
            nombrePagina="Sub Agencias"
            iconoPagina={
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M12 3a3 3 0 0 0-1 5.83V11H8a3 3 0 0 0-3 3v1.17a3.001 3.001 0 1 0 2 0V14a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1.17a3.001 3.001 0 1 0 2 0V14a3 3 0 0 0-3-3h-3V8.83A3.001 3.001 0 0 0 12 3" /></g></svg>
            }
            fetchData={getSubAgencias}
            createData={postSubAgencia}
            updateData={putSubAgencia}
            deleteData={deleteSubAgencias}
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
                { label: "Estado", key: "estado_agencia_iata", type: "checkbox" },

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
