'use client';
import PaginaDatos from "../utils/paginaDatos";

import { deleteAerolineasJoinAll, getAerolineasJoinAll, putAerolineasJoinAll, postAerolineaJoinAll } from "@/api/mantenimiento/aerolineas.api";
import { getDestinos } from "@/api/mantenimiento/destinos.api";
import { getOrigenes } from "@/api/mantenimiento/origenes.api";
import { getCatalogosAerolineasModo, getCatalogosAerolineasMult } from "@/api/mantenimiento/catalogos/catalogos_aerolineas.api";
import { useEffect, useState } from "react";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const nombrePagina = "Aerolineas";
    const iconoPagina = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M19.71 2.837c.733.147 1.306.72 1.453 1.453a3.557 3.557 0 0 1-.773 2.995l-2.751 3.252l1.944 7.131a1.25 1.25 0 0 1-.322 1.213l-1.302 1.302a1.01 1.01 0 0 1-1.597-.224l-2.993-5.387l-3.258 2.255v.787c0 .331-.132.65-.366.884L8.062 20.18a1.01 1.01 0 0 1-1.673-.395l-.544-1.631l-1.631-.544a1.01 1.01 0 0 1-.395-1.673l1.683-1.683a1.25 1.25 0 0 1 .884-.366h.787l2.255-3.258l-5.387-2.993a1.01 1.01 0 0 1-.224-1.597l1.302-1.302a1.25 1.25 0 0 1 1.213-.322l7.13 1.944l3.253-2.751a3.557 3.557 0 0 1 2.995-.773Z"></path></g></svg>
    const modificationLabelId = { label: "ID Aerolinea", key: "id_aerolinea" };


    const [selectOptions, setSelectOptions] = useState([] as any[]);
    const [opcionesMultiplicador, setOpcionesMultiplicador] = useState([] as any[]);


    const [formFields, setFormFields] = useState([] as any[]);

    const visibleColumns = {
        nombre: "Nombre", //0
        ci_ruc: "CI/RUC", //1
        direccion: "Direccion", //2
        telefono: "Telefono", //3
        email: "Email", //4
        ciudad: "Ciudad", //5
        pais: "Pais", //6
        contacto: "Contacto", //7
        modo: "Modo", //8
        maestra_guias_hijas: "Maestra guias hijas", //9
        codigo: "Codigo", //10
        prefijo_awb: "Prefijo AWB", //11
        codigo_cae: "Codigo CAE", //12
        estado_activo: "Estado activo", //13
        afiliado_cass: "Afiliado CASS", //14
        guias_virtuales: "Guias virtuales", //15
        origen1: "Origen", //16
        destino1: "Destino", //17
        via1: "Via", //18
        destino2: "Destino", //19
        via2: "Via", //20
        destino3: "Destino", //21
        via3: "Via", //22
        //plantilla: "Plantilla", //23
    } as any;

    const keys = Object.keys(visibleColumns).filter(key => visibleColumns[key]);

    useEffect(() => {


    }, []);

    useEffect(() => {
        if (

            selectOptions?.length > 0 &&
            opcionesMultiplicador?.length > 0
        ) {
            setFormFields([
                { division: true, label: 'General' },
                { label: visibleColumns[keys[0]], key: keys[0], example: 'KLM', type: 'text' },
                { label: visibleColumns[keys[1]], key: keys[1], example: '1234567890', type: 'text' },
                { label: visibleColumns[keys[2]], key: keys[2], example: 'Calle 123', type: 'textarea' },
                { label: visibleColumns[keys[3]], key: keys[3], example: '0987654321', type: 'text' },
                { label: visibleColumns[keys[4]], key: keys[4], example: 'email@email.com', type: 'text' },
                { label: visibleColumns[keys[5]], key: keys[5], example: 'Quito', type: 'text' },
                { label: visibleColumns[keys[6]], key: keys[6], example: 'Ecuador', type: 'text' },
                { label: visibleColumns[keys[7]], key: keys[7], example: 'Juan Perez', type: 'text' },
                { label: visibleColumns[keys[8]], key: keys[8], options: selectOptions, type: 'select' },
                { label: visibleColumns[keys[9]], key: keys[9], type: 'checkbox' },
                { label: visibleColumns[keys[10]], key: keys[10], example: 'QR', type: 'text' },
                { label: visibleColumns[keys[11]], key: keys[11], example: '123', type: 'text' },
                { label: visibleColumns[keys[12]], key: keys[12], example: '123', type: 'text' },
                { label: visibleColumns[keys[13]], key: keys[13], type: 'checkbox' },

                { division: true, label: 'Codigos' },
                { label: "Costo Guia", key: "costo_guia_abrv", example: 'XXX', type: 'text' },
                { label: "Combustible", key: "combustible_abrv", example: 'XXX', type: 'text' },
                { label: "Seguridad", key: "seguridad_abrv", example: 'XXX', type: 'text' },
                { label: "Aux. Calculo", key: "aux_calculo_abrv", example: 'XXX', type: 'text' },
                { label: "IVA", key: "iva_abrv", example: 'XXX', type: 'text' },
                { label: "Otros", key: "otros_abrv", example: 'XXX', type: 'text' },
                { label: "Aux1", key: "aux1_abrv", example: 'XXX', type: 'text' },
                { label: "Aux2", key: "aux2_abrv", example: 'XXX', type: 'text' },
                { division: true, label: 'Valores codigos' },
                { label: "Costo Guia", key: "costo_guia_valor", example: '0.0000', type: 'number' },
                { label: "Combustible", key: "combustible_valor", example: '0.0000', type: 'number' },
                { label: "Seguridad", key: "seguridad_valor", example: '0.0000', type: 'number' },
                { label: "Aux. Calculo", key: "aux_calculo_valor", example: '0.0000', type: 'number' },
                { label: "Otros", key: "otros_valor", example: '0.0000', type: 'number' },
                { label: "Aux1", key: "aux1_valor", example: '0.0000', type: 'number' },
                { label: "Aux2", key: "aux2_valor", example: '0.0000', type: 'number' },
                { label: "Tarifa Rate", key: "tarifa_rate", example: '0.00', type: 'number' },
                { label: "PCA", key: "pca", example: '0.0000', type: 'number' },

                { division: true, label: 'Multiplicador' },
                { label: "Combustible Mult", key: "multiplicador1", type: 'select', options: opcionesMultiplicador },
                { label: "Seguridad Mult", key: "multiplicador2", type: 'select', options: opcionesMultiplicador },
                { label: "Aux. Calculo Mult", key: "multiplicador3", type: 'select', options: opcionesMultiplicador },

                { division: true, label: 'Plantillas' },
                { label: "Plantilla Guia Madre", key: "plantilla_guia_madre", example: 'XXXX000', type: 'text' },
                { label: "Plantilla Formato Aerolinea", key: "plantilla_formato_aerolinea", example: 'XXXX000', type: 'text' },
                { label: "Plantilla Reservas", key: "plantilla_reservas", example: 'XXXX000', type: 'text' },


                { division: true, label: 'Info Adicional' },
                { label: visibleColumns[keys[14]], key: keys[14], type: 'checkbox' },
                { label: visibleColumns[keys[15]], key: keys[15], type: 'checkbox' },
                { division: true, label: 'Ruta' },
            ])
            setLoading(false);
        }
    }, [selectOptions, opcionesMultiplicador]);

    if (loading) {
        return (
            <>
                <div className="hero min-h-screen bg-base-200">
                    <div className="hero-content text-center">
                        <div className="max-w-md">
                            <span className="loading loading-ball loading-lg"></span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {formFields.length > 0 &&
                <PaginaDatos
                    nombre={nombrePagina}
                    icono={iconoPagina}
                    fetchData={getAerolineasJoinAll}
                    createData={postAerolineaJoinAll}
                    updateData={putAerolineasJoinAll}
                    deleteData={deleteAerolineasJoinAll}
                    formFields={formFields}
                    modificationLabelId={modificationLabelId}
                    visibleColumns={visibleColumns}
                    formularioSegments={true}
                    formClassName="grid-cols-3 max-lg:grid-cols-2"
                />
            }
        </>
    );
}