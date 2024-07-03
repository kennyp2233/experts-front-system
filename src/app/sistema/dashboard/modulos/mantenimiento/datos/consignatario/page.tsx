'use client';
import PaginaDatos from "../utils/paginaDatos";
import { useEffect, useState } from "react";

import { getConsignatarioJoinAll } from "@/api/mantenimiento/consignatario.api";
import { getClientes } from "@/api/mantenimiento/clientes.api";
import { getEmbarcadores } from "@/api/mantenimiento/embarcadores.api";
import { getDestinos } from "@/api/mantenimiento/destinos.api";
import { getCatalogosTipoDocumento } from "@/api/mantenimiento/catalogos/catalogos_tipo_documento.api";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const nombrePagina = "Consignatario";
    const iconoPagina = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 4a2 2 0 0 0-2 2v11h2a3 3 0 0 0 3 3a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2v-5l-3-4h-3V4m-7 2l4 4l-4 4v-3H4V9h6m7 .5h2.5l1.97 2.5H17M6 15.5A1.5 1.5 0 0 1 7.5 17A1.5 1.5 0 0 1 6 18.5A1.5 1.5 0 0 1 4.5 17A1.5 1.5 0 0 1 6 15.5m12 0a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5" /></svg>
    const modificationLabelId = { label: "ID Consignatario", key: "id_consignatario" };


    const [clientes, setClientes] = useState([] as any[]);
    const [embarcadores, setEmbarcadores] = useState([] as any[]);
    const [destinos, setDestinos] = useState([] as any[]);
    const [tipoDocumento, setTipoDocumento] = useState([] as any[]);

    const [formFields, setFormFields] = useState([] as any[]);

    const visibleColumns = {
        nombre: "Nombre",
        ruc: "CI/RUC",
        direccion: "Direccion",
        embarcador: "Embarcador",
        cliente: "Cliente",
    } as any;

    const keys = Object.keys(visibleColumns).filter(key => visibleColumns[key]);

    useEffect(() => {
        getClientes().then(data => {
            setClientes(data);
        });
        getEmbarcadores().then(data => {
            setEmbarcadores(data);
        });
        getDestinos().then(data => {
            setDestinos(data);
        });
        getCatalogosTipoDocumento().then(data => {
            setTipoDocumento(data);
        });

    }, []);

    useEffect(() => {
        if (
            clientes.length > 0 &&
            embarcadores.length > 0 &&
            destinos.length > 0
        ) {
            setFormFields([
                { division: true, label: 'General' },
                { label: "Nombre", key: "nombre", example: 'Nombre del consignatario', type: 'text' },
                { label: "CI/RUC", key: "ruc", example: 'CI o RUC del consignatario', type: 'text' },
                { loading: true, label: "Direccion", key: "direccion", example: 'Direccion del consignatario', type: 'text' },
                { label: "Embarcador", key: "embarcador", example: 'Embarcador del consignatario', type: 'select', options: embarcadores },
                { label: "Cliente", key: "cliente", example: 'Cliente del consignatario', type: 'select', options: clientes },
                { label: "Telefono", key: "telefono", example: 'Telefono del consignatario', type: 'text' },
                { label: "Email", key: "email", example: 'Email del consignatario', type: 'email' },
                { label: "Ciudad", key: "ciudad", example: 'Ciudad del consignatario', type: 'text' },
                { label: "Pais", key: "pais", example: 'Pais del consignatario', type: 'text' },

                { division: true, label: 'Guia Madre' },
                { label: "Consignee", key: "guia_m_consignee", example: 'Consignee del consignatario', type: 'text' },
                { label: "Consignee's Name and Address", key: "guia_m_name_address", example: 'Consignee\'s Name and Address del consignatario', type: 'textarea' },
                { label: "Notify", key: "guia_m_notify", example: 'Notify Party del consignatario', type: 'textarea' },
                { label: "Destino", key: "id_destino", example: 'Destino del consignatario', type: 'select', options: destinos },

                { division: true, label: 'Guia Hija' },
                { label: "Consignee", key: "guia_h_consignee", example: 'Consignee del consignatario', type: 'text' },
                { label: "Consignee's Name and Address", key: "guia_h_name_adress", example: 'Consignee\'s Name and Address del consignatario', type: 'textarea' },
                { label: "Notify", key: "guia_h_notify", example: 'Notify Party del consignatario', type: 'textarea' },

                { division: true, label: 'Fito y Forma A' },
                { label: "Declared Name and Adress of Consignee", key: "fito_declared_name", example: 'Declared Name and Adress of Consignee del consignatario', type: 'textarea' },
                { label: "Forma A", key: "fito_forma_a", example: 'Declared Name and Adress of Consignee del consignatario', type: 'textarea' },
                { label: "Forma A Nombre", key: "fito_nombre", example: 'Nombre del consignatario', type: 'text' },
                { label: "Forma A Direccion", key: "fito_direccion", example: 'Direccion del consignatario', type: 'text' },
                { label: "Forma A Pais", key: "fito_pais", example: 'Ciudad del consignatario', type: 'text' },


                { division: true, label: 'Transmición Consignee' },
                { label: "Nombre", key: "consignee_nombre", example: 'Nombre del consignatario', type: 'text' },
                { label: "Direccion", key: "consignee_direccion", example: 'Direccion del consignatario', type: 'text' },
                { label: "Ciudad", key: "consignee_ciudad", example: 'Ciudad del consignatario', type: 'text' },
                { label: "Provincia", key: "consignee_provincia", example: 'Provincia del consignatario', type: 'text' },
                { label: "Siglas Pais", key: "consignee_pais", example: 'Siglas Pais del consignatario', type: 'text' },
                { label: "EU EORI", key: "consignee_eueori", example: 'EU EORI del consignatario', type: 'text' },

                { division: true, label: 'Transmición Notify' },
                { label: "Nombre", key: "notify_nombre", example: 'Nombre del consignatario', type: 'text' },
                { label: "Direccion", key: "notify_direccion", example: 'Direccion del consignatario', type: 'text' },
                { label: "Ciudad", key: "notify_ciudad", example: 'Ciudad del consignatario', type: 'text' },
                { label: "Provincia", key: "notify_provincia", example: 'Provincia del consignatario', type: 'text' },
                { label: "Siglas Pais", key: "notify_pais", example: 'Siglas Pais del consignatario', type: 'text' },
                { label: "EU EORI", key: "notify_eueori", example: 'EU EORI del consignatario', type: 'text' },

                { division: true, label: 'Transmición HAWB Guias Hijas' },
                { label: "Nombre", key: "hawb_nombre", example: 'Nombre del consignatario', type: 'text' },
                { label: "Direccion", key: "hawb_direccion", example: 'Direccion del consignatario', type: 'text' },
                { label: "Ciudad", key: "hawb_ciudad", example: 'Ciudad del consignatario', type: 'text' },
                { label: "Provincia", key: "hawb_provincia", example: 'Provincia del consignatario', type: 'text' },
                { label: "Siglas Pais", key: "hawb_pais", example: 'Siglas Pais del consignatario', type: 'text' },
                { label: "EU EORI", key: "hawb_eueori", example: 'EU EORI del consignatario', type: 'text' },

                { division: true, label: 'CAE-SICE Consignee' },
                { label: "Nombre", key: "consignee_nombre", example: 'Nombre del consignatario', type: 'text' },
                { label: "Direccion", key: "consignee_direccion", example: 'Direccion del consignatario', type: 'text' },
                { label: "Tipo Documento", key: "consignee_tipo_documento", example: 'Tipo Documento del consignatario', type: 'select', options: tipoDocumento },

            ])
            setLoading(false);
        }
    }, [clientes, embarcadores]);

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
                    fetchData={getConsignatarioJoinAll}
                    createData={() => Promise.resolve()}
                    updateData={() => Promise.resolve()}
                    deleteData={() => Promise.resolve()}
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