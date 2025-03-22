// src/components/sistema/centro_guias_components/common/CantidadesConfiguration.tsx
import React, { useState } from 'react';

interface CantidadesConfigurationProps {
    onApply: (values: {
        fulls?: number;
        pcs?: number;
        kgs?: number;
        stems?: number;
    }) => void;
    disabled?: boolean;
    defaultValues?: {
        fulls?: number;
        pcs?: number;
        kgs?: number;
        stems?: number;
    };
    compact?: boolean;
}

export const CantidadesConfiguration: React.FC<CantidadesConfigurationProps> = ({
    onApply,
    disabled = false,
    defaultValues = {},
    compact = false
}) => {
    // Estados locales para los valores de entrada
    const [fulls, setFulls] = useState<string>(defaultValues.fulls?.toString() || '');
    const [pcs, setPcs] = useState<string>(defaultValues.pcs?.toString() || '');
    const [kgs, setKgs] = useState<string>(defaultValues.kgs?.toString() || '');
    const [stems, setStems] = useState<string>(defaultValues.stems?.toString() || '');

    // Aplicar un valor individual
    const handleApplySingle = (field: 'fulls' | 'pcs' | 'kgs' | 'stems') => {
        const values: any = {};

        switch (field) {
            case 'fulls':
                if (fulls) values.fulls = Number(fulls);
                break;
            case 'pcs':
                if (pcs) values.pcs = Number(pcs);
                break;
            case 'kgs':
                if (kgs) values.kgs = Number(kgs);
                break;
            case 'stems':
                if (stems) values.stems = Number(stems);
                break;
        }

        onApply(values);
    };

    // Aplicar todos los valores no vacíos
    const handleApplyAll = () => {
        const values: any = {};

        if (fulls) values.fulls = Number(fulls);
        if (pcs) values.pcs = Number(pcs);
        if (kgs) values.kgs = Number(kgs);
        if (stems) values.stems = Number(stems);

        onApply(values);
    };

    if (compact) {
        // Versión compacta para espacios reducidos
        return (
            <div className="flex flex-wrap gap-2">
                <div className="form-control flex-1 min-w-[100px]">
                    <label className="label">
                        <span className="label-text text-xs">Fulls</span>
                    </label>
                    <input
                        type="number"
                        value={fulls}
                        onChange={(e) => setFulls(e.target.value)}
                        className="input input-bordered input-sm"
                        placeholder="0"
                        min="0"
                        disabled={disabled}
                    />
                </div>

                <div className="form-control flex-1 min-w-[100px]">
                    <label className="label">
                        <span className="label-text text-xs">PCS</span>
                    </label>
                    <input
                        type="number"
                        value={pcs}
                        onChange={(e) => setPcs(e.target.value)}
                        className="input input-bordered input-sm"
                        placeholder="0"
                        min="0"
                        disabled={disabled}
                    />
                </div>

                <div className="form-control flex-1 min-w-[100px]">
                    <label className="label">
                        <span className="label-text text-xs">KGS</span>
                    </label>
                    <input
                        type="number"
                        value={kgs}
                        onChange={(e) => setKgs(e.target.value)}
                        className="input input-bordered input-sm"
                        placeholder="0"
                        min="0"
                        step="0.1"
                        disabled={disabled}
                    />
                </div>

                <div className="form-control flex-1 min-w-[100px]">
                    <label className="label">
                        <span className="label-text text-xs">Stems</span>
                    </label>
                    <input
                        type="number"
                        value={stems}
                        onChange={(e) => setStems(e.target.value)}
                        className="input input-bordered input-sm"
                        placeholder="0"
                        min="0"
                        disabled={disabled}
                    />
                </div>

                <button
                    type="button"
                    className="btn btn-sm btn-outline self-end mb-3"
                    onClick={handleApplyAll}
                    disabled={disabled || (!fulls && !pcs && !kgs && !stems)}
                >
                    Aplicar todos
                </button>
            </div>
        );
    }

    // Versión completa con controles individuales
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Fulls</span>
                </label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        className="input input-bordered w-full"
                        placeholder="0"
                        min="0"
                        value={fulls}
                        onChange={(e) => setFulls(e.target.value)}
                        disabled={disabled}
                    />
                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleApplySingle('fulls')}
                        disabled={disabled || !fulls}
                    >
                        Aplicar
                    </button>
                </div>
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Piezas (PCS)</span>
                </label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        className="input input-bordered w-full"
                        placeholder="0"
                        min="0"
                        value={pcs}
                        onChange={(e) => setPcs(e.target.value)}
                        disabled={disabled}
                    />
                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleApplySingle('pcs')}
                        disabled={disabled || !pcs}
                    >
                        Aplicar
                    </button>
                </div>
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Peso (KGS)</span>
                </label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        className="input input-bordered w-full"
                        placeholder="0"
                        min="0"
                        step="0.1"
                        value={kgs}
                        onChange={(e) => setKgs(e.target.value)}
                        disabled={disabled}
                    />
                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleApplySingle('kgs')}
                        disabled={disabled || !kgs}
                    >
                        Aplicar
                    </button>
                </div>
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Stems</span>
                </label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        className="input input-bordered w-full"
                        placeholder="0"
                        min="0"
                        value={stems}
                        onChange={(e) => setStems(e.target.value)}
                        disabled={disabled}
                    />
                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleApplySingle('stems')}
                        disabled={disabled || !stems}
                    >
                        Aplicar
                    </button>
                </div>
            </div>

            <div className="col-span-full">
                <button
                    type="button"
                    className="btn btn-outline mt-2"
                    onClick={handleApplyAll}
                    disabled={disabled || (!fulls && !pcs && !kgs && !stems)}
                >
                    Aplicar Todos los Valores
                </button>
            </div>
        </div>
    );
};