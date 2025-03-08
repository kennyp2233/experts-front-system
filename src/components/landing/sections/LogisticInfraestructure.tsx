'use client';

import React, { forwardRef, RefObject, useState } from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '@/utils/theme';
import Image from 'next/image';
import {
    FaTruckMoving,
    FaWarehouse,
    FaThermometerHalf,
    FaMapMarkedAlt,
    FaBuilding
} from 'react-icons/fa';
import dynamic from 'next/dynamic';

const CoverageMap = dynamic(() => import('../CoverageMap'), { ssr: false });
// Datos de instalaciones
const facilitiesData = [
    {
        id: 1,
        title: "Oficinas Centrales",
        location: "Sangolquí, Pichincha",
        description: "Nuestra oficina principal desde donde coordinamos todas las operaciones logísticas y brindamos atención personalizada a nuestros clientes.",
        image: "/img/oficina.png", // Reemplazar con imágenes reales
        icon: <FaBuilding size={24} />
    },
    {
        id: 2,
        title: "Cuartos Fríos FlowerCargo",
        location: "Tababela, Quito (Aeropuerto)",
        description: "Instalaciones especializadas para el almacenamiento refrigerado de flores, manteniendo la temperatura óptima para preservar la frescura y calidad del producto.",
        image: "/img/cuarto-frio.png", // Reemplazar con imágenes reales
        icon: <FaWarehouse size={24} />
    },
    {
        id: 3,
        title: "Flota de Transporte Refrigerado",
        location: "Operación nacional",
        description: "Vehículos equipados con sistemas avanzados de refrigeración para mantener la cadena de frío durante todo el trayecto desde el productor hasta el aeropuerto.",
        image: "/img/camiones.jpg", // Reemplazar con imágenes reales
        icon: <FaTruckMoving size={24} />
    }
];

// Datos de tecnologías
const technologiesData = [
    {
        id: 1,
        title: "Control de Temperatura Continuo",
        description: "Sistemas avanzados de monitoreo que registran y mantienen la temperatura ideal durante todo el proceso logístico.",
        icon: <FaThermometerHalf size={36} />,
        stat: "2-4°C",
        statLabel: "Temperatura óptima"
    },
    {
        id: 2,
        title: "Seguimiento GPS en Tiempo Real",
        description: "Tecnología de rastreo satelital que permite conocer la ubicación exacta de cada envío durante su traslado terrestre.",
        icon: <FaMapMarkedAlt size={36} />,
        stat: "24/7",
        statLabel: "Monitoreo constante"
    }
];

const LogisticsInfrastructure = forwardRef<HTMLElement>((_props, ref) => {
    const [activeFacility, setActiveFacility] = useState<number>(1);

    // Animaciones
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.2,
                duration: 0.6
            }
        }
    };

    const titleVariants = {
        hidden: { y: -20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const facilityVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const techVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            transition: {
                delay: 0.2 + (i * 0.1),
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    return (
        <section
            ref={ref as RefObject<HTMLElement>}
            className="relative w-full py-24 px-6 lg:px-10"
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}
        >
            <motion.div
                className="container mx-auto max-w-6xl"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                {/* Encabezado de sección */}
                <motion.div
                    className="text-center mb-16"
                    variants={titleVariants}
                >
                    <h2
                        className="text-5xl font-bold mb-6"
                        style={{ color: COLORS.TEXT.PRIMARY }}
                    >
                        Nuestra Infraestructura
                    </h2>
                    <p
                        className="text-xl max-w-3xl mx-auto"
                        style={{ color: COLORS.TEXT.SECONDARY }}
                    >
                        Contamos con instalaciones especializadas y tecnología de punta para
                        garantizar la máxima eficiencia en cada etapa del proceso logístico.
                    </p>
                </motion.div>

                {/* Visualización de instalaciones */}
                <motion.div
                    className="mb-20"
                    variants={facilityVariants}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Selector de instalaciones (visible en móvil) */}
                        <div className="lg:hidden mb-6">
                            <select
                                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
                                value={activeFacility}
                                onChange={(e) => setActiveFacility(parseInt(e.target.value))}
                            >
                                {facilitiesData.map(facility => (
                                    <option key={facility.id} value={facility.id}>
                                        {facility.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Imagen de la instalación */}
                        <div className="h-80 relative rounded-xl overflow-hidden">
                            <Image
                                src={facilitiesData[activeFacility - 1].image}
                                alt={facilitiesData[activeFacility - 1].title}
                                layout="fill"
                                objectFit="cover"
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88OjpfwAI+QOoF8YQhgAAAABJRU5ErkJggg=="
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>

                            {/* Etiqueta de ubicación */}
                            <div
                                className="absolute bottom-0 left-0 right-0 p-4 z-20 flex items-center"
                                style={{ color: COLORS.TEXT.PRIMARY }}
                            >
                                {facilitiesData[activeFacility - 1].icon}
                                <span className="ml-2 font-medium">{facilitiesData[activeFacility - 1].location}</span>
                            </div>
                        </div>

                        {/* Información detallada */}
                        <div className="flex flex-col">
                            {/* Pestañas de selección (solo desktop) */}
                            <div className="hidden lg:flex mb-4 space-x-3">
                                {facilitiesData.map(facility => (
                                    <button
                                        key={facility.id}
                                        className={`py-2 px-4 rounded-md transition-all duration-300 ${activeFacility === facility.id ? 'font-semibold' : ''
                                            }`}
                                        style={{
                                            backgroundColor: activeFacility === facility.id
                                                ? COLORS.PRIMARY.MAIN
                                                : 'rgba(255, 255, 255, 0.1)',
                                            color: COLORS.TEXT.PRIMARY
                                        }}
                                        onClick={() => setActiveFacility(facility.id)}
                                    >
                                        {facility.title}
                                    </button>
                                ))}
                            </div>

                            {/* Detalle de la instalación */}
                            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 flex-grow backdrop-blur-sm">
                                <h3
                                    className="text-2xl font-bold mb-4 flex items-center"
                                    style={{ color: COLORS.TEXT.PRIMARY }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                                        style={{
                                            backgroundColor: `${COLORS.PRIMARY.MAIN}20`,
                                            color: COLORS.PRIMARY.MAIN
                                        }}
                                    >
                                        {facilitiesData[activeFacility - 1].icon}
                                    </div>
                                    {facilitiesData[activeFacility - 1].title}
                                </h3>

                                <p
                                    className="mb-6 text-lg"
                                    style={{ color: COLORS.TEXT.SECONDARY }}
                                >
                                    {facilitiesData[activeFacility - 1].description}
                                </p>

                                {/* Características adicionales */}
                                <div>
                                    <h4
                                        className="text-lg font-semibold mb-3"
                                        style={{ color: COLORS.TEXT.PRIMARY }}
                                    >
                                        Características principales
                                    </h4>
                                    <ul className="space-y-2">
                                        {activeFacility === 1 && (
                                            <>
                                                <li className="flex items-center">
                                                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.PRIMARY.MAIN }}></div>
                                                    <span style={{ color: COLORS.TEXT.SECONDARY }}>Centro de operaciones y servicio al cliente</span>
                                                </li>
                                                <li className="flex items-center">
                                                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.PRIMARY.MAIN }}></div>
                                                    <span style={{ color: COLORS.TEXT.SECONDARY }}>Sistemas informáticos especializados para gestión logística</span>
                                                </li>
                                                <li className="flex items-center">
                                                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.PRIMARY.MAIN }}></div>
                                                    <span style={{ color: COLORS.TEXT.SECONDARY }}>Sala de monitoreo para seguimiento en tiempo real</span>
                                                </li>
                                            </>
                                        )}
                                        {activeFacility === 2 && (
                                            <>
                                                <li className="flex items-center">
                                                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.PRIMARY.MAIN }}></div>
                                                    <span style={{ color: COLORS.TEXT.SECONDARY }}>Temperatura controlada entre 2-4°C</span>
                                                </li>
                                                <li className="flex items-center">
                                                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.PRIMARY.MAIN }}></div>
                                                    <span style={{ color: COLORS.TEXT.SECONDARY }}>Ubicación estratégica cerca del aeropuerto internacional</span>
                                                </li>
                                                <li className="flex items-center">
                                                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.PRIMARY.MAIN }}></div>
                                                    <span style={{ color: COLORS.TEXT.SECONDARY }}>Capacidad para grandes volúmenes durante temporadas pico</span>
                                                </li>
                                            </>
                                        )}
                                        {activeFacility === 3 && (
                                            <>
                                                <li className="flex items-center">
                                                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.PRIMARY.MAIN }}></div>
                                                    <span style={{ color: COLORS.TEXT.SECONDARY }}>Flota moderna con sistemas de refrigeración avanzados</span>
                                                </li>
                                                <li className="flex items-center">
                                                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.PRIMARY.MAIN }}></div>
                                                    <span style={{ color: COLORS.TEXT.SECONDARY }}>Monitoreo constante de temperatura durante el transporte</span>
                                                </li>
                                                <li className="flex items-center">
                                                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.PRIMARY.MAIN }}></div>
                                                    <span style={{ color: COLORS.TEXT.SECONDARY }}>Conductores especializados en manejo de carga perecedera</span>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tecnologías especializadas */}
                <div className="mt-16">
                    <motion.h3
                        className="text-3xl font-bold mb-8 text-center"
                        variants={titleVariants}
                        style={{ color: COLORS.TEXT.PRIMARY }}
                    >
                        Tecnologías Especializadas
                    </motion.h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {technologiesData.map((tech, index) => (
                            <motion.div
                                key={tech.id}
                                className="bg-gradient-to-br from-gray-900/70 to-gray-800/70 rounded-xl p-6 flex items-start backdrop-blur-sm border border-transparent hover:border-gray-700 transition-all duration-300"
                                variants={techVariants}
                                custom={index}
                            >
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                                    style={{
                                        backgroundColor: index === 0
                                            ? `${COLORS.PRIMARY.MAIN}20`
                                            : `${COLORS.SECONDARY.MAIN}20`,
                                        color: index === 0
                                            ? COLORS.PRIMARY.MAIN
                                            : COLORS.SECONDARY.MAIN
                                    }}
                                >
                                    {tech.icon}
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4
                                            className="text-xl font-bold"
                                            style={{ color: COLORS.TEXT.PRIMARY }}
                                        >
                                            {tech.title}
                                        </h4>
                                        <div
                                            className="text-lg font-bold px-3 py-1 rounded-full"
                                            style={{
                                                backgroundColor: index === 0
                                                    ? `${COLORS.PRIMARY.MAIN}30`
                                                    : `${COLORS.SECONDARY.MAIN}30`,
                                                color: index === 0
                                                    ? COLORS.PRIMARY.MAIN
                                                    : COLORS.SECONDARY.MAIN
                                            }}
                                        >
                                            {tech.stat}
                                        </div>
                                    </div>

                                    <p style={{ color: COLORS.TEXT.SECONDARY }}>
                                        {tech.description}
                                    </p>

                                    <div
                                        className="text-xs mt-2"
                                        style={{ color: COLORS.TEXT.HINT }}
                                    >
                                        {tech.statLabel}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Capacidades Adicionales */}

                <motion.div
                    className="mt-16 bg-gradient-to-r from-gray-900/70 to-gray-800/70 rounded-xl p-8 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <h3
                        className="text-2xl font-bold mb-6 text-center"
                        style={{ color: COLORS.TEXT.PRIMARY }}
                    >
                        Mapa de Cobertura
                    </h3>

                    <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-800">
                        {/* Reemplaza el placeholder con el componente del mapa */}
                        <CoverageMap />
                    </div>
                </motion.div>


            </motion.div>
        </section>
    );
});

LogisticsInfrastructure.displayName = 'LogisticsInfrastructure';
export default LogisticsInfrastructure;