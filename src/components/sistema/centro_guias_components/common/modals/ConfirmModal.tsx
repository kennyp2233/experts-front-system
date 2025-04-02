// src/components/sistema/centro_guias_components/modals/ConfirmModal.tsx
import React from 'react';
import { AppIcons } from '@/utils/icons';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'danger' | 'info';
    isProcessing?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = '¿Confirmar acción?',
    message = '¿Está seguro de que desea realizar esta acción?',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'warning',
    isProcessing = false
}) => {
    if (!isOpen) return null;

    // Determinar icono y colores según el tipo
    const getTypeProps = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: <AppIcons.Error className="w-8 h-8 text-error" />,
                    confirmButtonClass: 'btn-error',
                    confirmIcon: <AppIcons.Delete className="w-4 h-4 mr-1" />
                };
            case 'info':
                return {
                    icon: <AppIcons.Info className="w-8 h-8 text-info" />,
                    confirmButtonClass: 'btn-info',
                    confirmIcon: <AppIcons.CheckCircle className="w-4 h-4 mr-1" />
                };
            case 'warning':
            default:
                return {
                    icon: <AppIcons.Warning className="w-8 h-8 text-warning" />,
                    confirmButtonClass: 'btn-warning',
                    confirmIcon: <AppIcons.Check className="w-4 h-4 mr-1" />
                };
        }
    };

    const typeProps = getTypeProps();

    return (
        <dialog className="modal modal-open">
            <div className="modal-box">
                <div className="flex items-center gap-4 mb-4">
                    {typeProps.icon}
                    <h3 className="font-bold text-lg">{title}</h3>
                </div>

                <p className="py-4">{message}</p>

                <div className="modal-action">
                    <button
                        className="btn btn-outline"
                        onClick={onClose}
                        disabled={isProcessing}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`btn ${typeProps.confirmButtonClass}`}
                        onClick={onConfirm}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Procesando...
                            </>
                        ) : (
                            <>
                                {typeProps.confirmIcon}
                                {confirmText}
                            </>
                        )}
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </dialog>
    );
};
