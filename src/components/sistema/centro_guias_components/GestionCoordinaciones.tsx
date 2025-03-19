import React, { useEffect, useState } from 'react';
import { coordinacionesService, CoordinationDocument } from '@/api/services/documentos/coordinacionesService';
import { consignatarioService } from '@/api/services/mantenimiento/consignatarioService';
import { productosService } from '@/api/services/mantenimiento/productosService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { AppIcons } from '@/utils/icons';
import GuiasHijasList from './GuiasHijasList';

interface EnhancedCoordinationDocument extends CoordinationDocument {
  consignatarioNombre?: string;
  productoNombre?: string;
  estadoLabel?: string;
  cooLabel?: string;
}

export default function GestionCoordinaciones() {
  const [coos, setCoos] = useState<EnhancedCoordinationDocument[]>([]);
  const [consignatarios, setConsignatarios] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedCoo, setSelectedCoo] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  useEffect(() => {
    fetchCoordinaciones();
  }, [currentPage]);

  useEffect(() => {
    // Cargar catálogos para mostrar nombres
    const fetchCatalogs = async () => {
      try {
        const [consignatariosData, productosData] = await Promise.all([
          consignatarioService.getConsignatarios(),
          productosService.getProductos()
        ]);

        setConsignatarios(consignatariosData);
        setProductos(productosData);
      } catch (err) {
        console.error('Error al cargar catálogos:', err);
      }
    };

    fetchCatalogs();
  }, []);

  const fetchCoordinaciones = async () => {
    setLoading(true);
    try {
      const response = await coordinacionesService.getDocuments(currentPage, 10);

      // Transformar los datos para mostrar información más legible
      const formattedData = response.data.map(doc => ({
        ...doc,
        consignatarioNombre: 'Pendiente', // Se actualizará después
        productoNombre: 'Pendiente', // Se actualizará después
        estadoLabel: doc.createdAt ? "Activo" : "Pendiente",
        cooLabel: `COO-${doc.id.toString().padStart(7, '0')}`
      }));

      setCoos(formattedData);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error al cargar coordinaciones:', err);
      setError('No se pudieron cargar las coordinaciones');
      dispatchMenssage('error', 'Error al cargar las coordinaciones');
    } finally {
      setLoading(false);
    }
  };

  // Enriquecer datos con información de catálogos
  useEffect(() => {
    if (coos.length > 0 && consignatarios.length > 0 && productos.length > 0) {
      const enrichedData = coos.map(coo => {
        const consignatario = consignatarios.find(c => c.id_consignatario === coo.id_consignatario);
        const producto = productos.find(p => p.id_producto === coo.id_producto);

        return {
          ...coo,
          consignatarioNombre: consignatario?.nombre || 'No asignado',
          productoNombre: producto?.nombre || 'No asignado'
        };
      });

      setCoos(enrichedData);
    }
  }, [consignatarios, productos]);

  const handleViewDetails = (id: number) => {
    setSelectedCoo(id);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedCoo(null);
    setViewMode('list');
  };

  // Renderizar vista de lista
  if (viewMode === 'list') {
    return (
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="text-xl font-semibold mb-4">Gestión de Coordinaciones</h2>
          <p className="mb-4">Administra los documentos COO y visualiza las guías hijas asignadas a cada uno.</p>

          {loading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : error ? (
            <div className="alert alert-error shadow-lg">
              <AppIcons.Error className="w-6 h-6" />
              <span>{error}</span>
            </div>
          ) : coos.length === 0 ? (
            <div className="alert alert-info">
              <AppIcons.Info className="w-6 h-6" />
              <span>No hay documentos de coordinación disponibles.</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>COO</th>
                      <th>Consignatario</th>
                      <th>Producto</th>
                      <th>Fecha Vuelo</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coos.map((coo) => (
                      <tr key={coo.id} className="hover">
                        <td>{coo.cooLabel}</td>
                        <td>{coo.consignatarioNombre}</td>
                        <td>{coo.productoNombre}</td>
                        <td>
                          {coo.fecha_vuelo
                            ? new Date(coo.fecha_vuelo).toLocaleDateString()
                            : 'No definida'}
                        </td>
                        <td>
                          <span className={`badge ${coo.estadoLabel === 'Activo' ? 'badge-success' : 'badge-warning'}`}>
                            {coo.estadoLabel}
                          </span>
                        </td>
                        <td>
                          <div className="flex space-x-2">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleViewDetails(coo.id)}
                            >
                              <AppIcons.Search className="w-4 h-4" />
                              Ver
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <div className="join">
                    <button
                      className="join-item btn"
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      «
                    </button>
                    <button className="join-item btn">
                      Página {currentPage} de {totalPages}
                    </button>
                    <button
                      className="join-item btn"
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Renderizar vista de detalle
  if (viewMode === 'detail' && selectedCoo) {
    const selectedDocument = coos.find(coo => coo.id === selectedCoo);

    if (!selectedDocument) {
      return (
        <div className="alert alert-error">
          <AppIcons.Error className="w-6 h-6" />
          <span>Documento no encontrado</span>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <button
            className="btn btn-sm btn-outline mr-4"
            onClick={handleBackToList}
          >
            <AppIcons.ChevronLeft className="w-4 h-4" />
            Volver a la lista
          </button>
          <h3 className="text-xl font-bold">{selectedDocument.cooLabel}</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Detalles del documento */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-lg">Detalles de la Coordinación</h3>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm opacity-70">Consignatario</p>
                  <p className="font-medium">{selectedDocument.consignatarioNombre}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Producto</p>
                  <p className="font-medium">{selectedDocument.productoNombre}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Fecha de Vuelo</p>
                  <p className="font-medium">
                    {selectedDocument.fecha_vuelo
                      ? new Date(selectedDocument.fecha_vuelo).toLocaleDateString()
                      : 'No definida'}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Fecha de Asignación</p>
                  <p className="font-medium">
                    {selectedDocument.fecha_asignacion
                      ? new Date(selectedDocument.fecha_asignacion).toLocaleDateString()
                      : 'No definida'}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Tipo de Pago</p>
                  <p className="font-medium">
                    {selectedDocument.pago || 'No definido'}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Estado</p>
                  <p className="font-medium">
                    <span className={`badge ${selectedDocument.estadoLabel === 'Activo' ? 'badge-success' : 'badge-warning'}`}>
                      {selectedDocument.estadoLabel}
                    </span>
                  </p>
                </div>
              </div>

              {/* Sección de tarifas y valores */}
              <div className="divider">Tarifas y Valores</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm opacity-70">Costo Guía</p>
                  <p className="font-medium">
                    {selectedDocument.costo_guia_valor
                      ? `${selectedDocument.costo_guia_valor.toFixed(2)}`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Combustible</p>
                  <p className="font-medium">
                    {selectedDocument.combustible_valor
                      ? `${selectedDocument.combustible_valor.toFixed(2)}`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Seguridad</p>
                  <p className="font-medium">
                    {selectedDocument.seguridad_valor
                      ? `${selectedDocument.seguridad_valor.toFixed(2)}`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Tarifa Rate</p>
                  <p className="font-medium">
                    {selectedDocument.tarifa_rate
                      ? `${selectedDocument.tarifa_rate.toFixed(2)}`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Char Weight</p>
                  <p className="font-medium">
                    {selectedDocument.char_weight
                      ? selectedDocument.char_weight.toFixed(2)
                      : '-'}
                  </p>
                </div>
              </div>

              {/* Acciones */}
              <div className="card-actions justify-end mt-6">
                <button className="btn btn-warning">
                  <AppIcons.Edit className="w-4 h-4 mr-1" />
                  Editar
                </button>
              </div>
            </div>
          </div>

          {/* Guías hijas asociadas */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-lg">Guías Hijas Asignadas</h3>
              <GuiasHijasList filtroGuiaMadre={selectedDocument.id_guia_madre} showFilters={false} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}