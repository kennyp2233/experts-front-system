'use client';

import PaginaGenerica from "@/components/sistema/datos_components/PaginaGenerica";

import { funcionariosAgrocalidadService } from "@/api/services/mantenimiento/funcionariosAgrocalidadService";
import { FaUserTie } from "react-icons/fa";
export default function AerolineasPage() {
    return (
        <PaginaGenerica
            nombrePagina="Funcionarios Agrocalidad"
            iconoPagina={
                <FaUserTie />
            }
            fetchData={funcionariosAgrocalidadService.getFuncionariosAgrocalidad.bind(funcionariosAgrocalidadService)}
            createData={funcionariosAgrocalidadService.postFuncionarioAgrocalidad.bind(funcionariosAgrocalidadService)}
            updateData={funcionariosAgrocalidadService.putFuncionarioAgrocalidad.bind(funcionariosAgrocalidadService)}
            deleteData={funcionariosAgrocalidadService.deleteFuncionariosAgrocalidad.bind(funcionariosAgrocalidadService)}
            formFieldsConfig={() => [
                { label: "Nombre", key: "nombre", example: 'PACIFIC CARGO', type: 'text' },
                { label: "Direccion", key: "direccion", example: 'Calle 123', type: 'textarea' },
                { label: "Telefono", key: "telefono", example: '0987654321', type: 'text' },
                { label: "Email", key: "email", example: '', type: 'email' },
                { label: "Estado", key: "estado", type: "checkbox" },

            ]}
            visibleColumns={{
                nombre: "Nombre",
                direccion: "Direccion",
            }}
            modificationLabelId={{ label: "ID Funcionario Agrocalidad", key: "id_funcionario_agrocalidad" }}
            formClassName="grid-cols-3 max-lg:grid-cols-2" // Clases para el diseño del formulario
        />
    );
}
