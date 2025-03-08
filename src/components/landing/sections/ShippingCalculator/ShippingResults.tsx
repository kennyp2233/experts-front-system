// ShippingResults.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaFileInvoiceDollar, FaCalendarAlt, FaPlane } from 'react-icons/fa';
import { COLORS } from '@/utils/theme';

interface ServiceBreakdown {
    label: string;
    cost: number;
}

interface ShippingResultsProps {
    hasCalculated: boolean;
    resultVariants: any; // Animaciones
    airlineLabel: string;
    cargoTypeLabel: string;
    weight: number;
    baseRate: number;
    costByWeight: number;
    guideCost: number;
    securityCost: number;
    servicesBreakdown: ServiceBreakdown[];
    totalCost: number;
    estimatedTime: string;
}

const ShippingResults: React.FC<ShippingResultsProps> = ({
    hasCalculated,
    resultVariants,
    airlineLabel,
    cargoTypeLabel,
    weight,
    baseRate,
    costByWeight,
    guideCost,
    securityCost,
    servicesBreakdown,
    totalCost,
    estimatedTime
}) => {
    if (!hasCalculated) {
        // Vista "inicial" cuando no hay cálculo
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-800">
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6 opacity-40"
                    style={{
                        backgroundColor: `${COLORS.PRIMARY.MAIN}10`,
                        color: COLORS.PRIMARY.MAIN
                    }}
                >
                    <FaPlane size={32} />
                </div>
                <h3
                    className="text-xl font-bold mb-4 text-center"
                    style={{ color: COLORS.TEXT.PRIMARY }}
                >
                    Calculadora de Tarifa por Kilo
                </h3>
                <p
                    className="text-center max-w-xs"
                    style={{ color: COLORS.TEXT.SECONDARY }}
                >
                    Completa el formulario y presiona &quot;Calcular&quot; para obtener una estimación del costo de tu envío.
                </p>
                <div
                    className="mt-4 p-3 rounded-lg text-sm text-center"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: COLORS.TEXT.HINT
                    }}
                >
                    Todas las tarifas son por kilo y varían según la aerolínea, cantidad y tipo de carga.
                </div>
            </div>
        );
    }

    // Si sí hay cálculo, mostramos el desglose
    return (
        <motion.div
            variants={resultVariants}
            initial="hidden"
            animate="visible"
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 h-full flex flex-col"
        >
            <h3
                className="text-xl font-bold mb-6 text-center"
                style={{ color: COLORS.TEXT.PRIMARY }}
            >
                Detalles del Cálculo
            </h3>

            <div className="grid grid-cols-1 gap-6 flex-grow">
                {/* Resumen del envío */}
                <div className="bg-black/20 rounded-lg p-4">
                    <h4
                        className="text-sm font-medium mb-3 flex items-center"
                        style={{ color: COLORS.TEXT.SECONDARY }}
                    >
                        <FaBoxOpen className="mr-2" />
                        RESUMEN DEL ENVÍO
                    </h4>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span style={{ color: COLORS.TEXT.HINT }}>Aerolínea:</span>
                            <span style={{ color: COLORS.TEXT.PRIMARY }}>{airlineLabel}</span>
                        </div>
                        <div className="flex justify-between">
                            <span style={{ color: COLORS.TEXT.HINT }}>Tipo de Carga:</span>
                            <span style={{ color: COLORS.TEXT.PRIMARY }}>{cargoTypeLabel}</span>
                        </div>
                        <div className="flex justify-between">
                            <span style={{ color: COLORS.TEXT.HINT }}>Peso:</span>
                            <span style={{ color: COLORS.TEXT.PRIMARY }}>{weight} kg</span>
                        </div>
                    </div>
                </div>

                {/* Desglose de costos */}
                <div className="bg-black/20 rounded-lg p-4">
                    <h4
                        className="text-sm font-medium mb-3 flex items-center"
                        style={{ color: COLORS.TEXT.SECONDARY }}
                    >
                        <FaFileInvoiceDollar className="mr-2" />
                        DESGLOSE DE COSTOS
                    </h4>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span style={{ color: COLORS.TEXT.HINT }}>Tarifa base (por kg):</span>
                            <span style={{ color: COLORS.TEXT.PRIMARY }}>${baseRate.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span style={{ color: COLORS.TEXT.HINT }}>
                                Costo por peso ({weight} kg):
                            </span>
                            <span style={{ color: COLORS.TEXT.PRIMARY }}>
                                ${costByWeight.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span style={{ color: COLORS.TEXT.HINT }}>Costo fijo (guía):</span>
                            <span style={{ color: COLORS.TEXT.PRIMARY }}>
                                ${guideCost.toFixed(2)}
                            </span>
                        </div>

                        {securityCost > 0 && (
                            <div className="flex justify-between">
                                <span style={{ color: COLORS.TEXT.HINT }}>Costo de seguridad:</span>
                                <span style={{ color: COLORS.TEXT.PRIMARY }}>
                                    ${securityCost.toFixed(2)}
                                </span>
                            </div>
                        )}

                        {servicesBreakdown.length > 0 && (
                            <div>
                                <span style={{ color: COLORS.TEXT.HINT }}>Servicios adicionales:</span>
                                <div className="ml-4 mt-1 space-y-1">
                                    {servicesBreakdown.map((srv, idx) => (
                                        <div key={idx} className="flex justify-between">
                                            <span style={{ color: COLORS.TEXT.HINT }}>- {srv.label}:</span>
                                            <span style={{ color: COLORS.TEXT.PRIMARY }}>
                                                ${srv.cost.toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                        <div className="flex justify-between font-bold">
                            <span style={{ color: COLORS.TEXT.SECONDARY }}>TOTAL:</span>
                            <span style={{ color: COLORS.PRIMARY.MAIN }}>
                                ${totalCost.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Estimación de tiempo */}
                <div className="flex flex-col items-center justify-center p-6 bg-black/20 rounded-lg">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                        style={{
                            backgroundColor: `${COLORS.SECONDARY.MAIN}20`,
                            color: COLORS.SECONDARY.MAIN
                        }}
                    >
                        <FaCalendarAlt size={28} />
                    </div>
                    <div
                        className="text-sm mb-1"
                        style={{ color: COLORS.TEXT.HINT }}
                    >
                        TIEMPO ESTIMADO DE ENTREGA
                    </div>
                    <div
                        className="text-3xl font-bold mb-2"
                        style={{ color: COLORS.TEXT.PRIMARY }}
                    >
                        {estimatedTime} días
                    </div>
                    <div
                        className="text-sm text-center"
                        style={{ color: COLORS.TEXT.SECONDARY }}
                    >
                        Una vez procesado el pedido
                    </div>
                </div>

                {/* Llamada a la acción */}
                <div className="bg-black/20 rounded-lg p-4 text-center">
                    <p
                        className="mb-4"
                        style={{ color: COLORS.TEXT.SECONDARY }}
                    >
                        ¿Listo para realizar tu envío? Contacta con nuestro equipo para finalizar los detalles de tu pedido.
                    </p>
                    <button
                        className="py-2 px-6 rounded-md font-medium text-center inline-flex items-center transition-all duration-300"
                        style={{
                            backgroundColor: COLORS.SECONDARY.MAIN,
                            color: COLORS.SECONDARY.CONTRAST
                        }}
                    >
                        <FaPlane className="mr-2" />
                        Solicitar Cotización
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ShippingResults;
