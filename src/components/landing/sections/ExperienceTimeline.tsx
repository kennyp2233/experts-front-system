'use client';

import React, { forwardRef, RefObject, useState } from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '@/utils/theme';
import Image from 'next/image';
import {
    FaRegCalendarAlt,
    FaTrophy,
    FaUserTie,
    FaWarehouse,
    FaGlobeAmericas,
    FaChartLine
} from 'react-icons/fa';

// Datos de timeline
const timelineEvents = [
    {
        id: 1,
        year: "2008",
        title: "Fundación de Experts Handling Cargo",
        description: "Inicio de operaciones el 4 de diciembre de 2008, estableciendo las bases para servicios logísticos especializados en el sector florícola.",
        icon: <FaRegCalendarAlt size={20} />,
        image: "/img/timeline/foundation.jpg" // Imagen representativa
    },
    {
        id: 2,
        year: "2010",
        title: "Expansión de Servicios",
        description: "Implementación de sistemas de monitoreo satelital y ampliación de la flota de transporte refrigerado.",
        icon: <FaChartLine size={20} />,
        image: "/img/timeline/expansion.jpg" // Imagen representativa
    },
    {
        id: 3,
        year: "2013",
        title: "Alianza Estratégica con FlowerCargo",
        description: "Establecimiento de alianza clave con el centro logístico de cuartos fríos en Tababela, Quito, para mejorar la capacidad de almacenamiento.",
        icon: <FaUserTie size={20} />,
        image: "/img/timeline/partnership.jpg" // Imagen representativa
    },
    {
        id: 4,
        year: "2015",
        title: "Modernización de Infraestructura",
        description: "Instalación de sistemas avanzados de control de temperatura y ampliación de las bases operativas para mayor cobertura.",
        icon: <FaWarehouse size={20} />,
        image: "/img/timeline/infrastructure.jpg" // Imagen representativa
    },
    {
        id: 5,
        year: "2018",
        title: "10 Años de Excelencia Logística",
        description: "Celebración de una década de operaciones exitosas, consolidando nuestra posición como expertos en logística de exportación floral.",
        icon: <FaTrophy size={20} />,
        image: "/img/timeline/anniversary.jpg" // Imagen representativa
    },
    {
        id: 6,
        year: "2024",
        title: "Récord de Exportación",
        description: "Participación clave en la exportación de 28.779 toneladas de flores desde el aeropuerto de Quito durante la temporada de San Valentín, un hito histórico para el sector.",
        icon: <FaGlobeAmericas size={20} />,
        image: "/img/timeline/record.jpg" // Imagen representativa
    }
];

// Datos de estadísticas
const statsData = [
    { label: "Años de Experiencia", value: "15+", icon: <FaRegCalendarAlt size={24} /> },
    { label: "Toneladas Exportadas", value: "30K+", icon: <FaChartLine size={24} /> },
    { label: "Clientes Activos", value: "100+", icon: <FaUserTie size={24} /> },
    { label: "Destinos Internacionales", value: "25+", icon: <FaGlobeAmericas size={24} /> }
];

const ExperienceTimeline = forwardRef<HTMLElement>((_props, ref) => {
    const [activeEvent, setActiveEvent] = useState<number>(timelineEvents.length);

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

    const statsVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: 0.1 + (i * 0.1),
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
                        Nuestra Trayectoria
                    </h2>
                    <p
                        className="text-xl max-w-3xl mx-auto"
                        style={{ color: COLORS.TEXT.SECONDARY }}
                    >
                        Más de 15 años de experiencia consolidando nuestro liderazgo en
                        logística especializada para exportación de flores.
                    </p>
                </motion.div>

                {/* Estadísticas clave */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                    {statsData.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-5 flex flex-col items-center backdrop-blur-sm"
                            variants={statsVariants}
                            custom={index}
                        >
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                                style={{
                                    backgroundColor: `${COLORS.PRIMARY.MAIN}20`,
                                    color: COLORS.PRIMARY.MAIN
                                }}
                            >
                                {stat.icon}
                            </div>
                            <div
                                className="text-3xl font-bold mb-1"
                                style={{ color: COLORS.TEXT.PRIMARY }}
                            >
                                {stat.value}
                            </div>
                            <div
                                className="text-sm text-center"
                                style={{ color: COLORS.TEXT.SECONDARY }}
                            >
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Timeline vertical */}
                <div className="relative">
                    {/* Línea vertical */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-700 transform -translate-x-1/2">
                        <div
                            className="absolute top-0 h-full w-full"
                            style={{
                                backgroundColor: COLORS.PRIMARY.MAIN,
                                transform: `scaleY(${activeEvent / timelineEvents.length})`,
                                transformOrigin: 'top',
                                transition: 'transform 0.5s ease-out'
                            }}
                        ></div>
                    </div>

                    {/* Eventos del timeline */}
                    {timelineEvents.map((event, index) => (
                        <motion.div
                            key={event.id}
                            className={`mb-16 relative flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            onViewportEnter={() => setActiveEvent(event.id)}
                        >
                            {/* Punto del timeline */}
                            <div
                                className="hidden md:flex absolute left-1/2 top-0 w-8 h-8 rounded-full items-center justify-center transform -translate-x-1/2 z-10"
                                style={{
                                    backgroundColor: event.id <= activeEvent
                                        ? COLORS.PRIMARY.MAIN
                                        : COLORS.BACKGROUND.LIGHT,
                                    boxShadow: event.id <= activeEvent
                                        ? '0 0 15px rgba(167, 4, 4, 0.5)'
                                        : 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {event.icon}
                            </div>

                            {/* Fecha - solo visible en móvil */}
                            <div
                                className="md:hidden flex items-center mb-2"
                                style={{ color: COLORS.PRIMARY.MAIN }}
                            >
                                {event.icon}
                                <span className="font-bold ml-2">{event.year}</span>
                            </div>

                            {/* Contenido del evento */}
                            <div className={`md:w-5/12 w-full ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                                {/* Año - visible en desktop */}
                                <div
                                    className="hidden md:block text-2xl font-bold mb-2"
                                    style={{ color: COLORS.PRIMARY.MAIN }}
                                >
                                    {event.year}
                                </div>

                                {/* Título y descripción */}
                                <div
                                    className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-lg p-5 backdrop-blur-sm"
                                    style={{
                                        borderLeft: `3px solid ${event.id <= activeEvent ? COLORS.PRIMARY.MAIN : 'transparent'}`,
                                        transition: 'border 0.3s ease'
                                    }}
                                >
                                    <h3
                                        className="text-xl font-bold mb-2"
                                        style={{ color: COLORS.TEXT.PRIMARY }}
                                    >
                                        {event.title}
                                    </h3>
                                    <p style={{ color: COLORS.TEXT.SECONDARY }}>
                                        {event.description}
                                    </p>
                                </div>
                            </div>

                            {/* Espacio central (solo para desktop) */}
                            <div className="hidden md:block md:w-2/12"></div>

                            {/* Imagen del evento o espacio vacío */}
                            <div className="md:w-5/12 w-full mt-4 md:mt-0">
                                {index % 2 === 0 ? (
                                    <div className="hidden md:block h-full rounded-lg overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                                        <div className="relative h-60 w-full">
                                            <Image
                                                src={event.image}
                                                alt={event.title}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-lg"
                                                placeholder="blur"
                                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88OjpfwAI+QOoF8YQhgAAAABJRU5ErkJggg=="
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                        </div>
                                    </div>
                                ) : (
                                    // No hacemos nada para eventos impares en esta columna en desktop
                                    <div className="hidden md:block"></div>
                                )}

                                {/* En móvil mostramos la imagen siempre */}
                                {event.image && (
                                    <div className="md:hidden h-40 relative w-full rounded-lg overflow-hidden">
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-lg"
                                            placeholder="blur"
                                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88OjpfwAI+QOoF8YQhgAAAABJRU5ErkJggg=="
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Próximos pasos */}
                <motion.div
                    className="bg-gradient-to-br from-gray-900/70 to-gray-800/70 rounded-xl p-8 mt-12 border-l-4 backdrop-blur-sm text-center"
                    style={{ borderColor: COLORS.PRIMARY.MAIN }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <h3
                        className="text-2xl font-bold mb-4"
                        style={{ color: COLORS.TEXT.PRIMARY }}
                    >
                        Nuestro futuro
                    </h3>
                    <p
                        className="text-lg max-w-3xl mx-auto mb-6"
                        style={{ color: COLORS.TEXT.SECONDARY }}
                    >
                        Seguimos comprometidos con la expansión de nuestras capacidades operativas,
                        incorporando nuevas unidades a nuestra flota y ampliando nuestras bases
                        operativas para ofrecer un servicio cada vez más eficiente y completo.
                    </p>
                    <button
                        className="px-8 py-3 rounded-md font-medium text-lg transition-all duration-300 hover:-translate-y-1"
                        style={{
                            backgroundColor: COLORS.PRIMARY.MAIN,
                            color: COLORS.TEXT.PRIMARY,
                            boxShadow: '0 4px 10px rgba(167, 4, 4, 0.3)'
                        }}
                    >
                        Conoce más sobre nosotros
                    </button>
                </motion.div>
            </motion.div>
        </section>
    );
});

ExperienceTimeline.displayName = 'ExperienceTimeline';
export default ExperienceTimeline;