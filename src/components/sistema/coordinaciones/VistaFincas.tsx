'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/providers/authProvider';
import { baseUrl } from '@/api/mantenimiento/config.api';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { FaFileDownload, FaSearch, FaSpinner } from 'react-icons/fa';

export default function VistaFincas() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fincas, setFincas] = useState<any[]>([]);
  const [selectedFinca, setSelectedFinca] = useState<any>(null);
  const [guiasHijas, setGuiasHijas] = useState<any[]>([]);
  const [loadingGuias, setLoadingGuias] = useState(false);
  const [filtro, setFiltro] = useState('');

  // Cargar fincas asignadas al usuario
  useEffect(() => {
    const fetchFincas = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Asumimos que hay un endpoint para obtener las fincas asociadas al usuario
        const response = await axios.get(`${baseUrl}/usuarios/fincas`);
        setFincas(response.data);
        
        if (response.data.length > 0) {
          setSelectedFinca(response.data[0]);
        }
      } catch (error) {
        console.error('Error al cargar fincas:', error);
        dispatchMenssage('error', 'Error al cargar las fincas asociadas');
      } finally {
        setLoading(false);
      }
    };

    fetchFincas();
  }, [user]);

  // Cargar guías hijas cuando se selecciona una finca
  useEffect(() => {
    const fetchGuiasHijas = async () => {
      if (!selectedFinca) return;
      
      setLoadingGuias(true);
      try {
        const response = await axios.get(`${baseUrl}/guia_hija/finca/${selectedFinca.id_finca}`);
        setGuiasHijas(response.data);
      } catch (error) {
        console.error('Error al cargar guías hijas:', error);
        dispatchMenssage('error', 'Error al cargar las guías hijas');
      } finally {
        setLoadingGuias(false);
      }
    };

    fetchGuiasHijas();
  }, [selectedFinca]);

  const handleChangeFinca = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fincaId = parseInt(e.target.value);
    const finca = fincas.find(f => f.id_finca === fincaId);
    setSelectedFinca(finca);
  };

  const handleDownloadPDF = async (guiaId: number) => {
    try {
      // Implementar la descarga de PDF de la guía hija
      const response = await axios.get(`${baseUrl}/guia_hija/${guiaId}/pdf`, {
        responseType: 'blob'
      });
      
      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `guia-hija-${guiaId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      dispatchMenssage('success', 'Guía hija descargada correctamente');
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      dispatchMenssage('error', 'Error al descargar el PDF de la guía hija');
    }
  };

  // Filtrar guías hijas según el texto de búsqueda
  const filteredGuias = filtro 
    ? guiasHijas.filter(guia => 
        guia.numero_guia_hija.toString().includes(filtro) ||
        (guia.guia_madre && 
         (`${guia.guia_madre.prefijo}-${guia.guia_madre.secuencial}`).includes(filtro))
      ) 
    : guiasHijas;

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Portal de Fincas</h1>
      
      {fincas.length === 0 ? (
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>No tienes fincas asociadas a tu cuenta. Contacta al administrador.</span>
        </div>
      ) : (
        <>
          <div className="card bg-base-200 shadow-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Selecciona una finca</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={selectedFinca?.id_finca || ''}
                  onChange={handleChangeFinca}
                >
                  {fincas.map(finca => (
                    <option key={finca.id_finca} value={finca.id_finca}>
                      {finca.nombre_finca} ({finca.codigo_finca})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Buscar guía</span>
                </label>
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="Número de guía..." 
                    className="input input-bordered w-full"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                  />
                  <button className="btn btn-square">
                    <FaSearch />
                  </button>
                </div>
              </div>
              
              {selectedFinca && (
                <div className="stats shadow">
                  <div className="stat">
                    <div className="stat-title">Guías Disponibles</div>
                    <div className="stat-value">{guiasHijas.length}</div>
                    <div className="stat-desc">{selectedFinca.nombre_finca}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {loadingGuias ? (
            <div className="flex justify-center items-center p-8">
              <FaSpinner className="animate-spin text-4xl text-primary" />
            </div>
          ) : filteredGuias.length === 0 ? (
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>
                {filtro 
                  ? 'No se encontraron guías que coincidan con la búsqueda.' 
                  : 'No hay guías hijas asignadas a esta finca.'}
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Número de Guía</th>
                    <th>Guía Madre</th>
                    <th>Consignatario</th>
                    <th>Destino</th>
                    <th>Fecha de Vuelo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuias.map(guia => (
                    <tr key={guia.id}>
                      <td>{guia.numero_guia_hija}</td>
                      <td>
                        {guia.guia_madre 
                          ? `${guia.guia_madre.prefijo}-${guia.guia_madre.secuencial}` 
                          : 'N/A'}
                      </td>
                      <td>
                        {guia.documento_coordinacion?.consignatario?.nombre_consignatario || 'N/A'}
                      </td>
                      <td>
                        {guia.documento_coordinacion?.destino_to1?.nombre || 'N/A'}
                      </td>
                      <td>
                        {guia.documento_coordinacion?.fecha_vuelo 
                          ? new Date(guia.documento_coordinacion.fecha_vuelo).toLocaleDateString() 
                          : 'N/A'}
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => handleDownloadPDF(guia.id)}
                          title="Descargar PDF"
                        >
                          <FaFileDownload />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}