import { useState } from "react";

export default function Asignacion() {
  const [cliente, setCliente] = useState<string>("");
  const [guiaMadre, setGuiaMadre] = useState<string>("");

  /**
   * 1. Obtener catalogos como:
   * Consignatarios, Aerolineas, Tipo de embarque(producto), Shipper IATA, Aerolinea y Datos de Agencia
   * 
   * 2. Rellenar el formulario automaticamente al momento de conseguir los datos de la agencia, respectivamente.
   * 3. Rellenar en el formulario los datos asociados a la aerolinea al momento de seleccionarla.
   * 4. Tener la posibilidad de agregar clientes al documento de coordinacion
   */
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Asignación de Guías</h2>
      <p className="mb-4">Busca una entidad logística y asigna una guía madre a un cliente.</p>

      <div className="form-control">
        <label className="label">Cliente</label>
        <input
          type="text"
          placeholder="Buscar cliente..."
          className="input input-bordered w-full"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />
      </div>

      <div className="form-control mt-4">
        <label className="label">Guía Madre</label>
        <select
          className="select select-bordered w-full"
          value={guiaMadre}
          onChange={(e) => setGuiaMadre(e.target.value)}
        >
          <option value="">Seleccionar Guía Madre</option>
          <option value="074-12345678">074-12345678</option>
          <option value="074-12340987">074-12340987</option>
        </select>
      </div>

      <button className="btn btn-primary w-full mt-4" disabled={!cliente || !guiaMadre}>
        Asignar Guía
      </button>
    </div>
  );
}
