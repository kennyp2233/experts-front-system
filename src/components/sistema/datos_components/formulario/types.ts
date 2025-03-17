// Definición de tipos usados en el formulario

export interface FormField {
    label: string;
    type: string;
    key: string;
    example?: string;
    placeholder?: string;
    options?: any[];
    disabled?: boolean;
    division?: boolean;
    required?: boolean;
    pattern?: string;
    maxLength?: number;
    step?: string | number;
    min?: number;
    custom?: any;
    custom_name?: string;
    uppercase?: boolean;
}

export interface FormState {
    [key: string]: any;
}