// src/components/sistema/centro_guias_components/common/Pagination.tsx
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
    compact?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    disabled = false,
    compact = false
}) => {
    if (totalPages <= 1) return null;

    if (compact) {
        return (
            <div className="flex justify-center mt-2">
                <div className="btn-group">
                    <button
                        className="btn btn-xs"
                        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                        disabled={disabled || currentPage === 1}
                    >
                        «
                    </button>
                    <button className="btn btn-xs">
                        {currentPage} / {totalPages}
                    </button>
                    <button
                        className="btn btn-xs"
                        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                        disabled={disabled || currentPage === totalPages}
                    >
                        »
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center mt-4">
            <div className="join">
                <button
                    className="join-item btn"
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={disabled || currentPage === 1}
                >
                    «
                </button>
                <button className="join-item btn">
                    Página {currentPage} de {totalPages}
                </button>
                <button
                    className="join-item btn"
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={disabled || currentPage === totalPages}
                >
                    »
                </button>
            </div>
        </div>
    );
};