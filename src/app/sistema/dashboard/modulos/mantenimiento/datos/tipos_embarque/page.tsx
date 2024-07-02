'use client';
import PaginaDatos from "../utils/paginaDatos";
import { use, useEffect, useState } from "react";

import {
    getTiposEmbarqueJoinAll,
    postTiposEmbarque,
    putTiposEmbarque,
    deleteTiposEmbarque
} from "@/api/mantenimiento/tipos_embarque.api";

import { getCatalogosEmbarqueCarga } from "@/api/mantenimiento/catalogos/catalogos_tipos_embarque.api";
import { getCatalogosEmbarqueEmbalaje } from "@/api/mantenimiento/catalogos/catalogos_tipos_embarque.api";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const nombrePagina = "Tipos De Embarque";
    const iconoPagina = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><defs><mask id="ipSTransport0"><g fill="none" strokeWidth="4"><rect width="28" height="18" x="16" y="12" fill="#fff" stroke="#fff" strokeLinejoin="round" rx="3" /><path stroke="#000" strokeLinecap="round" d="M24 18v6m12-6v6" /><path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M36 12V6H24v6m20 24H12a2 2 0 0 1-2-2V11a2 2 0 0 0-2-2H4" /><path fill="#fff" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M19 42a3 3 0 0 1-3-3v-3h6v3a3 3 0 0 1-3 3m18 0a3 3 0 0 1-3-3v-3h6v3a3 3 0 0 1-3 3" /></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSTransport0)" /></svg>
    const modificationLabelId = { label: "ID Embarque", key: "id_tipo_embarque" };
    const [formFields, setFormFields] = useState([] as any[]);
    const [tipoCarga, setTipoCarga] = useState([] as any[]);
    const [tipoEmbalaje, setTipoEmbalaje] = useState([] as any[]);

    const visibleColumns = {
        codigo_embarque: "Código",
        nombre: "Nombre",
        carga: "Tipo Carga",
        embalaje: "Tipo Embalaje",
        regimen: "Regimen",
        mercancia: "Mercancia",
        harmonised_comidity: "Harmonised Comidity Code",
    } as any;

    const keys = Object.keys(visibleColumns).filter(key => visibleColumns[key]);

    useEffect(() => {
        getCatalogosEmbarqueCarga().then((data) => {
            setTipoCarga(data);
        });

        getCatalogosEmbarqueEmbalaje().then((data) => {
            setTipoEmbalaje(data);
        });

    }, []);



    useEffect(() => {
        if (tipoCarga.length > 0 && tipoEmbalaje.length > 0) {
            setFormFields([
                { label: "Código", key: "codigo_embarque", required: true, type: "text", example: "Kilogramos" },
                { label: "Descripcion", key: "nombre", type: "textarea", example: "Nombre" },
                { label: "Tipo Carga", key: "carga", required: true, type: "select", options: tipoCarga },
                { label: "Tipo Embalaje", key: "embalaje", required: true, type: "select", options: tipoEmbalaje },
                { label: "Regimen", key: "regimen", type: "text", example: "Regimen" },
                { label: "Mercancia", key: "mercancia", type: "text", example: "Mercancia" },
                { label: "Harmonised Comidity Code", key: "harmonised_comidity", type: "text", example: "Harmonised Comidity Code" },
            ])
            setLoading(false);
        }

    }, [tipoCarga, tipoEmbalaje]);

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
                    fetchData={getTiposEmbarqueJoinAll}
                    createData={postTiposEmbarque}
                    updateData={putTiposEmbarque}
                    deleteData={deleteTiposEmbarque}
                    formFields={formFields}
                    modificationLabelId={modificationLabelId}
                    visibleColumns={visibleColumns}
                />
            }
        </>
    );

}