'use client';
import PaginaDatos from "../utils/paginaDatos";
import { useEffect, useState } from "react";

import { getConsignatarioJoinAll } from "@/api/mantenimiento/consignatario.api";
import { get } from "http";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const nombrePagina = "Consignatario";
    const iconoPagina = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 4a2 2 0 0 0-2 2v11h2a3 3 0 0 0 3 3a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2v-5l-3-4h-3V4m-7 2l4 4l-4 4v-3H4V9h6m7 .5h2.5l1.97 2.5H17M6 15.5A1.5 1.5 0 0 1 7.5 17A1.5 1.5 0 0 1 6 18.5A1.5 1.5 0 0 1 4.5 17A1.5 1.5 0 0 1 6 15.5m12 0a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5" /></svg>
    const modificationLabelId = { label: "ID Consignatario", key: "id_consignatario" };


    const [selectOptions, setSelectOptions] = useState([] as any[]);
    const [opcionesMultiplicador, setOpcionesMultiplicador] = useState([] as any[]);


    const [formFields, setFormFields] = useState([] as any[]);

    const visibleColumns = {
        nombre: "Nombre",
        ruc: "CI/RUC",
        direccion: "Direccion",
    } as any;

    const keys = Object.keys(visibleColumns).filter(key => visibleColumns[key]);

    useEffect(() => {


    }, []);

    useEffect(() => {
        if (

            true
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