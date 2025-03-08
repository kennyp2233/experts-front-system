// ShippingForm.tsx
import React, { useState } from 'react';
import { FaWeightHanging } from 'react-icons/fa';
import { cargoTypes, airlines, additionalServices } from './data';

interface ShippingFormProps {
    onCalculate: (
        weight: number,
        airlineValue: string,
        cargoTypeValue: string,
        selectedServices: string[]
    ) => void;
    isCalculating: boolean;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ onCalculate, isCalculating }) => {
    const [weight, setWeight] = useState<number>(10);
    const [airline, setAirline] = useState<string>('klm');
    const [cargoType, setCargoType] = useState<string>('fresh');
    const [services, setServices] = useState<string[]>([]);

    const handleServiceChange = (serviceValue: string) => {
        if (services.includes(serviceValue)) {
            setServices(services.filter(s => s !== serviceValue));
        } else {
            setServices([...services, serviceValue]);
        }
    };

    const handleSubmit = () => {
        onCalculate(weight, airline, cargoType, services);
    };

    const resetForm = () => {
        setWeight(10);
        setAirline('klm');
        setCargoType('fresh');
        setServices([]);
    };

    return (
        <div className="space-y-6">
            {/* Peso en kilos */}
            <div>
                <label className="block mb-2 text-sm font-medium">
                    Peso en Kilos
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                        <FaWeightHanging />
                    </div>
                    <input
                        type="number"
                        value={weight}
                        min={1}
                        max={1000}
                        onChange={(e) => setWeight(parseFloat(e.target.value) || 10)}
                        className="block w-full pl-10 pr-3 py-2.5 rounded-lg border focus:outline-none"
                    />
                </div>
                {/* Slider para peso (opcional) */}
                <input
                    type="range"
                    min={1}
                    max={1000}
                    step={1}
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                    className="w-full mt-2"
                />
            </div>

            {/* Aerolínea */}
            <div>
                <label className="block mb-2 text-sm font-medium">
                    Aerolínea
                </label>
                <select
                    value={airline}
                    onChange={(e) => setAirline(e.target.value)}
                    className="w-full p-3 rounded-lg border focus:outline-none"
                >
                    {airlines.map(a => (
                        <option key={a.value} value={a.value}>
                            {a.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tipo de carga */}
            <div>
                <label className="block mb-2 text-sm font-medium">
                    Tipo de Carga
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {cargoTypes.map(type => (
                        <div
                            key={type.value}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-center ${cargoType === type.value ? 'border-blue-500' : 'border-gray-300'
                                }`}
                            onClick={() => setCargoType(type.value)}
                        >
                            <div
                                className={`w-4 h-4 rounded-full mr-2 border ${cargoType === type.value ? 'border-blue-500' : 'border-gray-500'
                                    }`}
                            >
                                {cargoType === type.value && (
                                    <div className="w-2 h-2 rounded-full m-auto mt-0.5 bg-blue-500" />
                                )}
                            </div>
                            {type.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Servicios adicionales */}
            <div>
                <label className="block mb-2 text-sm font-medium">
                    Servicios Adicionales
                </label>
                <div className="space-y-2">
                    {additionalServices.map(service => (
                        <div
                            key={service.value}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${services.includes(service.value) ? 'border-blue-500' : 'border-gray-300'
                                }`}
                            onClick={() => handleServiceChange(service.value)}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{service.label}</span>
                                <div className="px-2 py-1 rounded text-sm bg-gray-200 text-gray-800">
                                    +${service.cost}
                                </div>
                            </div>
                            <div className="text-sm mt-1 text-gray-500">
                                {service.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 mt-6">
                <button
                    className="flex-1 py-3 px-4 rounded-lg font-medium text-center bg-blue-600 text-white"
                    onClick={handleSubmit}
                    disabled={isCalculating}
                >
                    {isCalculating ? 'Calculando...' : 'Calcular'}
                </button>

                <button
                    className="py-3 px-4 rounded-lg font-medium text-center bg-gray-200 text-gray-700"
                    onClick={resetForm}
                >
                    Reiniciar
                </button>
            </div>
        </div>
    );
};

export default ShippingForm;
