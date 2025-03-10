'use client';
import BotonesMenu from "@/components/sistema/BotonesMenu";
import { useRouter } from "next/navigation";
import React from "react";
import { Breadcrumb } from "@/components/sistema/breadcrumbs/Breadcrumb";
import { useBreadcrumbPaths } from "@/components/sistema/breadcrumbs/useBreadcrumbPaths";

// Importamos los iconos desde react-icons
import {
    HiOutlineDocumentText,
    HiOutlineDocumentDuplicate
} from "react-icons/hi";
import {
    FaNetworkWired,
} from "react-icons/fa";


export default function DocumentosPage() {
    const router = useRouter();
    const { getDocumentPath } = useBreadcrumbPaths();

    // Rutas principales
    const routes = {
        guias: '/sistema/dashboard/modulos/documentos/creacion_administracion_guias',
        centroGuias: '/sistema/dashboard/modulos/documentos/centro_guias',
        reportes: '/sistema/dashboard/modulos/documentos/reportes',
        estadisticas: '/sistema/dashboard/modulos/documentos/estadisticas'
    };

    // Generar ruta para breadcrumb
    const breadcrumbItems = getDocumentPath("Documentos", <HiOutlineDocumentText className="w-4 h-4" />);

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            <h1 className="text-3xl font-bold self-start pt-8 max-sm:text-xl">Documentos</h1>
            <h2 className="text-xl self-start max-sm:text-lg">Operaciones Básicas</h2>
            <div className="grid grid-cols-3 w-full gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">

                <BotonesMenu
                    titulo="Creación y Administración de Guías"
                    icon={HiOutlineDocumentDuplicate}
                    onClick={() => router.push(routes.guias)}
                    description="Gestión de documentos base y guías para envíos"
                />

                <BotonesMenu
                    titulo="Centro de Coordinación de Guías"
                    icon={FaNetworkWired}
                    onClick={() => router.push(routes.centroGuias)}
                    description="Coordinación de documentos con clientes y fincas"
                />

            </div>
        </>
    );
}