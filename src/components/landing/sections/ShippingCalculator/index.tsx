// index.tsx
import React, { useState } from 'react';
import ShippingForm from './ShippingForm';
import ShippingResults from './ShippingResults';
import { cargoTypes, airlines, additionalServices } from './data';

const ShippingCalculator: React.FC = () => {
    // Estados para los resultados
    const [hasCalculated, setHasCalculated] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);

    // Estados que guardan el desglose final
    const [weight, setWeight] = useState<number>(10);
    const [airlineLabel, setAirlineLabel] = useState<string>('');
    const [cargoTypeLabel, setCargoTypeLabel] = useState<string>('');
    const [servicesBreakdown, setServicesBreakdown] = useState<{ label: string; cost: number }[]>([]);
    const [baseRatePerKg, setBaseRatePerKg] = useState<number>(0);
    const [baseCostByWeight, setBaseCostByWeight] = useState<number>(0);
    const [guideCost, setGuideCost] = useState<number>(0);
    const [securityCostApplied, setSecurityCostApplied] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number>(0);
    const [estimatedTime, setEstimatedTime] = useState<string>('4-5'); // Ejemplo por defecto

    // Función que maneja el cálculo
    const handleCalculate = (
        w: number,
        airlineValue: string,
        cargoTypeValue: string,
        selectedServices: string[]
    ) => {
        setIsCalculating(true);
        setHasCalculated(false);

        // Simulamos un delay de API
        setTimeout(() => {
            try {
                // 1) Obtener datos de aerolínea
                const selectedAirline = airlines.find(a => a.value === airlineValue);
                if (!selectedAirline) throw new Error('Aerolínea no encontrada');

                // 2) Obtener datos de tipo de carga
                const selectedCargo = cargoTypes.find(c => c.value === cargoTypeValue);
                if (!selectedCargo) throw new Error('Tipo de carga no encontrado');

                // 3) Calcular tarifa base por kg (baseRate + fuelSurcharge) * rateModifier
                const ratePerKg =
                    (selectedAirline.baseRate + selectedAirline.fuelSurcharge) *
                    selectedCargo.rateModifier;

                // 4) Costo por peso
                const costByWeight = ratePerKg * w;

                // 5) Costo fijo de guía
                const guide = selectedAirline.guideCost;

                // 6) Costo de seguridad (si excede el umbral)
                let securityCost = 0;
                if (w > selectedAirline.securityThreshold) {
                    securityCost = selectedAirline.securityCost;
                }

                // 7) Calcular costos adicionales (servicios)
                const servicesApplied = selectedServices.map(s => {
                    const srv = additionalServices.find(x => x.value === s);
                    return {
                        label: srv?.label || 'Servicio desconocido',
                        cost: srv?.cost || 0,
                    };
                });
                const additionalCost = servicesApplied.reduce((acc, cur) => acc + cur.cost, 0);

                // 8) Sumar todo
                const total = costByWeight + guide + securityCost + additionalCost;

                // 9) Tiempo estimado (ejemplo simple)
                //    Podrías basarlo en la aerolínea o en la distancia. Aquí solo un ejemplo.
                let time = '4-5';
                if (selectedAirline.value === 'klm') time = '3-4';
                if (selectedAirline.value === 'avianca') time = '2-3';
                if (selectedAirline.value === 'iberia') time = '5-6';

                // Guardar todo en estados
                setWeight(w);
                setAirlineLabel(selectedAirline.label);
                setCargoTypeLabel(selectedCargo.label);
                setServicesBreakdown(servicesApplied);
                setBaseRatePerKg(ratePerKg);
                setBaseCostByWeight(costByWeight);
                setGuideCost(guide);
                setSecurityCostApplied(securityCost);
                setTotalCost(total);
                setEstimatedTime(time);

                setHasCalculated(true);
            } catch (error) {
                console.error(error);
            } finally {
                setIsCalculating(false);
            }
        }, 1200);
    };

    return (
        <div className="max-w-5xl mx-auto my-10 p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Calculadora de Tarifas
            </h2>

            {/* Formulario */}
            <ShippingForm onCalculate={handleCalculate} isCalculating={isCalculating} />

            {/* Resultados */}
            <div className="mt-8">
                {hasCalculated ? (
                    <ShippingResults
                        weight={weight}
                        airlineLabel={airlineLabel}
                        cargoTypeLabel={cargoTypeLabel}
                        servicesBreakdown={servicesBreakdown}
                        baseRatePerKg={baseRatePerKg}
                        baseCostByWeight={baseCostByWeight}
                        guideCost={guideCost}
                        securityCostApplied={securityCostApplied}
                        totalCost={totalCost}
                        estimatedTime={estimatedTime}
                    />
                ) : (
                    <div className="text-center text-gray-500">
                        Completa el formulario y presiona "Calcular" para obtener una estimación.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShippingCalculator;
