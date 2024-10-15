import React from "react";
import BaseRoute from "../../BaseRoute";
import { useRouter } from "next/navigation";

interface MantenimientoRouteProps {
    icon: JSX.Element;
    titulo: string;
    desde?: "sistema" | "dashboard" | "modulos"; // Define desde dónde empiezas
}

export default function MantenimientoRoute({ icon, titulo, desde = "modulos" }: MantenimientoRouteProps) {
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

    // Añadir la ruta específica del mantenimiento
    rutas.push({
        name: "Mantenimiento",
        path: "/sistema/dashboard/modulos/mantenimiento",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 19q.825 0 1.413-.587T20 17t-.587-1.412T18 15t-1.412.588T16 17t.588 1.413T18 19m-.2 3q-.35 0-.612-.225t-.338-.575l-.15-.7q-.3-.125-.562-.262T15.6 19.9l-.725.225q-.325.1-.637-.025t-.488-.4l-.2-.35q-.175-.3-.125-.65t.325-.575l.55-.475q-.05-.3-.05-.65t.05-.65l-.55-.475q-.275-.225-.325-.562t.125-.638l.225-.375q.175-.275.475-.4t.625-.025l.725.225q.275-.2.538-.337t.562-.263l.15-.725q.075-.35.337-.562T17.8 12h.4q.35 0 .613.225t.337.575l.15.7q.3.125.562.262t.538.338l.725-.225q.325-.1.638.025t.487.4l.2.35q.175.3.125.65t-.325.575l-.55.475q.05.3.05.65t-.05.65l.55.475q.275.225.325.563t-.125.637l-.225.375q-.175.275-.475.4t-.625.025L20.4 19.9q-.275.2-.537.337t-.563.263l-.15.725q-.075.35-.337.563T18.2 22zM4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h5.175q.4 0 .763.15t.637.425L12 6h8q.825 0 1.413.588T22 8v1.9q0 .45-.387.675t-.813.025q-.65-.3-1.375-.45t-1.45-.15q-2.95 0-4.962 2.063T11 16.975q0 .475.063.938t.187.912t-.125.813t-.675.362z" /></svg>),
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