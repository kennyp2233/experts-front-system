import { FormField } from "./types";

// Utilidades para manejar campos personalizados
export const customFieldsUtils = {
    // Extraer nombres personalizados de los campos
    extractCustomNames(fields: FormField[]): string[] {
        return fields
            .filter(field => field.custom && field.custom_name)
            .map(field => field.custom_name as string);
    },

    // Transformar valores personalizados
    transformCustomValues(initialValues: any, customNames: string[], formFields: FormField[]): Record<string, any[]> {
        const transformedData: Record<string, any[]> = {};

        customNames.forEach(customName => {
            const customDataArray = initialValues[customName] || [];
            const fieldConfig = formFields.find(field => field.custom_name === customName);

            if (!fieldConfig?.custom) return;

            const isSelect = fieldConfig.custom[0].type === 'select';

            transformedData[customName] = customDataArray.map((item: any) => {
                const newItem: Record<string, any> = {};

                if (isSelect) {
                    // Mantener todos los campos para select
                    Object.keys(item).forEach(key => {
                        newItem[key] = item[key];
                    });
                } else {
                    // Omitir claves que empiezan con 'id_'
                    Object.keys(item).forEach(key => {
                        if (!key.startsWith('id_')) {
                            newItem[key] = item[key];
                        }
                    });
                }

                return newItem;
            });
        });

        return transformedData;
    }
};