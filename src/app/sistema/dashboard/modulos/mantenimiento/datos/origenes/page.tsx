'use client';

import { getOrigenesJoinPaisesAduanas, deleteOrigenes, postOrigen, putOrigen } from "@/api/mantenimiento/origenes.api";
import { getPaises } from "@/api/mantenimiento/paises.api";
import { getAduanas } from "@/api/mantenimiento/cae_aduanas.api";

import PaginaDatos from "../utils/paginaDatos";
import { useEffect, useState } from "react";
import { get } from "http";

interface Pais {
    id_pais: number;
    nombre: string;
}

interface Aduana {
    id_cae_aduana: number;
    nombre: string;
}

interface Origen {
    id_origen: number;
    codigo_origen: string;
    nombre: string;
    aeropuerto: string;
    id_pais: number;
    id_cae_aduana: number;
    paise: Pais;
    cae_aduana: Aduana;
}


export default function Page() {
    const [loading, setLoading] = useState(true);
    const nombrePagina = "Origenes";
    const iconoPagina = <svg className="inline-block" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14 11.5A2.5 2.5 0 0 0 16.5 9A2.5 2.5 0 0 0 14 6.5A2.5 2.5 0 0 0 11.5 9a2.5 2.5 0 0 0 2.5 2.5M14 2c3.86 0 7 3.13 7 7c0 5.25-7 13-7 13S7 14.25 7 9a7 7 0 0 1 7-7M5 9c0 4.5 5.08 10.66 6 11.81L10 22S3 14.25 3 9c0-3.17 2.11-5.85 5-6.71C6.16 3.94 5 6.33 5 9" /></svg>
    const modificationLabelId = { label: "ID Origen", key: "id_origen" };
    const [formFields, setFormFields] = useState([] as any[]);

    const [aduana, setAduana] = useState([]);
    const [paises, setPaises] = useState([]);

    const visibleColumns = {
        codigo_origen: "Codigo Origen",
        nombre: "Nombre",
        aeropuerto: "Aeropuerto",
        paise: "Pais",
        cae_aduana: "Cae Aduana",
    } as any;

    const keys = Object.keys(visibleColumns).filter(key => visibleColumns[key]);

    useEffect(() => {
        getPaises().then(data => {
            setPaises(data);
        });
        getAduanas().then(data => {
            setAduana(data);
        });
    }, []);

    useEffect(() => {
        if (paises.length > 0 && aduana.length > 0) {

            setFormFields([
                { label: visibleColumns[keys[0]], key: keys[0], example: 'EC', type: 'text' },
                { label: visibleColumns[keys[1]], key: keys[1], example: 'Ecuador', type: 'text' },
                { label: visibleColumns[keys[2]], key: keys[2], example: 'Aeropuerto', type: 'text' },
                { label: visibleColumns[keys[3]], key: keys[3], options: paises, type: 'select' },
                { label: visibleColumns[keys[4]], key: keys[4], options: aduana, type: 'select' },
            ])
            setLoading(false);  
        }
    }, [paises, aduana]);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        timer = setTimeout(() => {
            setLoading(false);
        }, 100);
        return () => clearTimeout(timer);
    }, []);


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
                    fetchData={getOrigenesJoinPaisesAduanas}
                    createData={postOrigen}
                    updateData={putOrigen}
                    deleteData={deleteOrigenes}
                    formFields={formFields}
                    modificationLabelId={modificationLabelId}
                    visibleColumns={visibleColumns}
                />
            }
        </>
    );

}