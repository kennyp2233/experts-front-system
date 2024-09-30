// Contact.tsx

'use client';

import React, { RefObject, forwardRef } from 'react';
import { motion } from 'framer-motion';
import "./styles/contact.css";

// Asegúrate de tener Framer Motion instalado:
// npm install framer-motion

const Contact = forwardRef<HTMLElement>((props, ref) => {
    const contactInfo = [
        {
            title: 'Dirección',
            description: (
                <>
                    <p>10 DE DICIEMBRE Y CHILLANES</p>
                    <p>CONJUNTO MI PASEO CASA 31</p>
                    <p>SANGOLQUI</p>
                    <p>ECUADOR</p>
                </>
            ),
            icon: '🏠'
        },
        {
            title: 'Teléfono',
            description: (
                <div className="text-gray-400 text-center text-lg">
                    <p className="mb-2">
                        <span className="font-semibold">Número Fijo:</span> +593 2 352 6170
                    </p>
                    <p className="mb-2">
                        <span className="font-semibold">Celular:</span> +593 96 005 8635
                    </p>
                    <p>
                        <span className="font-semibold">WhatsApp:</span> <strong>+593 98 237 2511</strong>
                    </p>
                </div>
            ),
            icon: '📞'
        },
        {
            title: 'Correo',
            description: (
                <div className="text-gray-400 text-center break-words">
                    <p>
                        <a href="mailto:manager@expertshcargo.com" className="hover:underline">manager@expertshcargo.com</a>
                    </p>
                    <p>
                        <a href="mailto:coordination@expertshcargo.com" className="hover:underline">coordination@expertshcargo.com</a>
                    </p>
                    <p>
                        <a href="mailto:expertshcargosa@gmail.com" className="hover:underline">expertshcargosa@gmail.com</a>
                    </p>
                </div>
            ),
            icon: '✉️'
        }
    ];

    // Variantes para animaciones con Framer Motion
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.3,
                duration: 0.6,
                ease: 'easeOut'
            }
        })
    };

    return (
        <section
            ref={ref as RefObject<HTMLElement>}
            className="max-w-screen-lg mx-auto py-24 px-10 relative pt-[196px] min-h-[100vh] max-md:px-4 max-md:pt-28 text-white"
        >
            {/* Título de la sección */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-6xl text-center tracking-tighter font-bold max-md:text-4xl mb-8"
            >
                Contacto
            </motion.h1>

            {/* Información de Contacto */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
            >
                {contactInfo.map((info, index) => (
                    <motion.div
                        key={index}
                        custom={index}
                        variants={containerVariants}
                        className="flex flex-col items-center p-6 bg-transparent backdrop-blur-lg border border-gray-700 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
                    >
                        <h5 className="mb-4 text-2xl font-bold tracking-tight text-white flex items-center">
                            <span className="mr-2 text-blue-500 animate-bounce">{info.icon}</span> {info.title}
                        </h5>
                        {info.description}
                    </motion.div>
                ))}
            </motion.div>

            {/* Sección de Ubicación */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-12"
            >
                <h2 className="text-3xl font-semibold mb-4 text-center">Ubicación</h2>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d814.8629519751344!2d-78.44019015204388!3d-0.35087356115242013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sec!4v1713365037178!5m2!1ses-419!2sec"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg shadow-md"
                ></iframe>
            </motion.div>
        </section>
    );
});

Contact.displayName = 'Contact';
export default Contact;
