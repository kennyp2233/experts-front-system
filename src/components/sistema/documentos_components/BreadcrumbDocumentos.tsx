import React from "react";
import { useRouter } from "next/navigation";
import BaseRoute from "../BaseRoute";

interface BreadcrumbDocumentosProps {
    icon: JSX.Element;
    titulo: string;
    desde?: "sistema" | "dashboard" | "modulos" | "documentos";
}

export default function BreadcrumbDocumentos({
    icon,
    titulo,
    desde = "documentos"
}: BreadcrumbDocumentosProps) {
    const router = useRouter();

    // Definimos las rutas base
    const rutasBase = {
        sistema: { name: "App", path: "/sistema" },
        dashboard: { name: "Dashboard", path: "/sistema/dashboard" },
        modulos: { name: "Módulos", path: "/sistema/dashboard/modulos" },
        documentos: { name: "Documentos", path: "/sistema/dashboard/modulos/documentos" },
    };

    // Definir las rutas desde el nivel que se haya especificado
    const rutas = [];

    // Si se empieza desde "sistema", incluir todas las rutas
    if (desde === "sistema") {
        rutas.push(rutasBase.sistema);
        rutas.push(rutasBase.dashboard);
        rutas.push(rutasBase.modulos);
        rutas.push(rutasBase.documentos);
    }

    // Si se empieza desde "dashboard", omitir la primera ruta
    if (desde === "dashboard") {
        rutas.push(rutasBase.dashboard);
        rutas.push(rutasBase.modulos);
        rutas.push(rutasBase.documentos);
    }

    // Si se empieza desde "modulos", solo mostrar desde modulos y documentos
    if (desde === "modulos") {
        rutas.push(rutasBase.modulos);
        rutas.push(rutasBase.documentos);
    }

    // Si se empieza desde "documentos", solo mostrar documentos
    if (desde === "documentos") {
        rutas.push(rutasBase.documentos);
    }

    // Añadimos el nivel actual (titulo e ícono que se pasó como prop)
    rutas.push({
        name: titulo,
        path: "", // No necesita un path, ya que estamos en el nivel actual
        icon,
    });

    return (
        <>
            {/* Usamos el componente BaseRoute */}
            <BaseRoute routes={rutas} />
        </>
    );
}