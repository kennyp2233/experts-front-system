import { useState, useEffect, useCallback } from 'react';

interface UseCatalogosLoaderProps {
    catalogFetchers: (() => Promise<any>)[];
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
            const catalogData = await Promise.all(
                catalogFetchers.map((fetcher) =>
                    fetcher().catch((err) => {
                        console.error("Error en el catálogo:", err);
                        throw new Error("Error al cargar los catálogos");
                    })
                )
            );

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
    }, [catalogFetchers, formFieldsConfig]);

    // Efecto para cargar datos al montar el componente o cuando cambia retryCount
    useEffect(() => {
        let isMounted = true;
        let timeoutId: NodeJS.Timeout | null = null;

        const loadData = async () => {
            console.log("Iniciando carga de datos...");
            setLoading(true); // Reiniciar loading antes de cada carga
            setError(null); // Limpiar cualquier error previo
            setCatalogError(null); // Limpiar error de catálogos antes de intentar cargar de nuevo

            // Iniciar la carga de catálogos
            await fetchCatalogos();

            // Si los datos se cargaron correctamente, cancelar el timeout
            if (isMounted) {
                if (timeoutId) {
                    console.log("Datos cargados a tiempo, limpiando timeout.");
                    clearTimeout(timeoutId);
                }
                setLoading(false); // Desactivar loading cuando los datos se cargan correctamente
            }
        };

        loadData(); // Ejecutar la función de carga al montar el componente

        // Establecer timeout para mostrar el mensaje de error si la operación tarda más de lo esperado
        timeoutId = setTimeout(() => {
            if (isMounted) {
                console.warn("La carga de datos está tardando más de lo esperado.");
                setError(
                    "La carga de datos está tardando más de lo esperado. Por favor, intenta nuevamente."
                );
                setLoading(false); // Desactivar loading si excede el tiempo esperado
            }
        }, 5000); // Tiempo límite de 5 segundos

        return () => {
            isMounted = false; // Cancelar la operación si el componente se desmonta
            if (timeoutId) {
                clearTimeout(timeoutId); // Limpiar el timeout para evitar efectos colaterales
            }
            console.log("Componente desmontado.");
        };
    }, [retryCount, fetchCatalogos]);

    return {
        loading,
        error,
        catalogError,
        formFields,
        retryFetch
    };
};