'use client';
import BotonesMenu from "@/components/sistema/BotonesMenu";
import { useRouter } from "next/navigation";
import React from "react";
import { Breadcrumb } from "@/components/sistema/breadcrumbs/Breadcrumb";
import { useBreadcrumbPaths } from "@/components/sistema/breadcrumbs/useBreadcrumbPaths";

// Importamos los iconos desde react-icons
import {
    FiBox,
    FiMapPin,
    FiMap,
    FiGlobe,
    FiUsers,
    FiLayers
} from "react-icons/fi";

import {
    MdOutlineLocalShipping,
    MdOutlineAirplanemodeActive,
    MdOutlineLocationCity,
    MdOutlineSpeed,
    MdOutlineCategory
} from "react-icons/md";

import {
    FaWarehouse,
    FaIdCard,
    FaTruck,
    FaNetworkWired,
    FaUserTie,
    FaBriefcase
} from "react-icons/fa";

import {
    BiSolidTruck,
    BiWorld
} from "react-icons/bi";

import {
    HiOfficeBuilding,
    HiUserGroup
} from "react-icons/hi";

export default function MantenimientoInit() {
    const router = useRouter();
    const { getMaintenancePath } = useBreadcrumbPaths();

    // Agrupamos todas las rutas para mejorar organización
    const routes = {
        productos: '/sistema/dashboard/modulos/mantenimiento/datos/productos',
        aerolineas: '/sistema/dashboard/modulos/mantenimiento/datos/aerolineas',
        origenes: '/sistema/dashboard/modulos/mantenimiento/datos/origenes',
        destinos: '/sistema/dashboard/modulos/mantenimiento/datos/destinos',
        paises: '/sistema/dashboard/modulos/mantenimiento/datos/paises',
        unidadesMedida: '/sistema/dashboard/modulos/mantenimiento/datos/unidades_medida',
        tiposEmbarque: '/sistema/dashboard/modulos/mantenimiento/datos/tipos_embarque',
        embarcadores: '/sistema/dashboard/modulos/mantenimiento/datos/embarcadores',
        consignatario: '/sistema/dashboard/modulos/mantenimiento/datos/consignatario',
        fincas: '/sistema/dashboard/modulos/mantenimiento/datos/fincas',
        clientes: '/sistema/dashboard/modulos/mantenimiento/datos/clientes',
        agenciasIata: '/sistema/dashboard/modulos/mantenimiento/datos/agencias_iata',
        subAgencias: '/sistema/dashboard/modulos/mantenimiento/datos/subagencias',
        regiones: '/sistema/dashboard/modulos/mantenimiento/datos/regiones',
        funcionariosAgrocalidad: '/sistema/dashboard/modulos/mantenimiento/datos/funcionarios_agrocalidad',
        bodegueros: '/sistema/dashboard/modulos/mantenimiento/datos/bodegueros',
        choferes: '/sistema/dashboard/modulos/mantenimiento/datos/choferes',
        webUsuarios: '/sistema/dashboard/modulos/mantenimiento/datos/web_usuarios'
    };

    // Obtener las rutas de breadcrumb
    const breadcrumbItems = getMaintenancePath("Mantenimiento", <MdOutlineCategory className="w-4 h-4" />);

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            <h1 className="text-3xl font-bold self-start pt-8 max-sm:text-xl">Mantenimiento</h1>
            <h2 className="text-xl self-start max-sm:text-lg">Datos maestros</h2>
            <div className="grid grid-cols-3 w-full gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">

                <BotonesMenu
                    titulo="Productos"
                    icon={FiBox}
                    onClick={() => router.push(routes.productos)}
                    description="Gestión de productos del sistema"
                />

                <BotonesMenu
                    titulo="Aerolíneas"
                    icon={MdOutlineAirplanemodeActive}
                    onClick={() => router.push(routes.aerolineas)}
                    description="Administración de aerolíneas"
                />

                <BotonesMenu
                    titulo="Orígenes"
                    icon={FiMapPin}
                    onClick={() => router.push(routes.origenes)}
                    description="Gestión de lugares de origen"
                />

                <BotonesMenu
                    titulo="Destinos"
                    icon={FiMap}
                    onClick={() => router.push(routes.destinos)}
                    description="Gestión de lugares de destino"
                />

                <BotonesMenu
                    titulo="Países"
                    icon={FiGlobe}
                    onClick={() => router.push(routes.paises)}
                    description="Gestión de países"
                />

                <BotonesMenu
                    titulo="Unidades de medida"
                    icon={MdOutlineSpeed}
                    onClick={() => router.push(routes.unidadesMedida)}
                    description="Gestión de unidades de medida"
                />

                <BotonesMenu
                    titulo="Tipo de embarque"
                    icon={MdOutlineLocalShipping}
                    onClick={() => router.push(routes.tiposEmbarque)}
                    description="Gestión de tipos de embarque"
                />

            </div>

            <h2 className="text-xl self-start max-sm:text-lg mt-8">Entidades</h2>
            <div className="grid grid-cols-3 w-full gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">

                <BotonesMenu
                    titulo="Embarcadores"
                    icon={BiSolidTruck}
                    onClick={() => router.push(routes.embarcadores)}
                    description="Gestión de embarcadores"
                />

                <BotonesMenu
                    titulo="Consignatario"
                    icon={FaTruck}
                    onClick={() => router.push(routes.consignatario)}
                    description="Gestión de consignatarios"
                />

                <BotonesMenu
                    titulo="Fincas"
                    icon={FaWarehouse}
                    onClick={() => router.push(routes.fincas)}
                    description="Gestión de fincas"
                />

                <BotonesMenu
                    titulo="Clientes"
                    icon={FiUsers}
                    onClick={() => router.push(routes.clientes)}
                    description="Gestión de clientes"
                />

                <BotonesMenu
                    titulo="Agencias IATA"
                    icon={HiOfficeBuilding}
                    onClick={() => router.push(routes.agenciasIata)}
                    description="Gestión de agencias IATA"
                />

                <BotonesMenu
                    titulo="Sub Agencias"
                    icon={FaNetworkWired}
                    onClick={() => router.push(routes.subAgencias)}
                    description="Gestión de sub agencias"
                />

                <BotonesMenu
                    titulo="Regiones"
                    icon={BiWorld}
                    description="Gestión de regiones y zonas"
                    onClick={() => router.push(routes.regiones)}
                />

            </div>

            <h2 className="text-xl self-start max-sm:text-lg mt-8">Recursos Humanos</h2>
            <div className="grid grid-cols-3 w-full gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">

                <BotonesMenu
                    titulo="Funcionarios Agrocalidad"
                    icon={FaUserTie}
                    onClick={() => router.push(routes.funcionariosAgrocalidad)}
                    description="Gestión de funcionarios de Agrocalidad"
                />

                <BotonesMenu
                    titulo="Bodegueros"
                    icon={FaBriefcase}
                    onClick={() => router.push(routes.bodegueros)}
                    description="Gestión de bodegueros"
                />

                <BotonesMenu
                    titulo="Choferes"
                    icon={FaTruck}
                    onClick={() => router.push(routes.choferes)}
                    description="Gestión de choferes"
                />

                <BotonesMenu
                    titulo="Web Usuarios (CCOO)"
                    icon={HiUserGroup}
                    onClick={() => router.push(routes.webUsuarios)}
                    description="Gestión de usuarios web"
                />

            </div>
        </>
    );
}