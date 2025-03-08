'use client';

import React, { forwardRef, RefObject, useState } from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '@/utils/theme';
import {
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaUser,
    FaBuilding,
    FaPaperPlane,
    FaTruckMoving,
    FaBoxOpen,
    FaGlobeAmericas
} from 'react-icons/fa';

// Lista de servicios para el formulario
const servicesList = [
    { id: 1, name: "Coordinación de Despacho", icon: <FaPaperPlane size={16} /> },
    { id: 2, name: "Almacenamiento en Frío", icon: <FaBoxOpen size={16} /> },
    { id: 3, name: "Transporte Refrigerado", icon: <FaTruckMoving size={16} /> },
    { id: 4, name: "Gestión de Carga Aérea", icon: <FaGlobeAmericas size={16} /> },
    { id: 5, name: "Otro Servicio", icon: <FaBuilding size={16} /> }
];

const ContactForm = forwardRef<HTMLElement>((_props, ref) => {
    // Estados para campos del formulario
    const [nombre, setNombre] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [servicioSeleccionado, setServicioSeleccionado] = useState<number | null>(null);
    const [mensaje, setMensaje] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [enviado, setEnviado] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);

        try {
            const response = await fetch('/api/send_email', {  // <- Verifica esta URL
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre,
                    email,
                    telefono,
                    empresa,
                    servicio: servicesList.find(s => s.id === servicioSeleccionado)?.name || 'Otro',
                    mensaje,
                }),
            });

            if (response.ok) {
                setEnviado(true);
                setTimeout(() => setEnviado(false), 5000);
            } else {
                console.error('Error al enviar el correo');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setEnviando(false);
        }
    };


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

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const contactVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
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
                        Contacta con Nosotros
                    </h2>
                    <p
                        className="text-xl max-w-3xl mx-auto"
                        style={{ color: COLORS.TEXT.SECONDARY }}
                    >
                        ¿Necesitas información sobre nuestros servicios? Completa el formulario
                        y nuestro equipo te contactará a la brevedad.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 ">
                    {/* Formulario de contacto */}
                    <motion.div
                        variants={formVariants}
                    >
                        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-8 backdrop-blur-sm h-full">
                            <h3
                                className="text-2xl font-bold mb-6"
                                style={{ color: COLORS.TEXT.PRIMARY }}
                            >
                                Solicitud de Información
                            </h3>

                            {enviado ? (
                                <div
                                    className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center"
                                    style={{ color: COLORS.TEXT.PRIMARY }}
                                >
                                    <p className="text-lg font-medium mb-2">¡Mensaje enviado con éxito!</p>
                                    <p>Nos pondremos en contacto contigo a la brevedad.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        {/* Nombre */}
                                        <div>
                                            <label
                                                htmlFor="nombre"
                                                className="block mb-2 text-sm font-medium"
                                                style={{ color: COLORS.TEXT.SECONDARY }}
                                            >
                                                Nombre completo *
                                            </label>
                                            <div className="relative">
                                                <div
                                                    className="absolute left-3 top-3"
                                                    style={{ color: COLORS.TEXT.HINT }}
                                                >
                                                    <FaUser />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="nombre"
                                                    value={nombre}
                                                    onChange={(e) => setNombre(e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2"
                                                    style={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                                        color: COLORS.TEXT.PRIMARY,
                                                        caretColor: COLORS.PRIMARY.MAIN,
                                                    }}
                                                    placeholder="Tu nombre"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Empresa */}
                                        <div>
                                            <label
                                                htmlFor="empresa"
                                                className="block mb-2 text-sm font-medium"
                                                style={{ color: COLORS.TEXT.SECONDARY }}
                                            >
                                                Empresa
                                            </label>
                                            <div className="relative">
                                                <div
                                                    className="absolute left-3 top-3"
                                                    style={{ color: COLORS.TEXT.HINT }}
                                                >
                                                    <FaBuilding />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="empresa"
                                                    value={empresa}
                                                    onChange={(e) => setEmpresa(e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2"
                                                    style={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                                        color: COLORS.TEXT.PRIMARY,
                                                        caretColor: COLORS.PRIMARY.MAIN,
                                                    }}
                                                    placeholder="Nombre de tu empresa"
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block mb-2 text-sm font-medium"
                                                style={{ color: COLORS.TEXT.SECONDARY }}
                                            >
                                                Correo electrónico *
                                            </label>
                                            <div className="relative">
                                                <div
                                                    className="absolute left-3 top-3"
                                                    style={{ color: COLORS.TEXT.HINT }}
                                                >
                                                    <FaEnvelope />
                                                </div>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2"
                                                    style={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                                        color: COLORS.TEXT.PRIMARY,
                                                        caretColor: COLORS.PRIMARY.MAIN,
                                                    }}
                                                    placeholder="tu@email.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Teléfono */}
                                        <div>
                                            <label
                                                htmlFor="telefono"
                                                className="block mb-2 text-sm font-medium"
                                                style={{ color: COLORS.TEXT.SECONDARY }}
                                            >
                                                Teléfono
                                            </label>
                                            <div className="relative">
                                                <div
                                                    className="absolute left-3 top-3"
                                                    style={{ color: COLORS.TEXT.HINT }}
                                                >
                                                    <FaPhone />
                                                </div>
                                                <input
                                                    type="tel"
                                                    id="telefono"
                                                    value={telefono}
                                                    onChange={(e) => setTelefono(e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2"
                                                    style={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                                        color: COLORS.TEXT.PRIMARY,
                                                        caretColor: COLORS.PRIMARY.MAIN,
                                                    }}
                                                    placeholder="+593 98 123 4567"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Servicio de interés */}
                                    <div className="mb-6">
                                        <label
                                            className="block mb-3 text-sm font-medium"
                                            style={{ color: COLORS.TEXT.SECONDARY }}
                                        >
                                            Servicio de interés *
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {servicesList.map(service => (
                                                <button
                                                    key={service.id}
                                                    type="button"
                                                    className={`flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${servicioSeleccionado === service.id ? 'font-medium' : ''
                                                        }`}
                                                    style={{
                                                        backgroundColor: servicioSeleccionado === service.id
                                                            ? `${COLORS.PRIMARY.MAIN}30`
                                                            : 'rgba(255, 255, 255, 0.05)',
                                                        color: servicioSeleccionado === service.id
                                                            ? COLORS.PRIMARY.MAIN
                                                            : COLORS.TEXT.SECONDARY,
                                                        borderLeft: `2px solid ${servicioSeleccionado === service.id ? COLORS.PRIMARY.MAIN : 'transparent'}`
                                                    }}
                                                    onClick={() => setServicioSeleccionado(service.id)}
                                                >
                                                    <span className="mr-2">{service.icon}</span>
                                                    {service.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Mensaje */}
                                    <div className="mb-6">
                                        <label
                                            htmlFor="mensaje"
                                            className="block mb-2 text-sm font-medium"
                                            style={{ color: COLORS.TEXT.SECONDARY }}
                                        >
                                            Mensaje *
                                        </label>
                                        <textarea
                                            id="mensaje"
                                            value={mensaje}
                                            onChange={(e) => setMensaje(e.target.value)}
                                            rows={4}
                                            className="block w-full p-3 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                                color: COLORS.TEXT.PRIMARY,
                                                caretColor: COLORS.PRIMARY.MAIN,
                                            }}
                                            placeholder="Describe brevemente tu consulta..."
                                            required
                                        />
                                    </div>

                                    {/* Botón de envío */}
                                    <button
                                        type="submit"
                                        className="py-3 px-6 rounded-lg font-medium text-center flex items-center justify-center transition-all duration-300"
                                        style={{
                                            backgroundColor: COLORS.PRIMARY.MAIN,
                                            color: COLORS.TEXT.PRIMARY,
                                            boxShadow: '0 4px 10px rgba(167, 4, 4, 0.3)'
                                        }}
                                        disabled={enviando}
                                    >
                                        {enviando ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                Enviar Consulta
                                                <FaPaperPlane className="ml-2" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>

                    {/* Información de contacto */}
                    <div>
                        {/* Mapa */}
                        <motion.div
                            className="rounded-xl overflow-hidden mb-8 h-64 relative"
                            variants={formVariants}
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d814.8629519751344!2d-78.44019015204388!3d-0.35087356115242013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sec!4v1713365037178!5m2!1ses-419!2sec"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="rounded-xl"
                            ></iframe>
                        </motion.div>

                        {/* Datos de contacto */}
                        <div className="space-y-6">
                            <motion.div
                                className="flex items-start p-5 rounded-lg"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                variants={contactVariants}
                                custom={0}
                            >
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                                    style={{
                                        backgroundColor: `${COLORS.PRIMARY.MAIN}20`,
                                        color: COLORS.PRIMARY.MAIN
                                    }}
                                >
                                    <FaMapMarkerAlt size={18} />
                                </div>
                                <div>
                                    <h4
                                        className="text-lg font-medium mb-2"
                                        style={{ color: COLORS.TEXT.PRIMARY }}
                                    >
                                        Dirección
                                    </h4>
                                    <p style={{ color: COLORS.TEXT.SECONDARY }}>
                                        10 DE DICIEMBRE Y CHILLANES<br />
                                        CONJUNTO MI PASEO CASA 31<br />
                                        SANGOLQUI, ECUADOR
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                className="flex items-start p-5 rounded-lg"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                variants={contactVariants}
                                custom={1}
                            >
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                                    style={{
                                        backgroundColor: `${COLORS.SECONDARY.MAIN}20`,
                                        color: COLORS.SECONDARY.MAIN
                                    }}
                                >
                                    <FaPhone size={18} />
                                </div>
                                <div>
                                    <h4
                                        className="text-lg font-medium mb-2"
                                        style={{ color: COLORS.TEXT.PRIMARY }}
                                    >
                                        Teléfonos
                                    </h4>
                                    <p style={{ color: COLORS.TEXT.SECONDARY }}>
                                        <span className="font-medium">Fijo:</span> +593 2 352 6170<br />
                                        <span className="font-medium">Celular:</span> +593 96 005 8635<br />
                                        <span className="font-medium">WhatsApp:</span> +593 98 237 2511
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                className="flex items-start p-5 rounded-lg"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                variants={contactVariants}
                                custom={2}
                            >
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                                    style={{
                                        backgroundColor: `${COLORS.ACCENT.CREAM}20`,
                                        color: COLORS.ACCENT.CREAM
                                    }}
                                >
                                    <FaEnvelope size={18} />
                                </div>
                                <div>
                                    <h4
                                        className="text-lg font-medium mb-2"
                                        style={{ color: COLORS.TEXT.PRIMARY }}
                                    >
                                        Correo Electrónico
                                    </h4>
                                    <p style={{ color: COLORS.TEXT.SECONDARY }}>
                                        <a
                                            href="mailto:manager@expertshcargo.com"
                                            className="hover:underline"
                                        >
                                            manager@expertshcargo.com
                                        </a><br />
                                        <a
                                            href="mailto:coordination@expertshcargo.com"
                                            className="hover:underline"
                                        >
                                            coordination@expertshcargo.com
                                        </a><br />
                                        <a
                                            href="mailto:expertshcargosa@gmail.com"
                                            className="hover:underline"
                                        >
                                            expertshcargosa@gmail.com
                                        </a>
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
});

ContactForm.displayName = 'ContactForm';
export default ContactForm;