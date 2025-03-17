// PaginaGenerica.tsx
import React from "react";
import PaginaDatos from "./pagina-datos/paginaDatos";
import { useCatalogosLoader } from "./pagina-generica/useCatalogosLoader";
import { ErrorScreen } from "./pagina-generica/ErrorScreen";
import { LoadingScreen } from "./pagina-generica/LoadingScreen";
import { PaginaGenericaProps } from "./pagina-generica/types";

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
    // Utilizamos un hook personalizado para gestionar la carga de catálogos
    const {
        loading,
        error,
        catalogError,
        formFields,
        retryFetch
    } = useCatalogosLoader({
        formFieldsConfig,
        catalogFetchers
    });

    // Mostrar pantalla de carga mientras se obtienen los datos
    if (loading) {
        return <LoadingScreen />;
    }

    // Mostrar pantalla de error si hay problemas con los catálogos
    if (catalogError) {
        return (
            <ErrorScreen
                title="Problema con los catálogos"
                message={catalogError}
                type="warning"
                onRetry={retryFetch}
            />
        );
    }

    // Mostrar pantalla de error si hay otros problemas
    if (error) {
        return (
            <ErrorScreen
                title="Error al cargar la página"
                message={error}
                type="error"
                onRetry={retryFetch}
            />
        );
    }

    // Renderizar PaginaDatos si todo está correcto
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