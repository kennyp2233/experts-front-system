// src/hooks/centro_guias/useCoordinacionMasivaForm.ts
import { useState, useEffect } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { guiasHijasService } from '@/api/services/documentos/guiasHijasService';
import { fincasService } from '@/api/services/mantenimiento/fincasService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';

interface UseCoordinacionMasivaFormProps {
    methods: UseFormReturn<any>;
    setError: (error: string | null) => void;
    setPreviewResults: (results: any) => void;
    setStep: (step: 'selection' | 'configuration' | 'preview' | 'success') => void;
    previewResults: any;
}

export const useCoordinacionMasivaForm = ({
    methods,
    setError,
    setPreviewResults,
    setStep,
    previewResults
}: UseCoordinacionMasivaFormProps) => {
    // Estados
    const [fincas, setFincas] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [fincaSearchTerm, setFincaSearchTerm] = useState("");
    const [filteredFincas, setFilteredFincas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // React Hook Form
    const { watch, setValue } = methods;
    const watchDocumentoId = watch("documentoCoordinacionId");
    const watchDefaultProductoId = watch("defaultProductoId");

    // Field Array para asignaciones
    const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name: "asignaciones"
    });

    // Cargar fincas
    useEffect(() => {
        const fetchFincas = async () => {
            setLoading(true);
            try {
                const fincasData = await fincasService.getFincas();
                setFincas(fincasData);
                setFilteredFincas(fincasData);
            } catch (error) {
                console.error("Error al cargar fincas:", error);
                dispatchMenssage("error", "Error al cargar fincas");
            } finally {
                setLoading(false);
            }
        };

        fetchFincas();
    }, []);

    // Filtrar fincas según término de búsqueda
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

    // Función para seleccionar o deseleccionar una finca individual
    const handleToggleFinca = (fincaId: number) => {
        const existingIndex = fields.findIndex(field => field.fincaId === fincaId);

        if (existingIndex >= 0) {
            // La finca ya está seleccionada, eliminarla
            remove(existingIndex);
        } else {
            // Agregar la finca
            const finca = fincas.find(f => f.id_finca === fincaId);
            if (finca) {
                append({
                    fincaId: finca.id_finca,
                    productoId: watchDefaultProductoId || null,
                    fulls: null,
                    pcs: null,
                    kgs: null,
                    stems: null,
                    selected: true
                });
            }
        }
    };

    // Manejar selección/deselección de todas las fincas
    const handleToggleAllFincas = () => {
        if (filteredFincas.length > 0) {
            const filteredIds = filteredFincas.map(finca => finca.id_finca);
            const allSelected = filteredIds.every(id =>
                fields.some(field => field.fincaId === id)
            );

            if (allSelected) {
                // Deseleccionar todas las fincas filtradas
                const newAsignaciones = fields.filter(field =>
                    !filteredIds.includes(field.fincaId)
                );
                setValue("asignaciones", newAsignaciones);
            } else {
                // Seleccionar todas las fincas filtradas que aún no están seleccionadas
                const existingFincaIds = fields.map(field => field.fincaId);
                const fincasToAdd = filteredFincas
                    .filter(finca => !existingFincaIds.includes(finca.id_finca))
                    .map(finca => ({
                        fincaId: finca.id_finca,
                        productoId: watchDefaultProductoId || null,
                        fulls: null,
                        pcs: null,
                        kgs: null,
                        stems: null,
                        selected: true
                    }));

                setValue("asignaciones", [...fields, ...fincasToAdd]);
            }
        }
    };

    // Aplicar producto a todas las fincas seleccionadas
    const handleApplyProductToAll = () => {
        if (!watchDefaultProductoId) return;

        const updatedAsignaciones = fields.map(field => ({
            ...field,
            productoId: watchDefaultProductoId
        }));

        setValue("asignaciones", updatedAsignaciones);
    };

    // Aplicar cantidades a todas las fincas
    const handleApplyCantidadesToAll = (values: { fulls?: number, pcs?: number, kgs?: number, stems?: number }) => {
        const updatedAsignaciones = fields.map(field => ({
            ...field,
            ...Object.fromEntries(
                Object.entries(values).filter(([_, value]) => value !== undefined && value !== null)
            )
        }));

        setValue("asignaciones", updatedAsignaciones);
    };

    // Validar y previsualizar asignaciones
    const handlePreview = async () => {
        if (fields.length === 0) {
            setError("Debe seleccionar al menos una finca");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            // Preparar datos para pre-validación
            const asignaciones = fields.map(field => ({
                id_documento_coordinacion: Number(watchDocumentoId),
                id_finca: field.fincaId,
                id_producto: field.productoId,
                fulls: field.fulls,
                pcs: field.pcs,
                kgs: field.kgs,
                stems: field.stems
            }));

            // Llamar a la API de pre-validación
            const resultados = await guiasHijasService.prevalidarAsignaciones(asignaciones);
            setPreviewResults(resultados);
            setStep('preview');
        } catch (error) {
            console.error('Error al pre-validar asignaciones:', error);
            setError('Error al validar las asignaciones. Por favor, verifique los datos e intente nuevamente.');
            dispatchMenssage('error', 'Error al pre-validar asignaciones');
        } finally {
            setSubmitting(false);
        }
    };

    // Confirmar asignaciones
    const handleConfirm = async () => {
        if (!previewResults) return;

        setSubmitting(true);

        try {
            // Confirmar todas las asignaciones (nuevas y existentes)
            await guiasHijasService.confirmarAsignaciones([
                ...(previewResults.asignacionesExistentes || []),
                ...(previewResults.nuevasAsignaciones || [])
            ]);

            const nuevas = previewResults.nuevasAsignaciones?.length || 0;
            const existentes = previewResults.asignacionesExistentes?.length || 0;

            dispatchMenssage(
                'success',
                `Asignación completada: ${nuevas} nuevas guías, ${existentes} actualizadas`
            );

            setStep('success');
        } catch (error) {
            console.error('Error al confirmar asignaciones:', error);
            setError('Error al confirmar las asignaciones. Por favor, intente nuevamente.');
            dispatchMenssage('error', 'Error al confirmar asignaciones');
        } finally {
            setSubmitting(false);
        }
    };

    // Reiniciar el formulario
    const handleReset = () => {
        setValue("documentoCoordinacionId", 0);
        setValue("defaultProductoId", "");
        setValue("asignaciones", []);
        setPreviewResults(null);
        setError(null);
        setStep('selection');
    };

    return {
        loading,
        submitting,
        fields,
        filteredFincas,
        fincaSearchTerm,
        setFincaSearchTerm,
        handleToggleFinca,
        handleToggleAllFincas,
        handleApplyProductToAll,
        handleApplyCantidadesToAll,
        handlePreview,
        handleConfirm,
        handleReset
    };
};