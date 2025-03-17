import { useCallback } from "react";
import { FaTools } from 'react-icons/fa';

export const useBreadcrumbRoutes = (nombre: string, icono: JSX.Element) => {
    // Crear la ruta de navegación correcta sin duplicados
    const getRoutes = useCallback(() => {
        // Definición de rutas básicas
        const baseRoutes = [
            { name: "App", path: "/sistema" },
            { name: "Dashboard", path: "/sistema/dashboard" },
            { name: "Módulos", path: "/sistema/dashboard/modulos" },
            {
                name: "Mantenimiento",
                path: "/sistema/dashboard/modulos/mantenimiento",
                icon: <FaTools className="w-4 h-4" />
            }
        ];

        if (nombre.toLowerCase() !== "mantenimiento") {
            return [
                ...baseRoutes,
                { name: nombre, path: "", icon: icono }
            ];
        }

        return baseRoutes;
    }, [nombre, icono]);

    return getRoutes();
};