// src/components/sistema/centro_guias_components/views/CoordinacionMasiva.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { dispatchMenssage } from "@/utils/menssageDispatcher";

// Componentes modulares
import { DocumentoSelectionStep } from "./steps/DocumentoSelectionStep";
import { ConfigurationStep } from "./steps/ConfigurationStep";
import { PreviewStep } from "./steps/PreviewStep";
import { SuccessStep } from "./steps/SuccessStep";

// Hooks personalizados
import { useCoordinacionMasivaForm } from "./hooks/useCoordinacionMasivaForm";
import { useCatalogosCoordinaciones } from "@/components/sistema/centro_guias_components/hooks/useCatalogosCoordinaciones";

// Schema de validación
const schema = yup.object({
  documentoCoordinacionId: yup.number().required("Seleccione un documento de coordinación"),
  defaultProductoId: yup.string().nullable(),
  asignaciones: yup.array().of(
    yup.object({
      fincaId: yup.number().required("Finca requerida"),
      productoId: yup.mixed().nullable().transform(value => value === '' ? null : Number(value)),
      fulls: yup.number().nullable().transform(value => isNaN(value) || value === '' ? null : Number(value)),
      pcs: yup.number().nullable().transform(value => isNaN(value) || value === '' ? null : Number(value)),
      kgs: yup.number().nullable().transform(value => isNaN(value) || value === '' ? null : Number(value)),
      stems: yup.number().nullable().transform(value => isNaN(value) || value === '' ? null : Number(value)),
      selected: yup.boolean().default(true)
    })
  )
}).required();

export default function CoordinacionMasiva() {
  const router = useRouter();
  const [step, setStep] = useState<'selection' | 'configuration' | 'preview' | 'success'>('selection');
  const [error, setError] = useState<string | null>(null);
  const [previewResults, setPreviewResults] = useState<any | null>(null);

  // Cargar catálogos con un hook personalizado
  const {
    consignatarios,
    aerolineas,
    productos,
    agenciasIata,
    destinos,
    origenes,
    loading: loadingCatalogs
  } = useCatalogosCoordinaciones();

  // Configuración de React Hook Form
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      documentoCoordinacionId: 0,
      defaultProductoId: '',
      asignaciones: []
    }
  });

  // Hook personalizado para la lógica del formulario
  const {
    submitting,
    fields,
    filteredFincas,
    handleToggleFinca,
    handleToggleAllFincas,
    handleApplyProductToAll,
    handleApplyCantidadesToAll,
    handlePreview,
    handleConfirm,
    handleReset,
    fincaSearchTerm,
    setFincaSearchTerm
  } = useCoordinacionMasivaForm({
    methods,
    setError,
    setPreviewResults,
    setStep,
    previewResults
  });

  // Renderizado condicional por paso
  const renderStep = () => {
    switch (step) {
      case 'selection':
        return (
          <DocumentoSelectionStep
            coordinaciones={aerolineas}
            fields={fields}
            error={error}
            loading={loadingCatalogs}
            methods={methods}
            fincas={filteredFincas}
            fincaSearchTerm={fincaSearchTerm}
            setFincaSearchTerm={setFincaSearchTerm}
            handleToggleFinca={handleToggleFinca}
            handleToggleAllFincas={handleToggleAllFincas}
            onContinue={() => {
              if (!methods.getValues("documentoCoordinacionId")) {
                setError("Debe seleccionar un documento de coordinación");
                return;
              }
              if (fields.length === 0) {
                setError("Debe seleccionar al menos una finca");
                return;
              }
              setError(null);
              setStep('configuration');
            }}
          />
        );

      case 'configuration':
        return (
          <ConfigurationStep
            fields={fields}
            error={error}
            productos={productos}
            methods={methods}
            handleApplyProductToAll={handleApplyProductToAll}
            handleApplyCantidadesToAll={handleApplyCantidadesToAll}
            onBack={() => setStep('selection')}
            onPreview={handlePreview}
            submitting={submitting}
          />
        );

      case 'preview':
        return (
          <PreviewStep
            previewResults={previewResults}
            error={error}
            fincas={filteredFincas}
            productos={productos}
            coordinaciones={aerolineas}
            methods={methods}
            onBack={() => setStep('configuration')}
            onConfirm={handleConfirm}
            submitting={submitting}
          />
        );

      case 'success':
        return (
          <SuccessStep
            onReset={handleReset}
            onViewDocuments={() => router.push('/sistema/dashboard/modulos/documentos/centro_guias?tab=gestor-documentos')}
          />
        );

      default:
        return <DocumentoSelectionStep />;
    }
  };

  return renderStep();
}