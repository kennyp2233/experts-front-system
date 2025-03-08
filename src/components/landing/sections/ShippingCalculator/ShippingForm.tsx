// ShippingForm.tsx
import React, { useState } from 'react';
import { FaWeightHanging } from 'react-icons/fa';
import { cargoTypes, airlines, additionalServices } from './data';
import { COLORS } from '@/utils/theme'; // Ajusta la ruta según tu proyecto

interface ShippingFormProps {
    onCalculate: (
        weight: number,
        airline: string,
        cargoType: string,
        selectedServices: string[]
    ) => void;
    isCalculating: boolean;
    hasCalculated: boolean;
    onReset: () => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
    onCalculate,
    isCalculating,
    hasCalculated,
    onReset
}) => {
    const [weight, setWeight] = useState<number>(10);
    const [airline, setAirline] = useState<string>('klm');
    const [cargoType, setCargoType] = useState<string>('dry');
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    const handleServiceChange = (serviceValue: string) => {
        if (selectedServices.includes(serviceValue)) {
            setSelectedServices(selectedServices.filter(s => s !== serviceValue));
        } else {
            setSelectedServices([...selectedServices, serviceValue]);
        }
    };

    const handleCalculateClick = () => {
        onCalculate(weight, airline, cargoType, selectedServices);
    };

    return (
        <div>
            <div className="space-y-6">
                {/* Peso en kilos */}
                <div>
                    <label
                        className="block mb-2 text-sm font-medium"
                        style={{ color: COLORS.TEXT.SECONDARY }}
                    >
                        Peso en Kilos
                    </label>
                    <div className="relative">
                        <div
                            className="absolute left-3 top-3"
                            style={{ color: COLORS.TEXT.HINT }}
                        >
                            <FaWeightHanging />
                        </div>
                        <input
                            type="number"
                            value={weight}
                            min={1}
                            max={1000}
                            onChange={(e) => setWeight(parseFloat(e.target.value) || 10)}
                            className="block w-full pl-10 pr-3 py-2.5 rounded-lg border focus:outline-none"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                color: COLORS.TEXT.PRIMARY
                            }}
                        />
                    </div>
                    {/* Slider para peso */}
                    <input
                        type="range"
                        min={1}
                        max={1000}
                        step={1}
                        value={weight}
                        onChange={(e) => setWeight(parseInt(e.target.value))}
                        className="w-full mt-2"
                        style={{
                            accentColor: COLORS.PRIMARY.MAIN
                        }}
                    />
                    <div
                        className="flex justify-between text-xs mt-1"
                        style={{ color: COLORS.TEXT.HINT }}
                    >
                        <span>1kg</span>
                        <span>500kg</span>
                        <span>1000kg</span>
                    </div>
                </div>

                {/* Aerolínea */}
                <div>
                    <label
                        className="block mb-2 text-sm font-medium"
                        style={{ color: COLORS.TEXT.SECONDARY }}
                    >
                        Aerolínea
                    </label>
                    <select
                        value={airline}
                        onChange={(e) => setAirline(e.target.value)}
                        className="w-full p-3 rounded-lg border focus:outline-none"
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            color: COLORS.TEXT.PRIMARY
                        }}
                    >
                        {airlines.map((a) => (
                            <option
                                key={a.value}
                                value={a.value}
                                style={{
                                    backgroundColor: '#2A2A2A',
                                    color: COLORS.TEXT.PRIMARY
                                }}
                            >
                                {a.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tipo de Carga */}
                <div>
                    <label
                        className="block mb-2 text-sm font-medium"
                        style={{ color: COLORS.TEXT.SECONDARY }}
                    >
                        Tipo de Carga
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {cargoTypes.map((type) => (
                            <div
                                key={type.value}
                                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-center ${cargoType === type.value ? 'border-primary' : 'border-transparent'
                                    }`}
                                style={{
                                    backgroundColor:
                                        cargoType === type.value
                                            ? `${COLORS.PRIMARY.MAIN}20`
                                            : 'rgba(255, 255, 255, 0.05)',
                                    borderColor:
                                        cargoType === type.value
                                            ? COLORS.PRIMARY.MAIN
                                            : 'rgba(255, 255, 255, 0.1)',
                                    color: COLORS.TEXT.PRIMARY
                                }}
                                onClick={() => setCargoType(type.value)}
                            >
                                <div
                                    className={`w-4 h-4 rounded-full mr-2 border ${cargoType === type.value ? 'border-primary' : 'border-gray-500'
                                        }`}
                                    style={{
                                        borderColor:
                                            cargoType === type.value
                                                ? COLORS.PRIMARY.MAIN
                                                : 'rgba(255, 255, 255, 0.3)'
                                    }}
                                >
                                    {cargoType === type.value && (
                                        <div
                                            className="w-2 h-2 rounded-full m-auto mt-0.5"
                                            style={{ backgroundColor: COLORS.PRIMARY.MAIN }}
                                        />
                                    )}
                                </div>
                                {type.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Servicios adicionales */}
                <div>
                    <label
                        className="block mb-2 text-sm font-medium"
                        style={{ color: COLORS.TEXT.SECONDARY }}
                    >
                        Servicios Adicionales
                    </label>
                    <div className="space-y-2">
                        {additionalServices.map((service) => (
                            <div
                                key={service.value}
                                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${selectedServices.includes(service.value)
                                        ? 'border-primary'
                                        : 'border-transparent'
                                    }`}
                                style={{
                                    backgroundColor: selectedServices.includes(service.value)
                                        ? `${COLORS.PRIMARY.MAIN}15`
                                        : 'rgba(255, 255, 255, 0.05)',
                                    borderColor: selectedServices.includes(service.value)
                                        ? COLORS.PRIMARY.MAIN
                                        : 'rgba(255, 255, 255, 0.1)',
                                    color: COLORS.TEXT.PRIMARY
                                }}
                                onClick={() => handleServiceChange(service.value)}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{service.label}</span>
                                    <div
                                        className="px-2 py-1 rounded text-sm"
                                        style={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                            color: COLORS.TEXT.SECONDARY
                                        }}
                                    >
                                        +${service.cost}
                                    </div>
                                </div>
                                <div
                                    className="text-sm mt-1"
                                    style={{ color: COLORS.TEXT.HINT }}
                                >
                                    {service.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Botones */}
                <div className="flex gap-4 mt-6">
                    <button
                        className="flex-1 py-3 px-4 rounded-lg font-medium text-center flex items-center justify-center transition-all duration-300"
                        style={{
                            backgroundColor: COLORS.PRIMARY.MAIN,
                            color: COLORS.TEXT.PRIMARY,
                            boxShadow: `0 4px 10px ${COLORS.PRIMARY.MAIN}40`
                        }}
                        onClick={handleCalculateClick}
                        disabled={isCalculating}
                    >
                        {isCalculating ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5"
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
                            'Calcular'
                        )}
                    </button>

                    {hasCalculated && (
                        <button
                            className="py-3 px-4 rounded-lg font-medium text-center transition-all duration-300"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: COLORS.TEXT.SECONDARY
                            }}
                            onClick={onReset}
                        >
                            Reiniciar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShippingForm;
