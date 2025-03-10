'use client';
import BotonesMenu from "@/components/sistema/BotonesMenu";
import { useRouter } from "next/navigation";
import {
    HiOutlineDocumentText,
    HiOutlineUserGroup,
    HiOutlineCog
} from "react-icons/hi";

import {
    MdOutlineViewModule,
    MdOutlineNetworkWifi
} from "react-icons/md";

const Dashboard = () => {
    const router = useRouter();

    const handleGuias = () => {
        router.push('/sistema/dashboard/modulos/guias');
    }

    const handleCoordinacion = () => {
        router.push('/sistema/dashboard/modulos/coordinacion');
    }

    const handleUsuarios = () => {
        router.push('/sistema/dashboard/modulos/usuarios');
    }

    const handleMantenimiento = () => {
        router.push('/sistema/dashboard/modulos/mantenimiento');
    }

    const handleModulos = () => {
        router.push('/sistema/dashboard/modulos');
    }

    return (
        <>
            <h1 className="text-3xl font-bold self-start pt-8 max-sm:text-xl">Dashboard</h1>
            <h2 className="text-xl self-start max-sm:text-lg">Accesos Directos</h2>
            <div className="grid grid-cols-3 w-full gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">

                <BotonesMenu
                    titulo="Guías"
                    icon={HiOutlineDocumentText}
                    onClick={handleGuias}
                    description="Administración de documentos y guías"
                />

                <BotonesMenu
                    titulo="Coordinación"
                    icon={MdOutlineNetworkWifi}
                    onClick={handleCoordinacion}
                    description="Gestionar coordinaciones y asignaciones"
                />

                <BotonesMenu
                    titulo="Usuarios"
                    icon={HiOutlineUserGroup}
                    onClick={handleUsuarios}
                    description="Administración de usuarios del sistema"
                />

                <BotonesMenu
                    titulo="Mantenimiento"
                    icon={HiOutlineCog}
                    onClick={handleMantenimiento}
                    description="Gestión de catálogos y configuraciones"
                />

                <BotonesMenu
                    titulo="Módulos"
                    icon={MdOutlineViewModule}
                    onClick={handleModulos}
                    description="Acceso a todos los módulos del sistema"
                />

            </div>
        </>
    );
}

export default Dashboard;