// src/components/sistema/common/form/Form.tsx
import React from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { AppIcons } from '@/utils/icons';

interface FormProps {
    children: React.ReactNode;
    methods: UseFormReturn<any>;
    onSubmit: (data: any) => void;
    submitText?: string;
    cancelText?: string;
    onCancel?: () => void;
    isSubmitting?: boolean;
    showActions?: boolean;
    className?: string;
    submitIcon?: React.ReactNode;
    cancelIcon?: React.ReactNode;
    error?: string;
    successMessage?: string;
    resetOnSuccess?: boolean;
    hideSubmitButton?: boolean;
    submitButtonClass?: string;
}

export const Form: React.FC<FormProps> = ({
    children,
    methods,
    onSubmit,
    submitText = 'Guardar',
    cancelText = 'Cancelar',
    onCancel,
    isSubmitting = false,
    showActions = true,
    className = '',
    submitIcon = <AppIcons.Check className="w-4 h-4 mr-1" />,
    cancelIcon = <AppIcons.Close className="w-4 h-4 mr-1" />,
    error,
    successMessage,
    resetOnSuccess = false,
    hideSubmitButton = false,
    submitButtonClass = 'btn-primary',
}) => {
    const handleSubmit = async (data: any) => {
        await onSubmit(data);
        if (resetOnSuccess) {
            methods.reset();
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)} className={className} noValidate>
                {error && (
                    <div className="alert alert-error mb-4">
                        <AppIcons.Error className="w-6 h-6" />
                        <span>{error}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="alert alert-success mb-4">
                        <AppIcons.CheckCircle className="w-6 h-6" />
                        <span>{successMessage}</span>
                    </div>
                )}

                {children}

                {showActions && (
                    <div className="flex justify-end gap-2 mt-4">
                        {onCancel && (
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={onCancel}
                                disabled={isSubmitting}
                            >
                                {cancelIcon}
                                {cancelText}
                            </button>
                        )}

                        {!hideSubmitButton && (
                            <button
                                type="submit"
                                className={`btn ${submitButtonClass}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        {submitIcon}
                                        {submitText}
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                )}
            </form>
        </FormProvider>
    );
};