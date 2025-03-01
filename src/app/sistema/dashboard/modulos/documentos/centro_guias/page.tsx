'use client';
import { useState } from "react";
import { FaTasks, FaClipboardList, FaBolt } from "react-icons/fa";
import Asignacion from "@/components/sistema/centro_guias_components/Asignacion";
import GestionCoordinaciones from "@/components/sistema/centro_guias_components/GestionCoordinaciones";
import CoordinacionesRapidas from "@/components/sistema/centro_guias_components/CoordinacionesRapidas";
export default function Coordinaciones() {
  const [activeTab, setActiveTab] = useState<"asignacion" | "gestion" | "rapidas">("asignacion");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Gestión de Coordinaciones</h1>

      {/* Tabs */}
      <div className="tabs tabs-boxed flex justify-center mb-6">
        <button
          className={`tab ${activeTab === "asignacion" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("asignacion")}
        >
          <FaTasks className="mr-2" /> Asignación
        </button>
        <button
          className={`tab ${activeTab === "gestion" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("gestion")}
        >
          <FaClipboardList className="mr-2" /> Gestión
        </button>
        <button
          className={`tab ${activeTab === "rapidas" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("rapidas")}
        >
          <FaBolt className="mr-2" /> Rápidas
        </button>
      </div>

      {/* Contenido Dinámico */}
      <div className="p-6 bg-base-100 shadow rounded-lg">
        {activeTab === "asignacion" && <Asignacion />}
        {activeTab === "gestion" && <GestionCoordinaciones />}
        {activeTab === "rapidas" && <CoordinacionesRapidas />}
      </div>
    </div>
  );
}
