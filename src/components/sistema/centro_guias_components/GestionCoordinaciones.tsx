import React, { useEffect, useState } from 'react';
import { coordinacionesService, CoordinationDocument } from '@/api/services/documentos/coordinacionesService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { AppIcons } from '@/utils/icons';

interface COO extends CoordinationDocument {
  cliente: string;
  estado: "Activo" | "Pendiente";
}

export default function GestionCoordinaciones() {
  const [coos, setCoos] = useState<COO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchCoordinaciones();
  }, [currentPage]);

  const fetchCoordinaciones = async () => {
    setLoading(true);
    try {
      const response = await coordinacionesService.getDocuments(currentPage, 10);
      // Transformar los datos para adaptarlos al formato esperado por el componente
      const formattedData = response.data.map(doc => ({
        ...doc,
        cliente: doc.id_consignatario?.toString() || 'Sin cliente', // Idealmente se debería mostrar el nombre del consignatario
        estado: (doc.createdAt ? "Activo" : "Pendiente") as "Activo" | "Pendiente"
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

  const handleEditClick = (id: string) => {
    // Redireccionar a la página de edición de coordinación
    // router.push(`/sistema/dashboard/modulos/documentos/centro_guias/editar/${id}`);
    console.log(`Editar coordinación: ${id}`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestión de Coordinaciones</h2>
      <p className="mb-4">Administra los documentos COO y asigna productos a fincas.</p>

      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error shadow-lg">
          <AppIcons.Close className="w-6 h-6" />
          <span>{error}</span>
        </div>
      ) : (
        <>
          <table className="table w-full">
            <thead>
              <tr>
                <th>COO</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {coos.map((coo) => (
                <tr key={coo.id}>
                  <td>COO-{coo.id.toString().padStart(7, '0')}</td>
                  <td>{coo.cliente}</td>
                  <td>
                    <span className={`badge ${coo.estado === "Activo" ? "badge-success" : "badge-warning"}`}>
                      {coo.estado}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={() => handleEditClick(coo.id.toString())}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
  );
}