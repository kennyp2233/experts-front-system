interface COO {
    id: string;
    cliente: string;
    estado: "Activo" | "Pendiente";
  }
  
  const coos: COO[] = [
    { id: "COO-20250001", cliente: "Alkavat", estado: "Activo" },
    { id: "COO-20250002", cliente: "Solpacific", estado: "Pendiente" },
  ];
  
  export default function GestionCoordinaciones() {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Gestión de Coordinaciones</h2>
        <p className="mb-4">Administra los documentos COO y asigna productos a fincas.</p>
  
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
                <td>{coo.id}</td>
                <td>{coo.cliente}</td>
                <td>
                  <span className={`badge ${coo.estado === "Activo" ? "badge-success" : "badge-warning"}`}>
                    {coo.estado}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-info">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  