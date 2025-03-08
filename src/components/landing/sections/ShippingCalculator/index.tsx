// index.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalculator } from 'react-icons/fa';

import ShippingForm from './ShippingForm';
import ShippingResults from './ShippingResults';

import { airlines, cargoTypes, additionalServices } from './data';
import { COLORS } from '@/utils/theme'; // Ajusta la ruta según tu proyecto

const ShippingCalculator: React.FC = () => {
    // Estados de control
    const [hasCalculated, setHasCalculated] = useState<boolean>(false);
    const [isCalculating, setIsCalculating] = useState<boolean>(false);

    // Estados para mostrar en resultados
    const [airlineLabel, setAirlineLabel] = useState<string>('');
    const [cargoTypeLabel, setCargoTypeLabel] = useState<string>('');
    const [weight, setWeight] = useState<number>(10);
    const [baseRate, setBaseRate] = useState<number>(0);
    const [costByWeight, setCostByWeight] = useState<number>(0);
    const [guideCost, setGuideCost] = useState<number>(0);
    const [securityCost, setSecurityCost] = useState<number>(0);
    const [servicesBreakdown, setServicesBreakdown] = useState<{ label: string; cost: number }[]>([]);
    const [totalCost, setTotalCost] = useState<number>(0);
    const [estimatedTime, setEstimatedTime] = useState<string>('4-5');

    // Animaciones de Framer Motion para la tarjeta de resultados
    const resultVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut'
            }
        }
    };

    // Función para calcular
    const handleCalculate = (
        w: number,
        airlineValue: string,
        cargoTypeValue: string,
        selectedServices: string[]
    ) => {
        setIsCalculating(true);
        setHasCalculated(false);

        setTimeout(() => {
            try {
                const selectedAirline = airlines.find((a) => a.value === airlineValue);
                if (!selectedAirline) throw new Error('Aerolínea no encontrada');

                const selectedCargo = cargoTypes.find((c) => c.value === cargoTypeValue);
                if (!selectedCargo) throw new Error('Tipo de carga no encontrado');

                // Tarifa base = baseRate * rateModifier
                // (Aquí podrías añadir recargos de combustible si deseas)
                const rate = selectedAirline.baseRate * selectedCargo.rateModifier;
                // Costo por peso
                const costWeight = rate * w;

                // Costo fijo (guía)
                const guide = selectedAirline.guideCost;

                // Costo de seguridad (si excede el umbral)
                let secCost = 0;
                if (w > selectedAirline.securityThreshold) {
                    secCost = selectedAirline.securityCost;
                }

                // Servicios adicionales
                const chosenServices = selectedServices.map((s) => {
                    const srv = additionalServices.find((x) => x.value === s);
                    return {
                        label: srv?.label || 'Servicio desconocido',
                        cost: srv?.cost || 0
                    };
                });
                const servicesTotal = chosenServices.reduce((acc, cur) => acc + cur.cost, 0);

                // Total
                const total = costWeight + guide + secCost + servicesTotal;

                // Tiempo estimado (ejemplo simple)
                let time = '4-5';
                if (selectedAirline.value === 'klm') time = '3-4';
                if (selectedAirline.value === 'avianca') time = '2-3';
                if (selectedAirline.value === 'iberia') time = '5-6';

                // Actualizar estados
                setWeight(w);
                setAirlineLabel(selectedAirline.label);
                setCargoTypeLabel(selectedCargo.label);
                setBaseRate(rate);
                setCostByWeight(costWeight);
                setGuideCost(guide);
                setSecurityCost(secCost);
                setServicesBreakdown(chosenServices);
                setTotalCost(total);
                setEstimatedTime(time);

                setHasCalculated(true);
            } catch (err) {
                console.error(err);
            } finally {
                setIsCalculating(false);
            }
        }, 1200);
    };

    // Reset
    const handleReset = () => {
        setWeight(10);
        setAirlineLabel('');
        setCargoTypeLabel('');
        setBaseRate(0);
        setCostByWeight(0);
        setGuideCost(0);
        setSecurityCost(0);
        setServicesBreakdown([]);
        setTotalCost(0);
        setEstimatedTime('4-5');
        setHasCalculated(false);
    };

    return (
        <div className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl">
                <div className="flex items-center justify-center mb-6">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                        style={{
                            backgroundColor: `${COLORS.PRIMARY.MAIN}20`,
                            color: COLORS.PRIMARY.MAIN
                        }}
                    >
                        <FaCalculator size={24} />
                    </div>
                    <h2
                        className="text-3xl font-bold"
                        style={{ color: COLORS.TEXT.PRIMARY }}
                    >
                        Calculadora de Tarifa por Kilo
                    </h2>
                </div>

                <p
                    className="text-center mb-8"
                    style={{ color: COLORS.TEXT.SECONDARY }}
                >
                    Estima el costo de tu envío basado en peso, aerolínea, tipo de carga y servicios adicionales
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Formulario */}
                    <ShippingForm
                        onCalculate={handleCalculate}
                        isCalculating={isCalculating}
                        hasCalculated={hasCalculated}
                        onReset={handleReset}
                    />

                    {/* Resultados */}
                    <ShippingResults
                        hasCalculated={hasCalculated}
                        resultVariants={resultVariants}
                        airlineLabel={airlineLabel}
                        cargoTypeLabel={cargoTypeLabel}
                        weight={weight}
                        baseRate={baseRate}
                        costByWeight={costByWeight}
                        guideCost={guideCost}
                        securityCost={securityCost}
                        servicesBreakdown={servicesBreakdown}
                        totalCost={totalCost}
                        estimatedTime={estimatedTime}
                    />
                </div>
            </div>
        </div>
    );
};

export default ShippingCalculator;
