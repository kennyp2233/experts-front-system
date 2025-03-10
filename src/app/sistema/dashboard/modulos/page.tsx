'use client';
import BotonesMenu from "@/components/sistema/BotonesMenu";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/sistema/breadcrumbs/Breadcrumb";
import { useBreadcrumbPaths } from "@/components/sistema/breadcrumbs/useBreadcrumbPaths";
import { HiOutlineDocumentText } from "react-icons/hi";
import { MdOutlineAssessment, MdOutlineSettings } from "react-icons/md";

export default function Modulos() {
    const router = useRouter();
    const { basePaths } = useBreadcrumbPaths();

    const handleMantenimiento = async () => {
        router.push('/sistema/dashboard/modulos/mantenimiento');
    }

    const handleDocumentos = async () => {
        router.push('/sistema/dashboard/modulos/documentos');
    }

    const handleReportes = async () => {
        router.push('/sistema/dashboard/modulos/reportes');
    }

    // Definir rutas para breadcrumb
    const breadcrumbItems = [
        basePaths.home,
        basePaths.dashboard,
        {
            name: "Módulos",
            path: "/sistema/dashboard/modulos",
            icon: <MdOutlineSettings className="w-4 h-4" />
        }
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            <h1 className="text-3xl font-bold self-start pt-8 max-sm:text-xl">Módulos</h1>
            <div className="grid grid-cols-3 w-full gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">

                <BotonesMenu
                    titulo="Documentos"
                    icon={HiOutlineDocumentText}
                    onClick={handleDocumentos}
                    description="Gestión de documentos y guías"
                />

                <BotonesMenu
                    titulo="Reportes"
                    icon={MdOutlineAssessment}
                    onClick={handleReportes}
                    description="Reportes y estadísticas del sistema"
                />

                <BotonesMenu
                    titulo="Mantenimiento"
                    icon={MdOutlineSettings}
                    onClick={handleMantenimiento}
                    description="Configuración de catálogos y parámetros"
                />

            </div>
        </>
    );
}