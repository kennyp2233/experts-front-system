// data.ts
export interface CargoType {
    value: string;
    label: string;
    rateModifier: number;
}

export interface Airline {
    value: string;
    label: string;
    baseRate: number;        // Tarifa base por kg
    fuelSurcharge: number;   // Recargo de combustible por kg
    securityThreshold: number; // Límite de peso a partir del cual se cobra seguridad
    securityCost: number;    // Costo de seguridad fijo si se sobrepasa el umbral
    guideCost: number;       // Costo fijo de la guía/caja
}

export interface AdditionalService {
    value: string;
    label: string;
    cost: number;
    description: string;
}

export const cargoTypes: CargoType[] = [
    {
        value: 'fresh',
        label: 'Fresh Cut Flowers',
        rateModifier: 1.0,
    },
    {
        value: 'preserved',
        label: 'Preserved Flowers',
        rateModifier: 1.2,
    },
    {
        value: 'small',
        label: 'Pequeños Despachos',
        rateModifier: 0.9,
    },
];

export const airlines: Airline[] = [
    {
        value: 'klm',
        label: 'KLM',
        baseRate: 2.5,
        fuelSurcharge: 1.0,
        securityThreshold: 100, // A partir de 100 kg cobra seguridad
        securityCost: 25,
        guideCost: 43,
    },
    {
        value: 'avianca',
        label: 'Avianca',
        baseRate: 2.8,
        fuelSurcharge: 1.1,
        securityThreshold: 120,
        securityCost: 30,
        guideCost: 25,
    },
    {
        value: 'iberia',
        label: 'Iberia',
        baseRate: 3.0,
        fuelSurcharge: 1.2,
        securityThreshold: 80,
        securityCost: 35,
        guideCost: 50,
    },
    // Agrega las aerolíneas que necesites
];

export const additionalServices: AdditionalService[] = [
    {
        value: 'insurance',
        label: 'Seguro de Carga',
        cost: 30,
        description: 'Cobertura adicional por pérdida o daño',
    },
    // Podrías agregar más servicios si lo requieres
];
