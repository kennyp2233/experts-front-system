'use client';

import PaginaGenerica from "@/app/sistema/components/datos_components/PaginaGenerica";
import { deleteAerolineasJoinAll, getAerolineasJoinAll, putAerolineasJoinAll, postAerolineaJoinAll } from "@/api/mantenimiento/aerolineas.api";
import { getDestinos } from "@/api/mantenimiento/destinos.api";
import { getOrigenes } from "@/api/mantenimiento/origenes.api";
import { getCatalogosAerolineasModo, getCatalogosAerolineasMult } from "@/api/mantenimiento/catalogos/catalogos_aerolineas.api";

export default function AerolineasPage() {
    return (
        <PaginaGenerica
            nombrePagina="Aerolineas"
            iconoPagina={
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <g fill="none">
                        <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                        <path fill="currentColor" d="M19.71 2.837c.733.147 1.306.72 1.453 1.453a3.557 3.557 0 0 1-.773 2.995l-2.751 3.252l1.944 7.131a1.25 1.25 0 0 1-.322 1.213l-1.302 1.302a1.01 1.01 0 0 1-1.597-.224l-2.993-5.387l-3.258 2.255v.787c0 .331-.132.65-.366.884L8.062 20.18a1.01 1.01 0 0 1-1.673-.395l-.544-1.631l-1.631-.544a1.01 1.01 0 0 1-.395-1.673l1.683-1.683a1.25 1.25 0 0 1 .884-.366h.787l2.255-3.258l-5.387-2.993a1.01 1.01 0 0 1-.224-1.597l1.302-1.302a1.25 1.25 0 0 1 1.213-.322l7.13 1.944l3.253-2.751a3.557 3.557 0 0 1 2.995-.773Z"></path>
                    </g>
                </svg>
            }
            fetchData={getAerolineasJoinAll}
            createData={postAerolineaJoinAll}
            updateData={putAerolineasJoinAll}
            deleteData={deleteAerolineasJoinAll}
            catalogFetchers={[getOrigenes, getDestinos, getAerolineasJoinAll, getCatalogosAerolineasModo, getCatalogosAerolineasMult]}
            formFieldsConfig={(data) => [
                { division: true, label: 'General' },
                { label: "Nombre", key: "nombre", example: 'KLM', type: 'text' },
                { label: "CI/RUC", key: "ci_ruc", example: '1234567890', type: 'text' },
                { label: "Direccion", key: "direccion", example: 'Calle 123', type: 'textarea' },
                { label: "Telefono", key: "telefono", example: '0987654321', type: 'text' },
                { label: "Email", key: "email", example: 'email@email.com', type: 'email' },
                { label: "Ciudad", key: "ciudad", example: 'Quito', type: 'text' },
                { label: "Pais", key: "pais", example: 'Ecuador', type: 'text' },
                { label: "Contacto", key: "contacto", example: 'Juan Perez', type: 'text' },
                { label: "Modo", key: "modo", options: data[3], type: 'select' },
                { label: "Maestra guías hijas", key: "maestra_guias_hijas", type: 'checkbox' },
                { label: "Codigo", key: "codigo", example: 'QR', type: 'text' },
                { label: "Prefijo AWB", key: "prefijo_awb", example: '123', type: 'text' },
                { label: "Codigo CAE", key: "codigo_cae", example: '123', type: 'text' },
                { label: "Estado activo", key: "estado_activo", type: 'checkbox' },

                { division: true, label: 'Códigos' },
                { label: "Costo Guía", key: "costo_guia_abrv", example: 'XXX', type: 'text' },
                { label: "Combustible", key: "combustible_abrv", example: 'XXX', type: 'text' },
                { label: "Seguridad", key: "seguridad_abrv", example: 'XXX', type: 'text' },
                { label: "Aux. Calculo", key: "aux_calculo_abrv", example: 'XXX', type: 'text' },
                { label: "IVA", key: "iva_abrv", example: 'XXX', type: 'text' },
                { label: "Otros", key: "otros_abrv", example: 'XXX', type: 'text' },
                { label: "Aux1", key: "aux1_abrv", example: 'XXX', type: 'text' },
                { label: "Aux2", key: "aux2_abrv", example: 'XXX', type: 'text' },

                { division: true, label: 'Valores de Códigos' },
                { label: "Costo Guía", key: "costo_guia_valor", example: '0.0000', type: 'number' },
                { label: "Combustible", key: "combustible_valor", example: '0.0000', type: 'number' },
                { label: "Seguridad", key: "seguridad_valor", example: '0.0000', type: 'number' },
                { label: "Aux. Calculo", key: "aux_calculo_valor", example: '0.0000', type: 'number' },
                { label: "Otros", key: "otros_valor", example: '0.0000', type: 'number' },
                { label: "Aux1", key: "aux1_valor", example: '0.0000', type: 'number' },
                { label: "Aux2", key: "aux2_valor", example: '0.0000', type: 'number' },
                { label: "Tarifa Rate", key: "tarifa_rate", example: '0.00', type: 'number' },
                { label: "PCA", key: "pca", example: '0.0000', type: 'number' },

                { division: true, label: 'Multiplicador' },
                { label: "Combustible Mult", key: "multiplicador1", type: 'select', options: data[4] },
                { label: "Seguridad Mult", key: "multiplicador2", type: 'select', options: data[4] },
                { label: "Aux. Calculo Mult", key: "multiplicador3", type: 'select', options: data[4] },

                { division: true, label: 'Plantillas' },
                { label: "Plantilla Guía Madre", key: "plantilla_guia_madre", example: 'XXXX000', type: 'text' },
                { label: "Plantilla Formato Aerolínea", key: "plantilla_formato_aerolinea", example: 'XXXX000', type: 'text' },
                { label: "Plantilla Reservas", key: "plantilla_reservas", example: 'XXXX000', type: 'text' },

                { division: true, label: 'Info Adicional' },
                { label: "Afiliado CASS", key: "afiliado_cass", type: 'checkbox' },
                { label: "Guías Virtuales", key: "guias_virtuales", type: 'checkbox' },

                { division: true, label: 'Ruta' },
                { label: "Origen", key: "origen1", type: 'select', options: data[0] },
                { label: "Destino", key: "destino1", type: 'select', options: data[1] },
                { label: "Vía", key: "via1", type: 'select', options: data[2] },
                { label: "Destino 2", key: "destino2", type: 'select', options: data[1] },
                { label: "Vía 2", key: "via2", type: 'select', options: data[2] },
                { label: "Destino 3", key: "destino3", type: 'select', options: data[1] },
                { label: "Vía 3", key: "via3", type: 'select', options: data[2] },
            ]}
            visibleColumns={{
                nombre: "Nombre",
                ci_ruc: "CI/RUC",
                direccion: "Direccion",
                telefono: "Telefono",
                email: "Email",
                ciudad: "Ciudad",
                pais: "Pais",
                contacto: "Contacto",
                modo: "Modo",
                maestra_guias_hijas: "Maestra guias hijas",
                codigo: "Codigo",
                prefijo_awb: "Prefijo AWB",
                codigo_cae: "Codigo CAE",
                estado_activo: "Estado activo",
                afiliado_cass: "Afiliado CASS",
                guias_virtuales: "Guias virtuales",
                origen1: "Origen",
                destino1: "Destino",
                via1: "Via",
                destino2: "Destino",
                via2: "Via",
                destino3: "Destino",
                via3: "Via"
            }}
            modificationLabelId={{ label: "ID Aerolinea", key: "id_aerolinea" }}
            formClassName="grid-cols-3 max-lg:grid-cols-2" // Clases para el diseño del formulario
        />
    );
}
