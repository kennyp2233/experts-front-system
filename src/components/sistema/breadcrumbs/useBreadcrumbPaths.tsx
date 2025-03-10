// src/components/sistema/breadcrumbs/
// Hook para crear rutas de breadcrumb comunes
import { BreadcrumbItem } from "./Breadcrumb";
import { AppIcons } from "@/utils/icons";

export const useBreadcrumbPaths = () => {
    // Definición de rutas base comunes
    const basePaths: Record<string, BreadcrumbItem> = {
        home: {
            name: "App",
            path: "/sistema",
            icon: <AppIcons.Home className="w-4 h-4 stroke-current" />
        },
        dashboard: {
            name: "Dashboard",
            path: "/sistema/dashboard",
            icon: <AppIcons.Dashboard className="w-4 h-4 stroke-current" />
        },
        modules: {
            name: "Módulos",
            path: "/sistema/dashboard/modulos",
            icon: <AppIcons.ClipboardList className="w-4 h-4 stroke-current" />
        },
        maintenance: {
            name: "Mantenimiento",
            path: "/sistema/dashboard/modulos/mantenimiento",
            icon: <AppIcons.Settings className="w-4 h-4 stroke-current" />
        },
        documents: {
            name: "Documentos",
            path: "/sistema/dashboard/modulos/documentos",
            icon: <AppIcons.Document className="w-4 h-4 stroke-current" />
        }
    };

    // Crea rutas de breadcrumb para una sección del mantenimiento
    const getMaintenancePath = (
        title: string,
        icon: React.ReactNode,
        from: "home" | "dashboard" | "modules" = "modules"
    ): BreadcrumbItem[] => {
        const result: BreadcrumbItem[] = [];

        if (from === "home" || from === "dashboard") {
            result.push(basePaths.home);
        }

        if (from === "home" || from === "dashboard") {
            result.push(basePaths.dashboard);
        }

        if (from === "home" || from === "dashboard" || from === "modules") {
            result.push(basePaths.modules);
        }

        result.push(basePaths.maintenance);

        result.push({
            name: title,
            path: "", // La página actual no tiene ruta navegable
            icon
        });

        return result;
    };

    // Crea rutas de breadcrumb para una sección de documentos
    const getDocumentPath = (
        title: string,
        icon: React.ReactNode,
        from: "home" | "dashboard" | "modules" = "modules"
    ): BreadcrumbItem[] => {
        const result: BreadcrumbItem[] = [];

        if (from === "home" || from === "dashboard") {
            result.push(basePaths.home);
        }

        if (from === "home" || from === "dashboard") {
            result.push(basePaths.dashboard);
        }

        if (from === "home" || from === "dashboard" || from === "modules") {
            result.push(basePaths.modules);
        }

        result.push(basePaths.documents);

        result.push({
            name: title,
            path: "", // La página actual no tiene ruta navegable
            icon
        });

        return result;
    };

    return {
        basePaths,
        getMaintenancePath,
        getDocumentPath
    };
};

