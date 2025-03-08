import React, { useState } from 'react';
import { FaPlane, FaBoxOpen, FaWeightHanging, FaCalculator, FaFileInvoice } from 'react-icons/fa';
import { motion } from 'framer-motion';
// Definir la animación simple para todo el bloque
const containerAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
};

interface CalculationResult {
    baseRate: number;
    weightCost: number;
    guideCost: number;
    securityCost: number;
    fuelCost: number;
    totalCost: number;
    airlineName: string;
    cargoTypeName: string;
    destinationName: string;
    timeEstimate: string;
}

const ShippingCalculator: React.FC = () => {
    // Estados para los inputs del formulario
    const [weight, setWeight] = useState<number>(100);
    const [cargoType, setCargoType] = useState<string>('fresh');
    const [airline, setAirline] = useState<string>('klm');
    const [destination, setDestination] = useState<string>('holanda');

    // Estados para los resultados
    const [showResults, setShowResults] = useState<boolean>(false);
    const [isCalculating, setIsCalculating] = useState<boolean>(false);
    const [calculationResults, setCalculationResults] = useState<CalculationResult | null>(null);

    // Datos de referencia simplificados
    const cargoTypes = [
        { id: 'fresh', name: 'Flores Frescas', baseRate: 1.0 },
        { id: 'preserved', name: 'Flores Preservadas', baseRate: 1.2 },
        { id: 'gypsophila', name: 'Rosas/Gypsophila', baseRate: 1.05 },
        { id: 'fruit', name: 'Frutas', baseRate: 0.9 }
    ];

    const airlines = [
        {
            id: 'klm',
            name: 'KLM',
            baseRates: {
                'holanda': 3.30,
                'eeuu': 3.50,
                'rusia': 3.80,
                'otros': 4.00
            },
            guideCost: 43,
            securityThreshold: 100,
            securityCost: 25,
            fuelSurcharge: 0.5
        },
        {
            id: 'atlas',
            name: 'Atlas Air',
            baseRates: {
                'holanda': 3.45,
                'eeuu': 3.25,
                'rusia': 3.90,
                'otros': 3.85
            },
            guideCost: 25,
            securityThreshold: 120,
            securityCost: 35,
            fuelSurcharge: 0.60
        },
        {
            id: 'otras',
            name: 'Otras aerolíneas',
            baseRates: {
                'holanda': 3.40,
                'eeuu': 3.35,
                'rusia': 3.85,
                'otros': 3.90
            },
            guideCost: 35,
            securityThreshold: 110,
            securityCost: 30,
            fuelSurcharge: 0.55
        }
    ];

    const destinations = [
        { id: 'holanda', name: 'Holanda', timeEstimate: '2-3 días' },
        { id: 'eeuu', name: 'Estados Unidos', timeEstimate: '1-2 días' },
        { id: 'rusia', name: 'Rusia', timeEstimate: '3-4 días' },
        { id: 'otros', name: 'Otros destinos', timeEstimate: '3-5 días' }
    ];

    // Método para calcular rápidamente una aproximación
    const calculateQuickEstimate = () => {
        setIsCalculating(true);

        // Simulamos una pequeña demora
        setTimeout(() => {
            try {
                // Obtenemos los datos según las selecciones
                const selectedAirline = airlines.find(a => a.id === airline);
                const selectedCargoType = cargoTypes.find(c => c.id === cargoType);
                const selectedDestination = destinations.find(d => d.id === destination);

                if (!selectedAirline || !selectedCargoType || !selectedDestination) {
                    throw new Error("Datos de selección inválidos");
                }

                // Tarifa base según aerolínea y destino
                const baseRate = selectedAirline.baseRates[destination as keyof typeof selectedAirline.baseRates] * selectedCargoType.baseRate;

                // Costo por peso
                const weightCost = baseRate * weight;

                // Recargo por combustible
                const fuelCost = selectedAirline.fuelSurcharge * weight;

                // Costo de seguridad (si aplica)
                const securityCost = weight > selectedAirline.securityThreshold ? selectedAirline.securityCost : 0;

                // Costo de guía aérea
                const guideCost = selectedAirline.guideCost;

                // Total
                const totalCost = weightCost + fuelCost + securityCost + guideCost;

                // Guardar resultados
                setCalculationResults({
                    baseRate,
                    weightCost,
                    guideCost,
                    securityCost,
                    fuelCost,
                    totalCost,
                    airlineName: selectedAirline.name,
                    cargoTypeName: selectedCargoType.name,
                    destinationName: selectedDestination.name,
                    timeEstimate: selectedDestination.timeEstimate
                });

                setShowResults(true);
            } catch (error) {
                console.error("Error en el cálculo:", error);
            } finally {
                setIsCalculating(false);
            }
        }, 500);
    };

    const resetCalculator = () => {
        setShowResults(false);
        setCalculationResults(null);
    };

    return (
        <section
            className="relative w-full py-24 px-6 lg:px-10"
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}
        >
            <motion.div
                className="w-full max-w-4xl mx-auto bg-gray-900 rounded-xl overflow-hidden shadow-xl"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={containerAnimation}
            >
                <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-red-900/30 text-red-500">
                            <FaCalculator size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-white">
                            Calculadora Rápida de Tarifas
                        </h2>
                    </div>

                    <p className="text-center mb-8 text-gray-300">
                        Aproximación de costos basada en peso, aerolínea y destino
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Formulario Simplificado */}
                        <div className="space-y-6">
                            {/* Peso */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-300">
                                    Peso en Kilos
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-gray-400">
                                        <FaWeightHanging />
                                    </div>
                                    <input
                                        type="number"
                                        value={weight}
                                        min={100}
                                        max={1500}
                                        onChange={(e) => setWeight(parseFloat(e.target.value) || 100)}
                                        className="block w-full pl-10 pr-3 py-2.5 rounded-lg border bg-gray-800/50 border-gray-700 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>
                                {/* Slider para peso */}
                                <input
                                    type="range"
                                    min={100}
                                    max={1500}
                                    step={1}
                                    value={weight}
                                    onChange={(e) => setWeight(parseInt(e.target.value))}
                                    className="w-full mt-2"
                                />
                                <div className="flex justify-between text-xs mt-1 text-gray-400">
                                    <span>100kg</span>
                                    <span>1500kg</span>
                                </div>
                            </div>

                            {/* Tipo de Carga */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-300">
                                    Tipo de Carga
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {cargoTypes.map((type) => (
                                        <div
                                            key={type.id}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-center ${cargoType === type.id
                                                ? 'border-red-500 bg-red-900/20'
                                                : 'border-gray-700 bg-gray-800/50'
                                                }`}
                                            onClick={() => setCargoType(type.id)}
                                        >
                                            <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${cargoType === type.id
                                                ? 'border-2 border-red-500'
                                                : 'border border-gray-500'
                                                }`}>
                                                {cargoType === type.id && (
                                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-300">{type.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Aerolínea */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-300">
                                    Aerolínea
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-gray-400">
                                        <FaPlane />
                                    </div>
                                    <select
                                        value={airline}
                                        onChange={(e) => setAirline(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 rounded-lg border bg-gray-800/50 border-gray-700 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    >
                                        {airlines.map((a) => (
                                            <option
                                                key={a.id}
                                                value={a.id}
                                                className="bg-gray-800 text-white"
                                            >
                                                {a.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Destino */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-300">
                                    Destino
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-gray-400">
                                        <FaPlane />
                                    </div>
                                    <select
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 rounded-lg border bg-gray-800/50 border-gray-700 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    >
                                        {destinations.map((d) => (
                                            <option
                                                key={d.id}
                                                value={d.id}
                                                className="bg-gray-800 text-white"
                                            >
                                                {d.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-4 mt-6">
                                <button
                                    className="flex-1 py-3 px-4 rounded-lg font-medium text-center flex items-center justify-center transition-all duration-300 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-600/30"
                                    onClick={calculateQuickEstimate}
                                    disabled={isCalculating}
                                >
                                    {isCalculating ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Calculando...
                                        </>
                                    ) : (
                                        'Calcular Aproximación'
                                    )}
                                </button>

                                {showResults && (
                                    <button
                                        className="py-3 px-4 rounded-lg font-medium text-center transition-all duration-300 bg-gray-700 hover:bg-gray-600 text-white"
                                        onClick={resetCalculator}
                                    >
                                        Nueva Consulta
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Resultados Simplificados */}
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-full">
                            {!showResults ? (
                                <div className="flex flex-col items-center justify-center h-full p-6">
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-red-900/20 text-red-500 opacity-40">
                                        <FaPlane size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-center text-white">
                                        Calculadora de Aproximación
                                    </h3>
                                    <p className="text-center max-w-xs text-gray-400">
                                        Completa el formulario para obtener una estimación rápida del costo de tu envío.
                                    </p>
                                    <div className="mt-4 p-3 rounded-lg text-sm text-center bg-gray-900/80 text-gray-500">
                                        Nota: Los valores son promedios aproximados y pueden variar según la temporada.
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-xl font-bold mb-6 text-center text-white border-b border-gray-700 pb-3">
                                        Aproximación de Tarifa
                                    </h3>

                                    <div className="grid grid-cols-1 gap-6">
                                        {/* Resumen del envío */}
                                        <div className="bg-gray-900/70 rounded-lg p-4">
                                            <h4 className="text-sm font-medium mb-3 flex items-center text-gray-400">
                                                <FaBoxOpen className="mr-2 text-red-500" />
                                                RESUMEN DEL ENVÍO
                                            </h4>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Aerolínea:</span>
                                                    <span className="text-white">{calculationResults?.airlineName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Tipo de Carga:</span>
                                                    <span className="text-white">{calculationResults?.cargoTypeName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Destino:</span>
                                                    <span className="text-white">{calculationResults?.destinationName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Peso:</span>
                                                    <span className="text-white">{weight} kg</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desglose simplificado */}
                                        <div className="bg-gray-900/70 rounded-lg p-4">
                                            <h4 className="text-sm font-medium mb-3 flex items-center text-gray-400">
                                                <FaFileInvoice className="mr-2 text-green-500" />
                                                DESGLOSE APROXIMADO
                                            </h4>

                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Tarifa por peso:</span>
                                                    <span className="text-white">
                                                        ${calculationResults?.weightCost.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Costo fijo (guía):</span>
                                                    <span className="text-white">
                                                        ${calculationResults?.guideCost.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Recargo combustible:</span>
                                                    <span className="text-white">
                                                        ${calculationResults?.fuelCost.toFixed(2)}
                                                    </span>
                                                </div>

                                                {(calculationResults?.securityCost ?? 0) > 0 && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Costo de seguridad:</span>
                                                        <span className="text-white">
                                                            ${calculationResults?.securityCost.toFixed(2)}
                                                        </span>
                                                    </div>
                                                )}

                                                <hr className="border-gray-700" />

                                                <div className="flex justify-between font-bold">
                                                    <span className="text-gray-300">TOTAL APROXIMADO:</span>
                                                    <span className="text-red-500 text-xl">
                                                        ${calculationResults?.totalCost.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Estimación de tiempo */}
                                        <div className="flex flex-col items-center justify-center p-4 bg-gray-900/70 rounded-lg">
                                            <div className="text-sm mb-1 text-gray-500">
                                                TIEMPO ESTIMADO
                                            </div>
                                            <div className="text-2xl font-bold mb-2 text-white">
                                                {calculationResults?.timeEstimate}
                                            </div>
                                        </div>

                                        {/* Aviso importante */}
                                        <div className="bg-yellow-900/30 border border-yellow-800/50 rounded-lg p-4 text-center">
                                            <p className="text-yellow-300 text-sm">
                                                IMPORTANTE: Esta es solo una aproximación con valores promedio.
                                                Los precios varían según temporada, disponibilidad de espacio aéreo y volumen de carga.
                                                Para una cotización exacta, contacte con nuestro equipo.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Los valores mostrados son promedios aproximados y referenciales. Las tarifas finales pueden variar según
                        disponibilidad, temporada, aerolínea específica y condiciones del servicio. Contacte a nuestro equipo para una cotización exacta.
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default ShippingCalculator;