'use client';
import { deleteAerolineas, getAerolineasJoinAll, postAerolinea, putAerolinea, getAerolineas } from "@/api/mantenimiento/aerolineas.api";
import { getDestinos } from "@/api/mantenimiento/destinos.api";
import { getOrigenes } from "@/api/mantenimiento/origenes.api";

import PaginaDatos from "../utils/paginaDatos";
import { useEffect, useState } from "react";

interface Origen {
    id_origen: number;
    codigo_origen: string;
    nombre: string;
    aeropuerto: string;
    id_pais: number;
    id_cae_aduana: number;
}

interface Destino {
    id_destino: number;
    codigo_destino: string;
    nombre: string;
    aeropuerto?: string;
    id_pais: number;
    sesa_id?: string;
    leyenda_fito?: string;
    cobro_fitos: boolean;
}

interface Plantilla {
    id_aerolinea: number;
    costo_guia_abrv?: string;
    combustible_abrv?: string;
    seguridad_abrv?: string;
    aux_calculo_abrv?: string;
    iva_abrv?: string;
    otros_abrv?: string;
    aux1_abrv?: string;
    aux2_abrv?: string;
    costo_guia_valor?: number;
    combustible_valor?: number;
    seguroidad_valor?: number;
    aux_calculo_valor?: number;
    otros_valor?: number;
    aux1_valor?: number;
    aux2_valor?: number;
    plantilla_guia_madre?: string;
    plantilla_formato_aerolinea?: string;
    plantilla_reservas?: string;
    tarifa_rate?: number;
    pca?: number;
    combustible_mult?: number;
    seguridad_mult?: number;
    aux_calc_mult?: number;
}

interface Aerolinea {
    id_aerolinea: number;
    nombre?: string;
    ci_ruc?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    ciudad?: string;
    pais?: string;
    contacto?: string;
    modo?: string;
    maestra_guias_hijas?: boolean;
    codigo?: string;
    prefijo_awb?: string;
    codigo_cae?: string;
    estado_activo?: boolean;
    from1?: number;
    to1?: number;
    by1?: number;
    to2?: number;
    by2?: number;
    to3?: number;
    by3?: number;
    afiliado_cass: boolean;
    guias_virtuales: boolean;
    origen1?: Origen;
    destino1?: Destino;
    via1?: Aerolinea;
    destino2?: Destino;
    via2?: Aerolinea;
    destino3?: Destino;
    via3?: Aerolinea;
    plantilla: Plantilla;
}

export default function Page() {
    const [loading, setLoading] = useState(true);
    const nombrePagina = "Aerolineas";
    const iconoPagina = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M19.71 2.837c.733.147 1.306.72 1.453 1.453a3.557 3.557 0 0 1-.773 2.995l-2.751 3.252l1.944 7.131a1.25 1.25 0 0 1-.322 1.213l-1.302 1.302a1.01 1.01 0 0 1-1.597-.224l-2.993-5.387l-3.258 2.255v.787c0 .331-.132.65-.366.884L8.062 20.18a1.01 1.01 0 0 1-1.673-.395l-.544-1.631l-1.631-.544a1.01 1.01 0 0 1-.395-1.673l1.683-1.683a1.25 1.25 0 0 1 .884-.366h.787l2.255-3.258l-5.387-2.993a1.01 1.01 0 0 1-.224-1.597l1.302-1.302a1.25 1.25 0 0 1 1.213-.322l7.13 1.944l3.253-2.751a3.557 3.557 0 0 1 2.995-.773Z"></path></g></svg>
    const modificationLabelId = { label: "ID Aerolinea", key: "id_aerolinea" };

    const [origenes, setOrigenes] = useState([] as Origen[]);
    const [destinos, setDestinos] = useState([] as Destino[]);
    const [aerolineas, setAerolineas] = useState([] as Aerolinea[]);

    const [formFields, setFormFields] = useState([] as any[]);
    const [selectOptions, setSelectOptions] = useState([
        { id_option: 1, nombre: 'EN PIEZAS' },
        { id_option: 2, nombre: 'EN FULLS' }
    ] as any[]);
    const [opcionesMultiplicador, setOpcionesMultiplicador] = useState([
        { id_opcion: 0, nombre: "Gross Weight" },
        { id_opcion: 1, nombre: "Chargeable Weight" }
    ] as any[]);

    const visibleColumns = {
        nombre: "Nombre", //0
        ci_ruc: "CI/RUC", //1
        direccion: "Direccion", //2
        telefono: "Telefono", //3
        email: "Email", //4
        ciudad: "Ciudad", //5
        pais: "Pais", //7
        contacto: "Contacto", //7
        modo: "Modo", //8
        maestra_guias_hijas: "Maestra guias hijas", //9
        codigo: "Codigo", //10
        prefijo_awb: "Prefijo AWB", //11
        codigo_cae: "Codigo CAE", //12
        estado_activo: "Estado activo", //13
        afiliado_cass: "Afiliado CASS", //14
        guias_virtuales: "Guias virtuales", //15
        origen1: "Origen", //17
        destino1: "Destino", //18
        via1: "Via", //19
        destino2: "Destino", //20
        via2: "Via", //21
        destino3: "Destino", //22
        via3: "Via", //23
        plantilla: "Plantilla", //24
    } as any;

    const keys = Object.keys(visibleColumns).filter(key => visibleColumns[key]);

    useEffect(() => {
        getOrigenes().then((data) => {
            console.log(data);
            setOrigenes(data);
        });

        getDestinos().then((data) => {
            console.log(data);
            setDestinos(data);
        });

        getAerolineas().then((data) => {
            console.log(data);
            setAerolineas(data as any);
        });

    }, []);

    useEffect(() => {
        if (origenes?.length > 0 && destinos?.length > 0 && aerolineas?.length > 0) {
            setFormFields([
                { division: true, label: 'General' },
                { label: visibleColumns[keys[0]], key: keys[0], example: 'KLM', type: 'text' },
                { label: visibleColumns[keys[1]], key: keys[1], example: '1234567890', type: 'text' },
                { label: visibleColumns[keys[2]], key: keys[2], example: 'Calle 123', type: 'text' },
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
                { label: "Combustible Mult", key: "combustible_mult", type: 'select', options: opcionesMultiplicador },
                { label: "Seguridad Mult", key: "seguridad_mult", type: 'select', options: opcionesMultiplicador },
                { label: "Aux. Calculo Mult", key: "aux_calc_mult", type: 'select', options: opcionesMultiplicador },

                { division: true, label: 'Plantillas' },
                { label: "Plantilla Guia Madre", key: "plantilla_guia_madre", example: 'XXXX000', type: 'text' },
                { label: "Plantilla Formato Aerolinea", key: "plantilla_formato_aerolinea", example: 'XXXX000', type: 'text' },
                { label: "Plantilla Reservas", key: "plantilla_reservas", example: 'XXXX000', type: 'text' },


                { division: true, label: 'Info Adicional' },
                { label: visibleColumns[keys[14]], key: keys[1], type: 'checkbox' },
                { label: visibleColumns[keys[15]], key: keys[2], type: 'checkbox' },
                { division: true, label: 'Ruta' },
                { label: visibleColumns[keys[16]], key: keys[3], type: 'select', options: origenes },
                { label: visibleColumns[keys[17]], key: keys[4], type: 'select', options: destinos },
                { label: visibleColumns[keys[18]], key: keys[5], type: 'select', options: aerolineas },
                { label: visibleColumns[keys[19]], key: keys[6], type: 'select', options: destinos },
                { label: visibleColumns[keys[20]], key: keys[7], type: 'select', options: aerolineas },
                { label: visibleColumns[keys[21]], key: keys[8], type: 'select', options: destinos },
                { label: visibleColumns[keys[22]], key: keys[9], type: 'select', options: aerolineas },
            ])
            setLoading(false);
        }
    }, [origenes, destinos, aerolineas]);

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
                    createData={postAerolinea}
                    updateData={putAerolinea}
                    deleteData={deleteAerolineas}
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