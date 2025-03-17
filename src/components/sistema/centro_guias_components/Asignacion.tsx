import React, { useState } from "react";
import { DocumentForm } from "./DocumentForm";
import { coordinacionesService, CoordinationDocument } from "@/api/services/documentos/coordinacionesService";
import { dispatchMenssage } from "@/utils/menssageDispatcher";

export default function Asignacion() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Partial<CoordinationDocument>) => {
    setIsSubmitting(true);
    try {
      console.log("Enviando datos:", data);

      // Utilizar el servicio para crear la coordinación
      const response = await coordinacionesService.createDocument(data as Omit<CoordinationDocument, 'id'>);

      console.log("Respuesta del servidor:", response);
      dispatchMenssage("success", "Documento creado con éxito");

      // Opcional: redirigir a la vista de detalle o limpiar el formulario
      // router.push(`/sistema/dashboard/modulos/documentos/centro_guias/detalle/${response.id}`);
    } catch (error: any) {
      console.error("Error al enviar:", error.response?.data || error.message);
      dispatchMenssage("error",
        error.response?.data?.msg ||
        "Hubo un error al enviar el documento. Verifica los datos e intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Creación de Coordinaciones</h2>
      <p className="mb-4">
        Complete el formulario para crear un nuevo documento de coordinación.
        Seleccione primero una aerolínea para ver las guías disponibles.
      </p>

      <DocumentForm
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}