import React from 'react';

export const DeleteConfirmationModal: React.FC = () => (
    <>
        <input type="checkbox" id="my_modal_6" className="modal-toggle" />
        <div className="modal" role="dialog">
            <div className="modal-box">
                <h3 className="font-bold text-lg flex">
                    <svg className="text-2xl text-error my-auto mr-2" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                            <path strokeDasharray={60} strokeDashoffset={60} d="M12 3L21 20H3L12 3Z">
                                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0"></animate>
                            </path>
                            <path strokeDasharray={6} strokeDashoffset={6} d="M12 10V14">
                                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="6;0"></animate>
                                <animate attributeName="stroke-width" begin="1s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2"></animate>
                            </path>
                        </g>
                        <circle cx={12} cy={17} r={1} fill="currentColor" fillOpacity={0}>
                            <animate fill="freeze" attributeName="fill-opacity" begin="0.8s" dur="0.4s" values="0;1"></animate>
                            <animate attributeName="r" begin="1.3s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="1;2;2;1;1"></animate>
                        </circle>
                    </svg>
                    <span>Advertencia</span>
                </h3>
                <p className="py-4">¿Desea eliminar los elementos seleccionados?</p>
                <div className="modal-action">
                    <button type="submit" className="btn btn-error">Eliminar</button>
                    <label htmlFor="my_modal_6" className="btn">Cerrar</label>
                </div>
            </div>
        </div>
    </>
);