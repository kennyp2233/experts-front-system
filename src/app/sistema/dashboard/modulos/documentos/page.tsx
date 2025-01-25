'use client';
import BotonesMenu from "@/components/sistema/BotonesMenu";
import ReturnButton from "@/components/sistema/returnButton";
import { useRouter } from "next/navigation";
import React from "react";
import { FiLink } from 'react-icons/fi';
import DocumentosRoute from "@/components/sistema/documentos_components/ChildDocumentosRoute";
import { FaNetworkWired } from "react-icons/fa";

export default function MantenimientoInit() {
    const router = useRouter();

    return (
        <>
            <DocumentosRoute
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M298.39 248a4 4 0 0 0 2.86-6.8l-78.4-79.72a4 4 0 0 0-6.85 2.81V236a12 12 0 0 0 12 12Z"></path><path fill="currentColor" d="M197 267a43.67 43.67 0 0 1-13-31v-92h-72a64.19 64.19 0 0 0-64 64v224a64 64 0 0 0 64 64h144a64 64 0 0 0 64-64V280h-92a43.61 43.61 0 0 1-31-13m175-147h70.39a4 4 0 0 0 2.86-6.8l-78.4-79.72a4 4 0 0 0-6.85 2.81V108a12 12 0 0 0 12 12"></path><path fill="currentColor" d="M372 152a44.34 44.34 0 0 1-44-44V16H220a60.07 60.07 0 0 0-60 60v36h42.12A40.81 40.81 0 0 1 231 124.14l109.16 111a41.11 41.11 0 0 1 11.83 29V400h53.05c32.51 0 58.95-26.92 58.95-60V152Z"></path></svg>
                }
                titulo="Documentos"
                desde="sistema"
            />

            <h1 className="text-3xl font-bold self-start pt-8 max-sm:text-xl ">Documentos</h1>
            <h2 className="text-xl self-start max-sm:text-lg">Operaciones Básicas</h2>
            <div className="grid grid-cols-3 w-full gap-3 max-md:grid-cols-2 max-sm:grid-cols-1 ">



                <BotonesMenu
                    titulo="Creación y Administración de Guías"
                    icono={
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M1.75 10v4c0 2.829 0 4.243.879 5.122c.217.217.467.38.763.504a8.48 8.48 0 0 1-.019-.134c-.123-.918-.123-2.063-.123-3.393V7.902c0-1.33 0-2.476.123-3.393l.02-.134a2.309 2.309 0 0 0-.764.504C1.75 5.758 1.75 7.172 1.75 10m20 0v4c0 2.829 0 4.243-.879 5.122c-.217.217-.467.38-.763.504l.019-.134c.123-.918.123-2.063.123-3.393V7.902c0-1.33 0-2.476-.123-3.393a8.452 8.452 0 0 0-.02-.134c.297.123.547.287.764.504c.879.879.879 2.293.879 5.121" /><path fill="currentColor" fillRule="evenodd" d="M5.629 2.879C4.75 3.757 4.75 5.172 4.75 8v8c0 2.828 0 4.243.879 5.121C6.507 22 7.922 22 10.75 22h2c2.828 0 4.243 0 5.121-.879c.879-.878.879-2.293.879-5.121V8c0-2.828 0-4.243-.879-5.121C16.993 2 15.578 2 12.75 2h-2c-2.828 0-4.243 0-5.121.879M8 17a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3A.75.75 0 0 1 8 17m.75-4.75a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5zM8 9a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6A.75.75 0 0 1 8 9" clipRule="evenodd" /></svg>
                    }
                    onClick={() => router.push('/sistema/dashboard/modulos/documentos/creacion_administracion_guias')}

                />

                <BotonesMenu
                    titulo="Centro de Coordinación de Guías"
                    icono={<FaNetworkWired/>}
                    onClick={() => router.push('/sistema/dashboard/modulos/documentos/centro_guias')}
                />
            </div>

        </>
    );
}