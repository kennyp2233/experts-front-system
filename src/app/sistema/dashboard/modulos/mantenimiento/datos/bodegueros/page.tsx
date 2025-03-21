'use client';

import PaginaGenerica from "@/components/sistema/datos_components/PaginaGenerica";

import { getBodegueros, deleteBodegueros, postBodeguero, putBodeguero } from "@/api/mantenimiento/bodegueros.api";
export default function AerolineasPage() {
    return (
        <PaginaGenerica
            nombrePagina="Bodegueros"
            iconoPagina={
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M22 19V8.35c0-.82-.5-1.55-1.26-1.86l-8-3.2c-.48-.19-1.01-.19-1.49 0l-8 3.2C2.5 6.8 2 7.54 2 8.35V19c0 1.1.9 2 2 2h3v-9h10v9h3c1.1 0 2-.9 2-2m-11 0H9v2h2zm2-3h-2v2h2zm2 3h-2v2h2z"></path></svg>
            }
            fetchData={getBodegueros}
            createData={postBodeguero}
            updateData={putBodeguero}
            deleteData={deleteBodegueros}
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
