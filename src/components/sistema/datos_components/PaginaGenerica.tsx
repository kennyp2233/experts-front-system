// PaginaGenerica.tsx
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ExclamationIcon, RefreshIcon } from "@heroicons/react/solid";
import { InformationCircleIcon } from "@heroicons/react/outline";
import PaginaDatos from "./utils/paginaDatos";

interface PaginaGenericaProps {
    nombrePagina: string;
    iconoPagina: React.ReactNode;
    fetchData: () => Promise<any>;
    createData: (data: any) => Promise<any>;
    updateData: (data: any) => Promise<any>;
    deleteData: (id: any) => Promise<any>;
    catalogFetchers?: (() => Promise<any>)[];
    formFieldsConfig: (data: any[]) => any[];
    visibleColumns: Record<string, string>;
    modificationLabelId: { label: string; key: string };
    formClassName?: string;
    formClassNameOuter?: string;
}

export default function PaginaGenerica({
    nombrePagina,
    iconoPagina,
    fetchData,
    createData,
    updateData,
    deleteData,
    catalogFetchers = [],
    formFieldsConfig,
    visibleColumns,
    modificationLabelId,
    formClassName,
    formClassNameOuter,
}: PaginaGenericaProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formFields, setFormFields] = useState<any[]>([]);
    const [catalogError, setCatalogError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0); // Estado para gestionar reintentos

    // Definimos fetchCatalogos usando useCallback para que sea estable entre renders
    const fetchCatalogos = useCallback(async () => {
        if (catalogFetchers.length === 0) {
            // Si no hay catálogos, configurar campos del formulario sin ellos
            console.log("No hay catálogos. Configurando formulario sin catálogos.");
            setFormFields(formFieldsConfig([])); // Asumimos que el formulario se puede generar sin catálogos
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
    }, [retryCount]); // Dependemos de retryCount para reejecutar



    const retryFetch = () => {
        if (error || catalogError) {
            setRetryCount(prev => prev + 1);
        }
    };


    // Función para renderizar la pantalla de error
    const renderErrorScreen = (title: string, message: string, type: "error" | "warning", onRetry: () => void) => {
        const Icon = type === "error" ? ExclamationIcon : InformationCircleIcon;
        const bgColor = type === "error" ? "bg-error" : "bg-warning";
        const textColor = type === "error" ? "text-error-content" : "text-warning-content";
        const buttonColor = type === "error" ? "btn-error" : "btn-warning";
        const buttonText = type === "error" ? "Recargar" : "Intentar de nuevo";

        return (
            <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
                <div className="card w-full max-w-lg shadow-xl bg-base-100 p-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.02] }}
                        transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            delay: 0.2,
                        }}
                        className={`mx-auto w-24 h-24 ${bgColor} text-center rounded-full flex items-center justify-center mb-4`}
                    >
                        <Icon className={`h-12 w-12 ${textColor}`} aria-hidden="true" />
                    </motion.div>
                    <div className="card-body text-center">
                        <h1 className={`text-3xl font-bold ${textColor} mb-2`}>{title}</h1>
                        <p className={`text-lg ${textColor} mb-4`}>
                            {message.split("\n").map((line, index) => (
                                <span key={index}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </p>
                        <button
                            onClick={onRetry}
                            className={`btn ${buttonColor} btn-outline flex items-center justify-center`}
                        >
                            <RefreshIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                            {buttonText}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
                <div className="flex flex-col items-center">
                    <span className="loading loading-spinner loading-lg mb-4" aria-label="Cargando"></span>
                    <p className="text-xl text-base-content">Cargando datos, por favor espera...</p>
                </div>
            </div>
        );
    }

    if (catalogError) {
        return renderErrorScreen("Problema con los catálogos", catalogError, "warning", retryFetch);
    }

    if (error) {
        return renderErrorScreen("Error al cargar la página", error, "error", retryFetch);
    }

    return (
        <>
            {formFields.length > 0 && (
                <PaginaDatos
                    nombre={nombrePagina}
                    icono={React.isValidElement(iconoPagina) ? iconoPagina : <>{iconoPagina}</>}
                    fetchData={fetchData}
                    createData={createData}
                    updateData={updateData}
                    deleteData={deleteData}
                    formFields={formFields}
                    modificationLabelId={modificationLabelId}
                    visibleColumns={visibleColumns}
                    formClassName={formClassName}
                    formClassNameOuter={formClassNameOuter}
                />
            )}
        </>
    );
}

