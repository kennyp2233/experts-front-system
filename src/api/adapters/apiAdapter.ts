// src/api/adapters/apiAdapter.ts
/**
 * Adaptador para asegurar compatibilidad entre funciones antiguas de API
 * y los nuevos servicios centralizados.
 */

type ApiFunction = () => Promise<any>;
type ApiMethod = (this: any) => Promise<any>;

/**
 * Convierte un método de servicio a una función estándar
 * para que sea compatible con código que espera funciones sin contexto.
 * 
 * @param service Servicio de API que contiene el método
 * @param methodName Nombre del método a adaptar
 * @returns Función adaptada que se puede usar como las antiguas funciones de API
 */
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

/**
 * Crea una lista de funciones de API compatibles a partir de un servicio
 * y una lista de nombres de métodos.
 * 
 * @param service Servicio de API
 * @param methodNames Lista de nombres de métodos a adaptar
 * @returns Lista de funciones adaptadas
 */
export function createCompatibleApiFunctions(
    service: any,
    methodNames: string[]
): ApiFunction[] {
    return methodNames.map(methodName => adaptServiceMethod(service, methodName));
}

/**
 * Envuelve una función de API para asegurar que siempre devuelve una promesa
 * y maneja errores de manera consistente.
 * 
 * @param apiFn Función de API original
 * @returns Función envuelta que maneja errores
 */
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

/**
 * Preparar una lista de funciones fetchers para uso en hooks
 * Funciona tanto con las funciones antiguas como con métodos de servicio adaptados
 * 
 * @param apiFunctions Lista de funciones de API o configuración de servicio
 * @returns Lista de funciones preparadas para usar en hooks
 */
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