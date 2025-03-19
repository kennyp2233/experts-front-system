import React, { useState, useEffect } from "react";
import { coordinacionesService } from "@/api/services/documentos/coordinacionesService";
import { fincasService } from "@/api/services/mantenimiento/fincasService";
import { guiasHijasService } from "@/api/services/documentos/guiasHijasService";
import { dispatchMenssage } from "@/utils/menssageDispatcher";

interface CoordinacionData {
  id: number;
  label: string;
}

export default function CoordinacionesRapidas() {
  const [cooSeleccionado, setCooSeleccionado] = useState<string>("");
  const [fincaSearchTerm, setFincaSearchTerm] = useState<string>("");
  const [selectedFincas, setSelectedFincas] = useState<number[]>([]);
  const [coordinaciones, setCoordinaciones] = useState<CoordinacionData[]>([]);
  const [fincas, setFincas] = useState<any[]>([]);
  const [filteredFincas, setFilteredFincas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [procesando, setProcesando] = useState<boolean>(false);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Cargar coordinaciones disponibles
        const coordsResponse = await coordinacionesService.getDocuments(1, 100);
        const coordsData = coordsResponse.data.map((coo) => ({
          id: coo.id,
          label: `COO-${coo.id.toString().padStart(7, '0')}`
        }));

        setCoordinaciones(coordsData);

        // Cargar fincas
        const fincasData = await fincasService.getFincas();
        setFincas(fincasData);
        setFilteredFincas(fincasData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        dispatchMenssage("error", "Error al cargar datos iniciales");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar fincas cuando cambia el término de búsqueda
  useEffect(() => {
    if (fincaSearchTerm.trim() === "") {
      setFilteredFincas(fincas);
    } else {
      const searchTermLower = fincaSearchTerm.toLowerCase();
      const filtered = fincas.filter(
        (finca) =>
          finca.nombre?.toLowerCase().includes(searchTermLower) ||
          finca.codigo?.toLowerCase().includes(searchTermLower)
      );
      setFilteredFincas(filtered);
    }
  }, [fincaSearchTerm, fincas]);

  // Manejar selección de finca
  const handleFincaSelect = (fincaId: number) => {
    setSelectedFincas((prev) => {
      if (prev.includes(fincaId)) {
        return prev.filter((id) => id !== fincaId);
      } else {
        return [...prev, fincaId];
      }
    });
  };

  // Realizar asignación masiva
  const handleAsignacionMasiva = async () => {
    if (!cooSeleccionado || selectedFincas.length === 0) {
      dispatchMenssage("error", "Seleccione una coordinación y al menos una finca");
      return;
    }

    setProcesando(true);
    try {
      const cooId = parseInt(cooSeleccionado);

      // Preparar datos para prevalidación
      const asignaciones = selectedFincas.map((fincaId) => ({
        id_documento_coordinacion: cooId,
        id_finca: fincaId
      }));

      // Prevalidar asignaciones
      const prevalidacion = await guiasHijasService.prevalidarAsignaciones(asignaciones);

      // Si hay nuevas asignaciones, confirmarlas
      if (prevalidacion.nuevasAsignaciones?.length > 0 || prevalidacion.asignacionesExistentes?.length > 0) {
        const resultado = await guiasHijasService.confirmarAsignaciones([
          ...(prevalidacion.asignacionesExistentes || []),
          ...(prevalidacion.nuevasAsignaciones || [])
        ]);

        // Mostrar mensaje de éxito
        const nuevas = prevalidacion.nuevasAsignaciones?.length || 0;
        const existentes = prevalidacion.asignacionesExistentes?.length || 0;

        dispatchMenssage(
          "success",
          `Asignación completada: ${nuevas} nuevas guías, ${existentes} ya existentes`
        );

        // Reiniciar formulario
        setCooSeleccionado("");
        setSelectedFincas([]);
        setFincaSearchTerm("");
      } else {
        dispatchMenssage("info", "No hay nuevas asignaciones para procesar");
      }
    } catch (error) {
      console.error("Error en asignación masiva:", error);
      dispatchMenssage("error", "Error al procesar la asignación masiva");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="text-xl font-semibold mb-4">Coordinaciones Rápidas</h2>
        <p className="mb-4">Realiza asignaciones masivas de fincas a documentos COO de manera rápida y eficiente.</p>

        {loading ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Seleccionar Documento COO</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={cooSeleccionado}
                onChange={(e) => setCooSeleccionado(e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {coordinaciones.map((coo) => (
                  <option key={coo.id} value={coo.id.toString()}>
                    {coo.label}
                  </option>
                ))}
              </select>
            </div>

            {cooSeleccionado && (
              <>
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text font-medium">Buscar Fincas</span>
                    <span className="label-text-alt">
                      {selectedFincas.length} seleccionadas
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Buscar por nombre o código..."
                    className="input input-bordered w-full"
                    value={fincaSearchTerm}
                    onChange={(e) => setFincaSearchTerm(e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <div className="divider text-sm opacity-70">Fincas Disponibles</div>

                  <div className="max-h-64 overflow-y-auto p-2 border rounded-lg">
                    {filteredFincas.length === 0 ? (
                      <div className="text-center py-4 text-sm opacity-70">
                        No se encontraron fincas con ese término de búsqueda
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {filteredFincas.map((finca) => (
                          <div
                            key={finca.id_finca}
                            className={`border rounded p-2 cursor-pointer hover:bg-base-200 transition-colors ${selectedFincas.includes(finca.id_finca)
                                ? "bg-primary/10 border-primary"
                                : ""
                              }`}
                            onClick={() => handleFincaSelect(finca.id_finca)}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="checkbox checkbox-primary mr-2"
                                checked={selectedFincas.includes(finca.id_finca)}
                                onChange={() => { }} // Manejado por el onClick del div padre
                              />
                              <div>
                                <p className="font-medium">{finca.nombre}</p>
                                <p className="text-xs opacity-70">{finca.codigo || "Sin código"}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className="btn btn-warning w-full mt-4"
                  onClick={handleAsignacionMasiva}
                  disabled={!cooSeleccionado || selectedFincas.length === 0 || procesando}
                >
                  {procesando ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Procesando...
                    </>
                  ) : (
                    <>Asignar en Masa ({selectedFincas.length} fincas)</>
                  )}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}