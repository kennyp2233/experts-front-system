// src/components/sistema/datos_components/pagina-generica/useCatalogosLoader.ts
import { useState, useEffect, useCallback } from 'react';

interface UseCatalogosLoaderProps {
    catalogFetchers: any[];
    formFieldsConfig: (data: any[]) => any[];
}

export const useCatalogosLoader = ({
    catalogFetchers,
    formFieldsConfig
}: UseCatalogosLoaderProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formFields, setFormFields] = useState<any[]>([]);
    const [catalogError, setCatalogError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    // Función para reintentar la carga
    const retryFetch = useCallback(() => {
        if (error || catalogError) {
            setRetryCount(prev => prev + 1);
        }
    }, [error, catalogError]);

    // Función para convertir cualquier tipo de fetcher a una función ejecutable segura
    const safeFetcher = useCallback((fetcher: any): (() => Promise<any>) => {
        // Caso 1: Es una función normal
        if (typeof fetcher === 'function') {
            return async () => {
                try {
                    return await fetcher();
                } catch (err) {
                    console.error("Error ejecutando función fetcher:", err);
                    throw err;
                }
            };
        }

        // Caso 2: Es un método de un servicio
        if (fetcher && typeof fetcher === 'object' && 'service' in fetcher && 'method' in fetcher) {
            const { service, method } = fetcher;
            return async () => {
                if (typeof service[method] !== 'function') {
                    throw new Error(`El método ${method} no existe en el servicio proporcionado`);
                }
                try {
                    return await service[method].call(service);
                } catch (err) {
                    console.error(`Error ejecutando método ${method}:`, err);
                    throw err;
                }
            };
        }

        // Caso 3: Es un objeto con una propiedad bind (método no enlazado)
        if (fetcher && typeof fetcher === 'object' && fetcher.bind && typeof fetcher.bind === 'function') {
            return async () => {
                try {
                    // Intentar vincular el objeto a su contexto y ejecutarlo
                    return await fetcher();
                } catch (err) {
                    console.error("Error ejecutando método con bind:", err);
                    throw err;
                }
            };
        }

        // Caso 4: Es un método de servicio directo que necesita su contexto
        if (fetcher && typeof fetcher === 'object' && ('endpoint' in fetcher ||
            (fetcher.__proto__ && 'endpoint' in fetcher.__proto__))) {
            // Intentar obtener el método call para ejecutarlo en el contexto correcto
            return async () => {
                try {
                    const boundMethod = typeof fetcher.bind === 'function'
                        ? fetcher.bind(fetcher.__proto__)
                        : fetcher;
                    return await boundMethod();
                } catch (err) {
                    console.error("Error ejecutando método de servicio:", err);
                    throw err;
                }
            };
        }

        // Si no es reconocible, devolvemos una función que lanza un error
        console.error("Tipo de fetcher no reconocido:", fetcher);
        return async () => {
            throw new Error(`Tipo de fetcher no soportado: ${typeof fetcher}`);
        };
    }, []);

    // Función para cargar catálogos
    const fetchCatalogos = useCallback(async () => {
        if (catalogFetchers.length === 0) {
            // Si no hay catálogos, configurar campos del formulario sin ellos
            console.log("No hay catálogos. Configurando formulario sin catálogos.");
            setFormFields(formFieldsConfig([]));
            setLoading(false);
            return;
        }

        console.log("Iniciando carga de catálogos...");
        setLoading(true); // Asegurar que el loading se reinicia correctamente antes de cada intento

        try {
            // Convertir todos los fetchers a funciones seguras
            const safeFetchers = catalogFetchers.map((fetcher, index) => {
                const fn = safeFetcher(fetcher);
                return fn().catch((err) => {
                    console.error(`Error en el catálogo ${index}:`, err);
                    throw new Error(`Error al cargar el catálogo ${index}`);
                });
            });

            const catalogData = await Promise.all(safeFetchers);

            console.log("Datos de catálogos cargados:", catalogData);

            const allCatalogsValid = catalogData.every(
                (catalog) => Array.isArray(catalog) && catalog.length > 0
            );

            console.log("Todos los catálogos son válidos:", allCatalogsValid);

            if (!allCatalogsValid) {
                throw new Error("Uno o más catálogos están vacíos.");
            }

            setFormFields(formFieldsConfig(catalogData));
            console.log("Campos del formulario configurados con los catálogos.");
            setCatalogError(null); // Limpiar errores si la carga fue exitosa
            setRetryCount(0); // Reiniciar el contador de reintentos solo en éxito
        } catch (err) {
            console.error("Error en fetchCatalogos:", err);
            setCatalogError(
                err instanceof Error ? err.message : "Error desconocido al cargar los catálogos."
            );
        } finally {
            console.log("Finalizando carga de catálogos.");
            setLoading(false); // Asegurar que loading se apaga después de cada intento, exitoso o fallido
        }
    }, [catalogFetchers, formFieldsConfig, safeFetcher]);

    useEffect(() => {
        let isMounted = true;
        let timeoutId: NodeJS.Timeout | null = null;

        const loadData = async () => {
            console.log("Iniciando carga de datos...");
            setLoading(true);
            setError(null);
            setCatalogError(null);

            await fetchCatalogos();

            if (isMounted) {
                if (timeoutId) {
                    console.log("Datos cargados a tiempo, limpiando timeout.");
                    clearTimeout(timeoutId);
                }
                setLoading(false);
            }
        };

        loadData();

        timeoutId = setTimeout(() => {
            if (isMounted) {
                console.warn("La carga de datos está tardando más de lo esperado.");
                setError(
                    "La carga de datos está tardando más de lo esperado. Por favor, intenta nuevamente."
                );
                setLoading(false);
            }
        }, 5000);

        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId);
            console.log("Componente desmontado.");
        };
        // Se elimina fetchCatalogos del array de dependencias para evitar el re-render constante
    }, [retryCount]);

    return {
        loading,
        error,
        catalogError,
        formFields,
        retryFetch
    };
};