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
