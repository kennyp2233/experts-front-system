import { useState, useCallback } from 'react';

export interface Guia {
    id_documento_base: number;
    prefijo: number;
    secuencial: number;
}


export interface Aerolinea {
    id_aerolinea: number;
    nombre: string;
    ci_ruc: string;
    direccion: string;
    telefono: string;
    email: string;
    ciudad: string;
    pais: string;
    contacto: string;
    id_modo: number;
    maestra_guias_hijas: any[];
    codigo: string;
    prefijo_awb: string;
    codigo_cae: string;
    estado_activo: boolean;
    from1: string;
    to1: string;
    by1: string;
    to2: string;
    by2: string;
    to3: string;
    by3: string;
    afiliado_cass: string;
    guias_virtuales: any[];
}

export interface DocumentoBase {
    id: number;
    fecha: string;
    aerolinea: Aerolinea; // Cambiado de string a Aerolinea
    referencia: string;
    stock: string;
    guias: Guia[];
}

interface UseDocumentosBaseReturn {
    documentosBase: DocumentoBase[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    fetchDocumentosBase: (params?: { id?: number; page?: number; limit?: number }) => Promise<void>;
    crearDocumento: (data: {
        documento_base: Partial<DocumentoBase>;
        n_guias: number;
        secuencial_inicial: number;
        prefijo: number;
    }) => Promise<void>;
    previewDocumento: (data: {
        documento_base: Partial<DocumentoBase>;
        n_guias: number;
        secuencial_inicial: number;
        prefijo: number;
    }) => Promise<DocumentoBase | null>;
    updateDocumento: (id: number, updatedFields: Partial<DocumentoBase>) => void;
}

const useDocumentosBase = (apiBaseUrl: string): UseDocumentosBaseReturn => {
    const [documentosBase, setDocumentosBase] = useState<DocumentoBase[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const fetchDocumentosBase = useCallback(
        async (params?: { id?: number; page?: number; limit?: number }) => {
            setLoading(true);
            setError(null);
            try {
                const url = new URL(`${apiBaseUrl}/documentos_base`);

                if (params) {
                    Object.keys(params).forEach((key) => {
                        const value = (params as any)[key];
                        if (value !== undefined && value !== null) {
                            url.searchParams.append(key, value.toString());
                        }
                    });
                }

                const response = await fetch(url.toString(), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || 'Error al obtener los documentos base.');
                }

                const data = await response.json();
                setDocumentosBase(data.documentos);
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.currentPage || 1);
            } catch (err: any) {
                setError(err.message || 'Error desconocido.');
            } finally {
                setLoading(false);
            }
        },
        [apiBaseUrl]
    );

    const crearDocumento = useCallback(
        async (data: {
            documento_base: Partial<DocumentoBase>;
            n_guias: number;
            secuencial_inicial: number;
            prefijo: number;
        }) => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${apiBaseUrl}/documentos_base`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || 'Error al crear el documento base.');
                }

                // Opcional: Refrescar la lista después de crear
                await fetchDocumentosBase({ page: currentPage });
            } catch (err: any) {
                setError(err.message || 'Error desconocido.');
            } finally {
                setLoading(false);
            }
        },
        [apiBaseUrl, fetchDocumentosBase, currentPage]
    );

    const previewDocumento = useCallback(
        async (data: {
            documento_base: Partial<DocumentoBase>;
            n_guias: number;
            secuencial_inicial: number;
            prefijo: number;
        }): Promise<DocumentoBase | null> => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${apiBaseUrl}/documentos_base/preview`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    credentials: 'include',
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || 'Error al generar la vista previa.');
                }

                const documento: DocumentoBase = await response.json();
                return documento;
            } catch (err: any) {
                setError(err.message || 'Error desconocido.');
                return null;
            } finally {
                setLoading(false);
            }
        },
        [apiBaseUrl]
    );

    const updateDocumento = useCallback((id: number, updatedFields: Partial<DocumentoBase>) => {
        setDocumentosBase((prev) =>
            prev.map((doc) => (doc.id === id ? { ...doc, ...updatedFields } : doc))
        );
    }, []);

    return {
        documentosBase,
        loading,
        error,
        currentPage,
        totalPages,
        fetchDocumentosBase,
        crearDocumento,
        previewDocumento,
        updateDocumento,
    };
};

export default useDocumentosBase;
