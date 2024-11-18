'use client';

import React, { useEffect, useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/solid';
import DocumentoBaseTable from '@/app/sistema/components/documentos_components/creacion_administracion_guias/DocumentoBaseTable';
import DocumentoBaseDetail from '@/app/sistema/components/documentos_components/creacion_administracion_guias/DocumentoBaseDetail';
import CrearDocumentoModal from '@/app/sistema/components/documentos_components/creacion_administracion_guias/CrearDocumentoModal';
import useDocumentosBase, { DocumentoBase } from '@/hooks/useDocumentosBase';
import { baseUrl } from '@/api/mantenimiento/config.api';
import { getAerolineas } from '@/api/mantenimiento/aerolineas.api';
import { getStock } from '@/api/documentos/stock.api';
import { getAgenciasIata } from '@/api/mantenimiento/agencias_iata.api';

const API_BASE_URL = baseUrl; // Reemplaza con tu URL base

const Page: React.FC = () => {
    const {
        documentosBase,
        loading,
        error,
        currentPage,
        totalPages,
        fetchDocumentosBase,
        crearDocumento,
        previewDocumento,
        updateDocumento,
    } = useDocumentosBase(API_BASE_URL);

    const [selectedDocumento, setSelectedDocumento] = useState<DocumentoBase | null>(null);
    const [aerolineas, setAerolineas] = useState<any[]>([]);
    const [stockTypes, setStockTypes] = useState<any[]>([]);
    const [agenciasIata, setAgenciasIata] = useState<any[]>([]);

    useEffect(() => {
        // Obtener la lista de aerolíneas
        getAerolineas().then((data) => {
            setAerolineas(data);
            console.log(data);
        });

        getStock().then((data) => {
            setStockTypes(data);
            console.log(data);
        });

        getAgenciasIata().then((data) => {
            setAgenciasIata(data);
            console.log(data);
        });

    }, []);



    useEffect(() => {
        // Obtener la lista inicial de documentos base
        fetchDocumentosBase({ page: currentPage });
    }, [fetchDocumentosBase, currentPage]);

    const handleDocumentoSelect = (documento: DocumentoBase) => {
        setSelectedDocumento(documento);
    };

    const handlePageChange = (page: number) => {
        fetchDocumentosBase({ page });
    };

    const handleCrearDocumento = async (data: {
        documento_base: Partial<DocumentoBase>;
        n_guias: number;
        secuencial_inicial: number;
        prefijo: number;
    }) => {
        await crearDocumento(data);
    };

    const handlePreviewDocumento = async (data: {
        documento_base: Partial<DocumentoBase>;
        n_guias: number;
        secuencial_inicial: number;
        prefijo: number;
    }): Promise<DocumentoBase | null> => {
        return await previewDocumento(data);
    };

    return (
        <>
            {/* Modal para Crear Documento Base */}
            <CrearDocumentoModal
                aerolineas={aerolineas}
                stockTypes={stockTypes}
                agenciasIata={agenciasIata}
                onPreview={handlePreviewDocumento}
                onConfirm={handleCrearDocumento}
                onClose={() => {
                    (document.getElementById('crear_documento_modal') as HTMLDialogElement)?.close();
                }}
            />

            {/* Contenido Principal */}
            <div className="w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Creación y Administración de Documentos Base</h1>
                    <button
                        className="btn btn-neutral flex items-center"
                        onClick={() => {
                            (document.getElementById('crear_documento_modal') as HTMLDialogElement)?.showModal();
                        }}
                    >
                        Crear Documento Base
                        <PlusCircleIcon className="h-6 w-6 ml-2" />
                    </button>
                </div>

                {loading && <p>Cargando...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}

                <div className="flex w-full gap-6">
                    <DocumentoBaseTable documentosBase={documentosBase} onSelect={handleDocumentoSelect} />

                    {selectedDocumento && (
                        <DocumentoBaseDetail
                            documento={selectedDocumento}
                            aerolineas={aerolineas}
                            stockTypes={stockTypes}
                            agenciasIata={agenciasIata}
                            onUpdate={updateDocumento}
                        />
                    )}
                </div>

                {/* Controles de Paginación */}
                <div className="mt-4 flex justify-center items-center">
                    <button
                        className="btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>
                    <span className="mx-4">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        className="btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </>
    );
};

export default Page;
