import React from "react";
import BaseRoute from "../BaseRoute";
import { useRouter } from "next/navigation";

interface DocumentosRouteProps {
    icon: JSX.Element;
    titulo: string;
    desde?: "sistema" | "dashboard" | "modulos"; // Define desde dónde empiezas
}

export default function DocumentosRoute({ icon, titulo, desde = "modulos" }: DocumentosRouteProps) {
    const router = useRouter();

    // Definimos las rutas base de acuerdo a dónde queremos empezar
    const rutasBase = {
        sistema: { name: "App", path: "/sistema" },
        dashboard: { name: "Dashboard", path: "/sistema/dashboard" },
        modulos: { name: "Modulos", path: "/sistema/dashboard/modulos" },
    };

    // Definir las rutas desde el nivel que se haya especificado
    const rutas = [];

    // Si se empieza desde "sistema", incluir todas las rutas
    if (desde === "sistema") {
        rutas.push(rutasBase.sistema);
        rutas.push(rutasBase.dashboard);
        rutas.push(rutasBase.modulos);
    }

    // Si se empieza desde "dashboard", omitir la primera ruta
    if (desde === "dashboard") {
        rutas.push(rutasBase.dashboard);
        rutas.push(rutasBase.modulos);
    }

    // Si se empieza desde "modulos", solo mostrar desde modulos
    if (desde === "modulos") {
        rutas.push(rutasBase.modulos);
    }

    // Finalmente, añadimos el nivel actual (titulo e ícono que se pasó como prop)
    rutas.push({
        name: "Documentos",
        path: "/sistema/dashboard/modulos/documentos", // No necesita un path, ya que estamos en el nivel actual
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M298.39 248a4 4 0 0 0 2.86-6.8l-78.4-79.72a4 4 0 0 0-6.85 2.81V236a12 12 0 0 0 12 12Z"></path><path fill="currentColor" d="M197 267a43.67 43.67 0 0 1-13-31v-92h-72a64.19 64.19 0 0 0-64 64v224a64 64 0 0 0 64 64h144a64 64 0 0 0 64-64V280h-92a43.61 43.61 0 0 1-31-13m175-147h70.39a4 4 0 0 0 2.86-6.8l-78.4-79.72a4 4 0 0 0-6.85 2.81V108a12 12 0 0 0 12 12"></path><path fill="currentColor" d="M372 152a44.34 44.34 0 0 1-44-44V16H220a60.07 60.07 0 0 0-60 60v36h42.12A40.81 40.81 0 0 1 231 124.14l109.16 111a41.11 41.11 0 0 1 11.83 29V400h53.05c32.51 0 58.95-26.92 58.95-60V152Z"></path></svg>

    });



    // Finalmente, añadimos el nivel actual (titulo e ícono que se pasó como prop)
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
