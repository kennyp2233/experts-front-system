'use client';

import PaginaGenerica from "@/components/sistema/datos_components/PaginaGenerica";

import { aerolineasService } from "@/api/services/mantenimiento/aerolineasService";
import { destinosService } from "@/api/services/mantenimiento/destinosSevice";
import { origenesService } from "@/api/services/mantenimiento/origenesService";
import { getCatalogosAerolineasModo, getCatalogosAerolineasMult } from "@/api/mantenimiento/catalogos/catalogos_aerolineas.api";

import { MdOutlineAirplanemodeActive } from "react-icons/md";
export default function AerolineasPage() {
    return (
        <PaginaGenerica
            nombrePagina="Aerolineas"
            iconoPagina={
                <MdOutlineAirplanemodeActive />
            }
            fetchData={aerolineasService.getAerolineasJoinAll.bind(aerolineasService)}
            createData={aerolineasService.createAerolineaJoinAll.bind(aerolineasService)}
            updateData={aerolineasService.updateAerolineaJoinAll.bind(aerolineasService)}
            deleteData={aerolineasService.deleteAerolineasJoinAll.bind(aerolineasService)}
            catalogFetchers={[
                origenesService.getOrigenes.bind(origenesService),
                destinosService.getDestinos.bind(destinosService),
                aerolineasService.getAll.bind(aerolineasService),
                getCatalogosAerolineasModo,
                getCatalogosAerolineasMult]
            }
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
                { label: "Costo Guía", key: "costo_guia_valor", example: '0.0000', type: 'number', step: '0.0001' },
                { label: "Combustible", key: "combustible_valor", example: '0.0000', type: 'number', step: '0.0001' },
                { label: "Seguridad", key: "seguridad_valor", example: '0.0000', type: 'number', step: '0.0001' },
                { label: "Aux. Calculo", key: "aux_calculo_valor", example: '0.0000', type: 'number', step: '0.0001' },
                { label: "Otros", key: "otros_valor", example: '0.0000', type: 'number', step: '0.0001' },
                { label: "Aux1", key: "aux1_valor", example: '0.0000', type: 'number', step: '0.0001' },
                { label: "Aux2", key: "aux2_valor", example: '0.0000', type: 'number', step: '0.0001' },
                { label: "Tarifa Rate", key: "tarifa_rate", example: '0.00', type: 'number', step: '0.01' },
                { label: "PCA", key: "pca", example: '0.0000', type: 'number', step: '0.0001' },

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
