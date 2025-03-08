// ShippingResults.tsx
import React from 'react';
import { FaBoxOpen, FaFileInvoiceDollar, FaCalendarAlt, FaPlane } from 'react-icons/fa';

interface ShippingResultsProps {
    weight: number;
    airlineLabel: string;
    cargoTypeLabel: string;
    servicesBreakdown: { label: string; cost: number }[];
    baseRatePerKg: number;
    baseCostByWeight: number;
    guideCost: number;
    securityCostApplied: number;
    totalCost: number;
    estimatedTime: string;
}

const ShippingResults: React.FC<ShippingResultsProps> = ({
    weight,
    airlineLabel,
    cargoTypeLabel,
    servicesBreakdown,
    baseRatePerKg,
    baseCostByWeight,
    guideCost,
    securityCostApplied,
    totalCost,
    estimatedTime,
}) => {
    return (
        <div className="bg-gray-100 rounded-xl p-6 border border-gray-200 h-full flex flex-col">
            <h3 className="text-xl font-bold mb-6 text-center">
                Detalles del Cálculo
            </h3>

            <div className="grid grid-cols-1 gap-6 flex-grow">
                {/* Resumen del envío */}
                <div className="bg-white rounded-lg p-4 shadow">
                    <h4 className="text-sm font-medium mb-3 flex items-center text-gray-600">
                        <FaBoxOpen className="mr-2" />
                        RESUMEN DEL ENVÍO
                    </h4>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Aerolínea:</span>
                            <span className="font-medium">{airlineLabel}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Tipo de Carga:</span>
                            <span className="font-medium">{cargoTypeLabel}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Peso:</span>
                            <span className="font-medium">{weight} kg</span>
                        </div>
                    </div>
                </div>

                {/* Desglose de costos */}
                <div className="bg-white rounded-lg p-4 shadow">
                    <h4 className="text-sm font-medium mb-3 flex items-center text-gray-600">
                        <FaFileInvoiceDollar className="mr-2" />
                        DESGLOSE DE COSTOS
                    </h4>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Tarifa base + combustible (por kg):</span>
                            <span className="font-medium">${baseRatePerKg.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Costo por peso ({weight} kg):</span>
                            <span className="font-medium">${baseCostByWeight.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Costo fijo (guía/caja):</span>
                            <span className="font-medium">${guideCost.toFixed(2)}</span>
                        </div>

                        {securityCostApplied > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Costo de seguridad:</span>
                                <span className="font-medium">${securityCostApplied.toFixed(2)}</span>
                            </div>
                        )}

                        {servicesBreakdown.length > 0 && (
                            <div>
                                <span className="text-gray-500">Servicios adicionales:</span>
                                <div className="ml-4 mt-1 space-y-1">
                                    {servicesBreakdown.map((s, idx) => (
                                        <div key={idx} className="flex justify-between">
                                            <span className="text-gray-500">- {s.label}:</span>
                                            <span className="font-medium">${s.cost.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <hr className="border-gray-300" />

                        <div className="flex justify-between font-bold">
                            <span className="text-gray-700">TOTAL:</span>
                            <span className="text-blue-600">${totalCost.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Estimación de tiempo */}
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-blue-100 text-blue-500">
                        <FaCalendarAlt size={28} />
                    </div>
                    <div className="text-sm mb-1 text-gray-500">
                        TIEMPO ESTIMADO DE ENTREGA
                    </div>
                    <div className="text-3xl font-bold mb-2 text-gray-800">
                        {estimatedTime} días
                    </div>
                    <div className="text-sm text-center text-gray-600">
                        Una vez procesado el pedido
                    </div>
                </div>

                {/* Llamada a la acción */}
                <div className="bg-white rounded-lg p-4 text-center shadow">
                    <p className="mb-4 text-gray-600">
                        ¿Listo para realizar tu envío? Contacta con nuestro equipo para finalizar los detalles de tu pedido.
                    </p>
                    <button
                        className="py-2 px-6 rounded-md font-medium inline-flex items-center bg-green-500 text-white"
                    >
                        <FaPlane className="mr-2" />
                        Solicitar Cotización
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShippingResults;
