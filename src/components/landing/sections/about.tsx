'use client';

import React, { forwardRef, RefObject, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Rosa3D from '@/components/landing/Rosa3D';
import { COLORS } from '@/utils/theme';
// Importar iconos de React Icons
import { FaHandshake, FaAward, FaLightbulb } from 'react-icons/fa';

// Valores de la empresa con iconos simplificados
const values = [
    {
        title: 'Fidelidad',
        description: 'Comprometidos con nuestros clientes a largo plazo, construyendo relaciones duraderas basadas en la confianza y el servicio excepcional.',
        icon: <FaHandshake size={24} />
    },
    {
        title: 'Excelencia',
        description: 'Brindamos un servicio de máxima calidad, superando las expectativas a través de la innovación continua y la atención meticulosa a cada detalle.',
        icon: <FaAward size={24} />
    },
    {
        title: 'Creatividad',
        description: 'Soluciones innovadoras para cada reto logístico, utilizando nuestro know-how para transformar obstáculos en oportunidades para nuestros clientes.',
        icon: <FaLightbulb size={24} />
    }
];

const About = forwardRef<HTMLElement>((_props, ref) => {
    // Estados para animación
    const [isVisible, setIsVisible] = useState(false);
    const rosa3DControls = useAnimation();

    // Iniciar animación de Rosa3D cuando el componente es visible
    useEffect(() => {
        if (isVisible) {
            rosa3DControls.start({
                opacity: 0.8,
                scale: 1,
                transition: { duration: 1.2, ease: "easeOut" }
            });
        }
    }, [isVisible, rosa3DControls]);

    // Variantes para animaciones con Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.2,
                duration: 0.5
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.7, ease: "easeOut" }
        }
    };

    const cardVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: 0.3 + (i * 0.1),
                duration: 0.6,
                ease: "easeOut"
            }
        })
    };

    return (
        <>
            <section
                ref={ref as RefObject<HTMLElement>}
                className="relative w-full min-h-screen py-24 px-6 lg:px-10 flex flex-col items-center justify-center"
                style={{
                    // Eliminar el fondo de la sección completa
                    background: 'transparent'
                }}
            >
                {/* Fondo 3D animado */}
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={rosa3DControls}
                >
                    <Rosa3D />
                </motion.div>

                {/* Contenido principal */}
                <motion.div
                    className="container relative z-10 max-w-5xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    onViewportEnter={() => setIsVisible(true)}
                >
                    {/* Encabezado con fondo de gradiente sutil */}
                    <motion.div
                        className="text-center mb-12 p-6 rounded-xl"
                        style={{
                            background: 'radial-gradient(circle, rgba(26,26,26,0.7) 0%, rgba(26,26,26,0.4) 70%, rgba(26,26,26,0) 100%)',
                            backdropFilter: 'blur(5px)',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)' // Sombra sutil para el texto
                        }}
                        variants={itemVariants}
                    >
                        <h1
                            className="text-5xl md:text-6xl font-bold mb-8"
                            style={{ color: COLORS.TEXT.PRIMARY }}
                        >
                            Sobre nosotros
                        </h1>

                        <p
                            className="text-xl md:text-2xl max-w-3xl mx-auto"
                            style={{ color: COLORS.TEXT.SECONDARY }}
                        >
                            Somos una empresa de planeación logística especializada en la exportación de flores al mundo,
                            contribuyendo a la mejora de la competitividad exportadora e importadora.
                            Trabajamos con aliados de negocios reconocidos en el mercado y con amplio conocimiento
                            en el campo de la logística integral.
                        </p>
                    </motion.div>

                    {/* Valores de la empresa */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                className="rounded-xl p-6 backdrop-blur-xl hover:-translate-y-2 transition-all duration-300"
                                style={{
                                    backgroundColor: `rgba(26, 26, 26, 0.85)`, // Fondo ligeramente más opaco para mejor legibilidad
                                    border: `1px solid ${COLORS.BACKGROUND.LIGHT}`,
                                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)' // Sombra más pronunciada
                                }}
                                variants={cardVariants}
                                custom={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                                    style={{
                                        backgroundColor: index === 0
                                            ? `rgba(167, 4, 4, 0.25)` // Aumentar opacidad de los contenedores de iconos
                                            : index === 1
                                                ? `rgba(242, 126, 2, 0.25)`
                                                : `rgba(247, 218, 208, 0.25)`,
                                        color: index === 0
                                            ? COLORS.PRIMARY.MAIN
                                            : index === 1
                                                ? COLORS.SECONDARY.MAIN
                                                : COLORS.ACCENT.CREAM,
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' // Sombra sutil para los iconos
                                    }}
                                >
                                    {value.icon}
                                </div>

                                <h3
                                    className="text-xl font-bold mb-3"
                                    style={{
                                        color: COLORS.TEXT.PRIMARY,
                                        textShadow: '0 1px 2px rgba(0,0,0,0.3)' // Sombra sutil para el texto del título
                                    }}
                                >
                                    {value.title}
                                </h3>

                                <p
                                    className="text-base"
                                    style={{ color: COLORS.TEXT.SECONDARY }}
                                >
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <motion.div
                        className="mt-16 text-center"
                        variants={itemVariants}
                    >
                        <button
                            className="px-8 py-3 rounded-md font-medium text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                            style={{
                                backgroundColor: COLORS.PRIMARY.MAIN,
                                color: COLORS.PRIMARY.CONTRAST,
                                boxShadow: '0 4px 10px rgba(167, 4, 4, 0.3)' // Sombra con color acorde al botón
                            }}
                        >
                            Conocer nuestros servicios
                        </button>
                    </motion.div>
                </motion.div>
            </section>

        </>

    );
});

About.displayName = 'About';
export default About;