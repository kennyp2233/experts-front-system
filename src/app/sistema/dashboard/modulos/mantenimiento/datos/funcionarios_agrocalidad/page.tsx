'use client';

import PaginaGenerica from "@/app/sistema/components/datos_components/PaginaGenerica";
import { getFuncionarioAgrocalidad, putFuncionarioAgrocalidad, postFuncionarioAgrocalidad, deleteFuncionariosAgrocalidad } from "@/api/mantenimiento/funcionarios_agrocalidad.api";
import { get } from "http";
export default function AerolineasPage() {
    return (
        <PaginaGenerica
            nombrePagina="Funcionarios Agrocalidad"
            iconoPagina={
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M13.5 10.097C13.5 7.774 24 6 24 6s10.5 1.774 10.5 4.097c0 3.097-1.91 4.403-1.91 4.403H15.41s-1.91-1.306-1.91-4.403m12.5-.53s-1.467-.534-2-1.067c-.533.533-2 1.067-2 1.067s.4 2.933 2 2.933s2-2.933 2-2.933m5.814 8.713c1.39-1.085 1.174-2.28 1.174-2.28H15.012s-.217 1.195 1.174 2.28a8 8 0 1 0 15.629 0M24 20c2.721 0 4.624-.314 5.952-.766a6 6 0 1 1-11.903 0c1.328.452 3.23.766 5.951.766"></path><path d="m16.879 28l6.477 5.457a1 1 0 0 0 1.288 0L31.121 28S42 31.393 42 35.467V42H6v-6.533C6 31.393 16.879 28 16.879 28m-4.154 9.207a1 1 0 0 1-.725-.961V35h7v1.246a1 1 0 0 1-.725.961l-2.5.715a1 1 0 0 1-.55 0zm20.94-4.082a.17.17 0 0 0-.33 0l-.471 1.52a.174.174 0 0 1-.165.126h-1.526c-.167 0-.237.225-.101.328l1.234.94c.06.046.086.128.063.202l-.471 1.52c-.052.168.13.307.266.204l1.234-.94a.166.166 0 0 1 .204 0l1.234.94c.136.103.318-.036.267-.203l-.472-1.52a.186.186 0 0 1 .063-.203l1.234-.94c.136-.103.066-.328-.101-.328H34.3a.174.174 0 0 1-.165-.125z"></path></g></svg>
            }
            fetchData={getFuncionarioAgrocalidad}
            createData={postFuncionarioAgrocalidad}
            updateData={putFuncionarioAgrocalidad}
            deleteData={deleteFuncionariosAgrocalidad}
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
