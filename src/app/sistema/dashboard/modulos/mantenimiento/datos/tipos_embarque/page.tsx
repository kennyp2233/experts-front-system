'use client';
import PaginaDatos from "../utils/paginaDatos";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

import MantenimientoRoute from "../utils/mantenimientoRoute";
import ReturnButton from "@/app/sistema/components/returnButton";
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
    const [error, setError] = useState<String | null>(null);
    const router = useRouter();
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



    const [fetchTrigger, setFetchTrigger] = useState(0);

    useEffect(() => {
        let isMounted = true; // Para evitar actualizaciones en componentes desmontados
        let timeoutId;

        // Función asíncrona para obtener datos
        const fetchData = async () => {
            try {
                const [cargaData, embalajeData] = await Promise.all([
                    getCatalogosEmbarqueCarga(),
                    getCatalogosEmbarqueEmbalaje()
                ]);

                if (isMounted) {
                    setTipoCarga(cargaData);
                    setTipoEmbalaje(embalajeData);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error al cargar los catálogos:", err);
                    setError("Hubo un problema al cargar los datos. Por favor, intenta nuevamente.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        // Configurar el temporizador de 5 segundos
        timeoutId = setTimeout(() => {
            if (isMounted && loading) {
                setLoading(false);
                setError("La carga de datos está tardando más de lo esperado. Por favor, intenta nuevamente.");
            }
        }, 5000); // 5000 milisegundos = 5 segundos

        // Limpieza al desmontar el componente
        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [fetchTrigger]); // Añade fetchTrigger como dependencia para reintentar


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
            <div className="flex flex-col p-4 gap-4 w-full h-full">
                <div className="skeleton w-full h-1/3"></div>
                <div className="skeleton w-full h-full"></div>
            </div>
        );
    }

    if (formFields.length === 0) {
        return (
            <div className="flex flex-col p-4 gap-4 w-full h-full">
                <MantenimientoRoute
                    icon={iconoPagina}
                    titulo={nombrePagina}
                />
                <ReturnButton
                    className=""
                    onClick={() => router.back()}
                    text="Regresar"
                />
                <div className="text-center text-error">Hubo un problema al cargar los datos. Por favor, intenta nuevamente.</div>
            </div>
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