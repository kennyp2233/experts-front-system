
type ApiFunction = () => Promise<any>;
type ApiMethod = (this: any) => Promise<any>;

export function adaptServiceMethod(service: any, methodName: string): ApiFunction {
    // Verificar que el servicio y el método existen
    if (!service || typeof service[methodName] !== 'function') {
        throw new Error(`El método ${methodName} no existe en el servicio proporcionado`);
    }

    // Retornar una función que llama al método con el contexto correcto
    return async () => {
        try {
            return await service[methodName].call(service);
        } catch (error) {
            console.error(`Error al ejecutar ${methodName}:`, error);
            throw error;
        }
    };
}

export function createCompatibleApiFunctions(
    service: any,
    methodNames: string[]
): ApiFunction[] {
    return methodNames.map(methodName => adaptServiceMethod(service, methodName));
}


export function wrapApiFunction(apiFn: ApiFunction): ApiFunction {
    return async () => {
        try {
            const result = await apiFn();
            if (result === undefined) {
                throw new Error('La función de API devolvió undefined');
            }
            return result;
        } catch (error) {
            console.error('Error en función de API:', error);
            throw error;
        }
    };
}


export function prepareApiFetchers(
    apiFunctions: (ApiFunction | { service: any; method: string })[]
): ApiFunction[] {
    return apiFunctions.map(fn => {
        // Si es un objeto de configuración, adaptar el método del servicio
        if (typeof fn === 'object' && fn !== null && 'service' in fn && 'method' in fn) {
            return wrapApiFunction(adaptServiceMethod(fn.service, fn.method));
        }
        // Si es una función, envolverla para manejo de errores consistente
        return wrapApiFunction(fn as ApiFunction);
    });
}