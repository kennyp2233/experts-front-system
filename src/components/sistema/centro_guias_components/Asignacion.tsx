import { useState } from "react";
import axios from "axios";
import { DocumentForm } from "./DocumentForm";
import { baseUrl } from "@/api/mantenimiento/config.api"; // Asegurar que baseUrl esté correcto
import { dispatchMenssage } from "@/utils/menssageDispatcher";

export default function Asignacion() {
  const handleSubmit = async (data: any) => {
    try {
      console.log("Enviando datos:", data);

      const response = await axios.post(`${baseUrl}/asignacion`, data, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("Respuesta del servidor:", response.data);
      dispatchMenssage("success", "Documento creado con éxito");
    } catch (error: any) {
      console.error("Error al enviar:", error.response?.data || error.message);
      dispatchMenssage("error", "Hubo un error al enviar el documento");
    }
  };

  return (
    <DocumentForm onSubmit={handleSubmit} />
  );
}
