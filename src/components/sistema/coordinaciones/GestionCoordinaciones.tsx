'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '@/api/mantenimiento/config.api';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import FormularioCoordinacion from './FormularioCoordinacion';
import AsignacionGuiaHija from './AsignacionGuiaHija';
import { FaPlus, FaEdit, FaTrash, FaLink } from 'react-icons/fa';
import DocumentosRoute from '@/components/sistema/documentos_components/DocumentosRoute';

export default function GestionCoordinaciones() {
    const [loading, setLoading] = useState(true);
    const [documentos, setDocumentos] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'assign'>('list');
    const [selectedDocumento, setSelectedDocumento] = useState<any>(null);
    const [filtro, setFiltro] = useState({
        fechaDesde: '',
        fechaHasta: '',
        aerolinea: ''
    });
    const [aerolineas, setAerolineas] = useState<any[]>([]);

    // Cargar documentos de coordinación
    const fetchDocumentos = async (page = 1, filtros = {}) => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...filtros
            });

            const response = await axios.get(`${baseUrl}/asignacion?${query}`);
            setDocumentos(response.data.data);
            setTotal(response.data.total);
            setCurrentPage(page);
            setTotalPages(Math.ceil(response.data.total / limit));
        } catch (error) {
            console.error('Error al cargar documentos:', error);
            dispatchMenssage('error', 'Error al cargar los documentos de coordinación');
        } finally {
            setLoading(false);
        }
    };

    // Cargar aerolíneas para filtro
    const fetchAerolineas = async () => {
        try {
            const response = await axios.get(`${baseUrl}/asignacion/aerolineas`);
            setAerolineas(response.data);
        } catch (error) {
            console.error('Error al cargar aerolíneas:', error);
        }
    };

    useEffect(() => {
        fetchDocumentos(currentPage);
        fetchAerolineas();
    }, []);

    const handleCreateSuccess = () => {
        setView('list');
        fetchDocumentos(1);
        dispatchMenssage('success', 'Operación completada con éxito');
    };

    const handleDeleteDocumento = async (id: number) => {
        if (!window.confirm('¿Está seguro de eliminar este documento de coordinación?')) return;

        try {
            await axios.delete(`${baseUrl}/asignacion/${id}`);
            dispatchMenssage('success', 'Documento eliminado correctamente');
            fetchDocumentos(currentPage);
        } catch (error: any) {
            const errorMsg = error.response?.data?.msg || 'Error al eliminar documento';
            dispatchMenssage('error', errorMsg);
        }
    };

    const handleChangePage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        fetchDocumentos(page, filtro);
    };

    const handleFilter = () => {
        const filtros: any = {};

        if (filtro.fechaDesde) {
            filtros.fechaDesde = filtro.fechaDesde;
        }

        if (filtro.fechaHasta) {
            filtros.fechaHasta = filtro.fechaHasta;
        }

        if (filtro.aerolinea) {
            filtros.aerolinea = filtro.aerolinea;
        }

        fetchDocumentos(1, filtros);
    };

    const resetFilter = () => {
        setFiltro({
            fechaDesde: '',
            fechaHasta: '',
            aerolinea: ''
        });
        fetchDocumentos(1, {});
    };

    const renderHeader = () => (
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Gestión de Coordinaciones</h1>
            {view === 'list' && (
                <button
                    className="btn btn-primary"
                    onClick={() => setView('create')}
                >
                    <FaPlus className="mr-2" /> Crear Documento
                </button>
            )}
        </div>
    );

    const renderFilters = () => (
        <div className="card bg-base-200 shadow-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Fecha desde</span>
                    </label>
                    <input
                        type="date"
                        className="input input-bordered"
                        value={filtro.fechaDesde}
                        onChange={(e) => setFiltro({ ...filtro, fechaDesde: e.target.value })}
                    />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Fecha hasta</span>
                    </label>
                    <input
                        type="date"
                        className="input input-bordered"
                        value={filtro.fechaHasta}
                        onChange={(e) => setFiltro({ ...filtro, fechaHasta: e.target.value })}
                    />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Aerolínea</span>
                    </label>
                    <select
                        className="select select-bordered"
                        value={filtro.aerolinea}
                        onChange={(e) => setFiltro({ ...filtro, aerolinea: e.target.value })}
                    >
                        <option value="">Todas las aerolíneas</option>
                        {aerolineas.map(aerolinea => (
                            <option key={aerolinea.id_aerolinea} value={aerolinea.id_aerolinea}>
                                {aerolinea.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-outline" onClick={resetFilter}>
                    Limpiar
                </button>
                <button className="btn btn-primary" onClick={handleFilter}>
                    Filtrar
                </button>
            </div>
        </div>
    );

    const renderDocumentList = () => (
        <div className="overflow-x-auto">
            {loading ? (
                <div className="flex justify-center items-center p-8">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            ) : documentos.length === 0 ? (
                <div className="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>No se encontraron documentos de coordinación.</span>
                </div>
            ) : (
                <>
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Guía Madre</th>
                                <th>Consignatario</th>
                                <th>Producto</th>
                                <th>Fecha Vuelo</th>
                                <th>Clientes</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documentos.map(doc => (
                                <tr key={doc.id}>
                                    <td>{doc.id}</td>
                                    <td>
                                        {doc.guia_madre ?
                                            `${doc.guia_madre.prefijo}-${doc.guia_madre.secuencial}` :
                                            'N/A'}
                                    </td>
                                    <td>{doc.consignatario?.nombre_consignatario || 'N/A'}</td>
                                    <td>{doc.producto?.nombre || 'N/A'}</td>
                                    <td>{new Date(doc.fecha_vuelo).toLocaleDateString()}</td>
                                    <td>{doc.coordinacion_clientes?.length || 0}</td>
                                    <td className="flex gap-2">
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => {
                                                setSelectedDocumento(doc);
                                                setView('edit');
                                            }}
                                            title="Editar"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={() => {
                                                setSelectedDocumento(doc);
                                                setView('assign');
                                            }}
                                            title="Asignar Guía Hija"
                                        >
                                            <FaLink />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-error"
                                            onClick={() => handleDeleteDocumento(doc.id)}
                                            title="Eliminar"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Paginación */}
                    <div className="flex justify-center mt-4">
                        <div className="join">
                            <button
                                className="join-item btn"
                                onClick={() => handleChangePage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                «
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
                                    onClick={() => handleChangePage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                className="join-item btn"
                                onClick={() => handleChangePage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                »
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <DocumentosRoute
                icon={<FaLink />}
                titulo="Gestión de Coordinaciones"
                desde="sistema"
            />

            {renderHeader()}

            {view === 'list' && (
                <>
                    {renderFilters()}
                    {renderDocumentList()}
                </>
            )}

            {view === 'create' && (
                <FormularioCoordinacion
                    onSuccess={handleCreateSuccess}
                />
            )}

            {view === 'edit' && selectedDocumento && (
                <FormularioCoordinacion
                    initialData={selectedDocumento}
                    isEditing={true}
                    onSuccess={handleCreateSuccess}
                />
            )}

            {view === 'assign' && selectedDocumento && (
                <AsignacionGuiaHija
                    documentoCoordinacionId={selectedDocumento.id}
                    guiaMadreId={selectedDocumento.id_guia_madre}
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setView('list')}
                />
            )}
        </div>
    );
}