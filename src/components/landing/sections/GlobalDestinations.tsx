'use client';

import React, { forwardRef, RefObject, useState } from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '@/utils/theme';
import {
    FaGlobeAmericas,
    FaPlane,
    FaRegStar,
    FaChartLine
} from 'react-icons/fa';

// Datos de regiones y destinos
const regionsData = [
    {
        id: 1,
        name: "América del Norte",
        markets: [
            {
                country: "Estados Unidos",
                cities: ["Miami", "Nueva York", "Los Ángeles", "Chicago"],
                stats: {
                    percentage: 65,
                    growth: "+8.5%",
                    flights: 12
                }
            },
            {
                country: "Canadá",
                cities: ["Toronto", "Montreal", "Vancouver"],
                stats: {
                    percentage: 12,
                    growth: "+4.2%",
                    flights: 3
                }
            }
        ],
        description: "Estados Unidos es el principal destino de las flores ecuatorianas, con Miami como el principal punto de entrada. El mercado norteamericano valora especialmente las rosas de tallo largo y los bouquets mixtos.",
        icon: <FaPlane />
    },
    {
        id: 2,
        name: "Europa",
        markets: [
            {
                country: "Países Bajos",
                cities: ["Amsterdam", "Rotterdam"],
                stats: {
                    percentage: 20,
                    growth: "+12.3%",
                    flights: 5
                }
            },
            {
                country: "España",
                cities: ["Madrid", "Barcelona"],
                stats: {
                    percentage: 8,
                    growth: "+5.7%",
                    flights: 2
                }
            },
            {
                country: "Rusia",
                cities: ["Moscú", "San Petersburgo"],
                stats: {
                    percentage: 7,
                    growth: "+3.1%",
                    flights: 2
                }
            },
            {
                country: "Italia",
                cities: ["Roma", "Milán"],
                stats: {
                    percentage: 5,
                    growth: "+2.8%",
                    flights: 2
                }
            }
        ],
        description: "El mercado europeo es muy exigente en cuanto a calidad y sostenibilidad. Los Países Bajos funcionan como centro de redistribución para toda Europa. Las variedades premium y las flores de colores únicos son altamente valoradas.",
        icon: <FaGlobeAmericas />
    },
    {
        id: 3,
        name: "Asia",
        markets: [
            {
                country: "Japón",
                cities: ["Tokyo", "Osaka"],
                stats: {
                    percentage: 5,
                    growth: "+15.7%",
                    flights: 2
                }
            },
            {
                country: "China",
                cities: ["Shanghai", "Beijing"],
                stats: {
                    percentage: 3,
                    growth: "+22.3%",
                    flights: 1
                }
            }
        ],
        description: "El mercado asiático está en rápido crecimiento, con Japón liderando las importaciones. El mercado asiático aprecia especialmente la calidad y las características únicas de las flores ecuatorianas, como las rosas de colores especiales.",
        icon: <FaRegStar />
    }
];

const GlobalDestinations = forwardRef<HTMLElement>((_props, ref) => {
    const [activeRegion, setActiveRegion] = useState<number>(1);

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

    const regionVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6 }
        }
    };

    const marketVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.2 + (i * 0.1),
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    const activeRegionData = regionsData.find(region => region.id === activeRegion) || regionsData[0];

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
                        Destinos Internacionales
                    </h2>
                    <p
                        className="text-xl max-w-3xl mx-auto"
                        style={{ color: COLORS.TEXT.SECONDARY }}
                    >
                        Conectamos las flores ecuatorianas con los mercados más importantes del mundo,
                        asegurando entregas puntuales y en óptimas condiciones.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar de regiones */}
                    <motion.div
                        className="lg:col-span-3"
                        variants={regionVariants}
                    >
                        <h3
                            className="text-2xl font-bold mb-6"
                            style={{ color: COLORS.TEXT.PRIMARY }}
                        >
                            Regiones
                        </h3>

                        <div className="space-y-3">
                            {regionsData.map(region => (
                                <button
                                    key={region.id}
                                    className={`w-full py-3 px-4 rounded-lg text-left flex items-center transition-all duration-300 ${activeRegion === region.id ? 'font-semibold' : ''
                                        }`}
                                    style={{
                                        backgroundColor: activeRegion === region.id
                                            ? `${COLORS.PRIMARY.MAIN}30`
                                            : 'rgba(255, 255, 255, 0.05)',
                                        color: activeRegion === region.id
                                            ? COLORS.PRIMARY.MAIN
                                            : COLORS.TEXT.SECONDARY,
                                        borderLeft: `3px solid ${activeRegion === region.id ? COLORS.PRIMARY.MAIN : 'transparent'}`
                                    }}
                                    onClick={() => setActiveRegion(region.id)}
                                >
                                    <div className="mr-3">
                                        {region.icon}
                                    </div>
                                    <span>{region.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Estadísticas globales */}
                        <div
                            className="mt-8 p-4 rounded-lg"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                        >
                            <h4
                                className="text-sm font-semibold mb-4 flex items-center"
                                style={{ color: COLORS.TEXT.SECONDARY }}
                            >
                                <FaChartLine className="mr-2" />
                                ESTADÍSTICAS GLOBALES
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span style={{ color: COLORS.TEXT.HINT }}>Destinos totales</span>
                                        <span style={{ color: COLORS.TEXT.PRIMARY }}>25+</span>
                                    </div>
                                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: '100%',
                                                backgroundColor: COLORS.PRIMARY.MAIN
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span style={{ color: COLORS.TEXT.HINT }}>Vuelos semanales</span>
                                        <span style={{ color: COLORS.TEXT.PRIMARY }}>30+</span>
                                    </div>
                                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: '85%',
                                                backgroundColor: COLORS.SECONDARY.MAIN
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span style={{ color: COLORS.TEXT.HINT }}>Crecimiento anual</span>
                                        <span style={{ color: COLORS.TEXT.PRIMARY }}>+12.5%</span>
                                    </div>
                                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: '65%',
                                                backgroundColor: COLORS.ACCENT.CREAM
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contenido principal */}
                    <div className="lg:col-span-9">
                        {/* Descripción de la región */}
                        <motion.div
                            className="mb-8 p-6 rounded-xl bg-gradient-to-br from-gray-900/70 to-gray-800/70 backdrop-blur-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
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
                                    {activeRegionData.icon}
                                </div>
                                {activeRegionData.name}
                            </h3>
                            <p
                                className="text-lg"
                                style={{ color: COLORS.TEXT.SECONDARY }}
                            >
                                {activeRegionData.description}
                            </p>
                        </motion.div>

                        {/* Mercados principales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeRegionData.markets.map((market, index) => (
                                <motion.div
                                    key={market.country}
                                    className="rounded-xl p-6 bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm border border-transparent hover:border-gray-700 transition-all duration-300"
                                    variants={marketVariants}
                                    custom={index}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h4
                                            className="text-xl font-bold"
                                            style={{ color: COLORS.TEXT.PRIMARY }}
                                        >
                                            {market.country}
                                        </h4>
                                        <div
                                            className="text-sm font-bold px-3 py-1 rounded-full"
                                            style={{
                                                backgroundColor: `${COLORS.PRIMARY.MAIN}30`,
                                                color: COLORS.PRIMARY.MAIN
                                            }}
                                        >
                                            {market.stats.percentage}%
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h5
                                            className="text-sm font-medium mb-2"
                                            style={{ color: COLORS.TEXT.HINT }}
                                        >
                                            PRINCIPALES CIUDADES
                                        </h5>
                                        <div className="flex flex-wrap gap-2">
                                            {market.cities.map(city => (
                                                <span
                                                    key={city}
                                                    className="text-sm py-1 px-2 rounded"
                                                    style={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                        color: COLORS.TEXT.SECONDARY
                                                    }}
                                                >
                                                    {city}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div
                                                className="text-sm"
                                                style={{ color: COLORS.TEXT.HINT }}
                                            >
                                                CRECIMIENTO
                                            </div>
                                            <div
                                                className="text-lg font-bold"
                                                style={{ color: COLORS.STATE.SUCCESS }}
                                            >
                                                {market.stats.growth}
                                            </div>
                                        </div>
                                        <div>
                                            <div
                                                className="text-sm"
                                                style={{ color: COLORS.TEXT.HINT }}
                                            >
                                                VUELOS SEMANALES
                                            </div>
                                            <div
                                                className="text-lg font-bold"
                                                style={{ color: COLORS.TEXT.PRIMARY }}
                                            >
                                                {market.stats.flights}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Estadísticas de entregas */}
                        <motion.div
                            className="mt-8 p-6 rounded-xl bg-gradient-to-r from-gray-900/70 to-gray-800/70 backdrop-blur-sm"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <h4
                                className="text-xl font-bold mb-4"
                                style={{ color: COLORS.TEXT.PRIMARY }}
                            >
                                Eficiencia en Destinos {activeRegionData.name}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col items-center">
                                    <div
                                        className="text-4xl font-bold mb-2"
                                        style={{ color: COLORS.PRIMARY.MAIN }}
                                    >
                                        98%
                                    </div>
                                    <div className="text-center" style={{ color: COLORS.TEXT.SECONDARY }}>
                                        Entregas a tiempo
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div
                                        className="text-4xl font-bold mb-2"
                                        style={{ color: COLORS.PRIMARY.MAIN }}
                                    >
                                        &lt;24h
                                    </div>
                                    <div className="text-center" style={{ color: COLORS.TEXT.SECONDARY }}>
                                        Tiempo de tránsito aeropuerto-cliente
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div
                                        className="text-4xl font-bold mb-2"
                                        style={{ color: COLORS.PRIMARY.MAIN }}
                                    >
                                        99%
                                    </div>
                                    <div className="text-center" style={{ color: COLORS.TEXT.SECONDARY }}>
                                        Satisfacción del cliente
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>


            </motion.div>
        </section>
    );
});

GlobalDestinations.displayName = 'GlobalDestinations';
export default GlobalDestinations;