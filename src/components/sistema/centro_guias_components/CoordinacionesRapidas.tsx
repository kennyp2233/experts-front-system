import { useState } from "react";

export default function CoordinacionesRapidas() {
  const [cooSeleccionado, setCooSeleccionado] = useState<string>("");
  const [finca, setFinca] = useState<string>("");

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Coordinaciones Rápidas</h2>
      <p className="mb-4">Realiza asignaciones masivas de fincas a documentos COO.</p>

      <div className="form-control">
        <label className="label">Seleccionar Documentos COO</label>
        <select
          className="select select-bordered w-full"
          value={cooSeleccionado}
          onChange={(e) => setCooSeleccionado(e.target.value)}
        >
          <option value="">Seleccionar...</option>
          <option value="COO-20250001">COO-20250001</option>
          <option value="COO-20250002">COO-20250002</option>
        </select>
      </div>

      <div className="form-control mt-4">
        <label className="label">Fincas a Asignar</label>
        <input
          type="text"
          placeholder="Buscar finca..."
          className="input input-bordered w-full"
          value={finca}
          onChange={(e) => setFinca(e.target.value)}
        />
      </div>

      <button className="btn btn-warning w-full mt-4" disabled={!cooSeleccionado || !finca}>
        Asignar en Masa
      </button>
    </div>
  );
}
