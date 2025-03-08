// types.ts
export interface CargoType {
    value: string;
    label: string;
    rateModifier: number;
  }
  
  export interface Airline {
    value: string;
    label: string;
    baseRate: number;
    fuelSurcharge: number;
    securityThreshold: number;
    securityCost: number;
    guideCost: number;
  }
  
  export interface AdditionalService {
    value: string;
    label: string;
    cost: number;
    description: string;
  }
  