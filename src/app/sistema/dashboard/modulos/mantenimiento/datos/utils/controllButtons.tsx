import React from "react";

export default function ControlButtons({ handleCrear, handleModificar, handleEliminar }: { handleCrear?: () => void, handleModificar?: () => void, handleEliminar?: () => void }) {
    return (
        <>
            <h2 className="text-xl self-start max-sm:text-lg">Acciones:</h2>
            <div className="grid grid-cols-3 w-full gap-3 max-md:grid-cols-2 max-sm:grid-cols-1 h-fit ">
                <button className="btn btn-primary max-md:col-span-2 max-sm:col-auto" onClick={handleCrear}>
                    <svg className="text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><defs><mask id="ipSAddOne0"><g fill="none" strokeLinejoin="round" strokeWidth={4}><path fill="#fff" stroke="#fff" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"></path><path stroke="#000" strokeLinecap="round" d="M24 16v16m-8-8h16"></path></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSAddOne0)"></path></svg>
                    Crear
                </button>
                <button className="btn btn-warning" onClick={handleModificar}>
                    <svg className="text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><defs><mask id="ipSModify0"><g fill="none"><path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="m20.07 9.586l-4.242-4.243a2 2 0 0 0-2.828 0L7.343 11a2 2 0 0 0 0 2.829l4.243 4.242m17.343 19.343l4.242 4.243a2 2 0 0 0 2.829 0L41.657 36a2 2 0 0 0 0-2.828l-4.243-4.243"></path><rect width={12} height={42} x={34.606} y={4.908} fill="#fff" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} rx={2} transform="rotate(45 34.606 4.908)"></rect><circle cx={24} cy={24} r={2} fill="#000"></circle><circle cx={20} cy={28} r={2} fill="#000"></circle><circle cx={28} cy={20} r={2} fill="#000"></circle></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSModify0)"></path></svg>
                    Modificar
                </button>

                <button className="btn btn-error" onClick={handleEliminar}>
                    <svg className="text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M7.823 3.368A2 2 0 0 1 9.721 2h4.558a2 2 0 0 1 1.898 1.368L16.72 5H20a1 1 0 1 1 0 2h-1v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4a1 1 0 0 1 0-2h3.28zM9.387 5l.334-1h4.558l.334 1z"></path></g></svg>
                    Eliminar
                </button>

                {/*
                <BotonesMenu
                    className=""
                    titulo="Crear"
                    icono={
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><defs><mask id="ipSAddOne0"><g fill="none" strokeLinejoin="round" strokeWidth={4}><path fill="#fff" stroke="#fff" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"></path><path stroke="#000" strokeLinecap="round" d="M24 16v16m-8-8h16"></path></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSAddOne0)"></path></svg>
                    }
                />
                <BotonesMenu
                    className=""
                    titulo="Modificar"
                    icono={
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><defs><mask id="ipSModify0"><g fill="none"><path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="m20.07 9.586l-4.242-4.243a2 2 0 0 0-2.828 0L7.343 11a2 2 0 0 0 0 2.829l4.243 4.242m17.343 19.343l4.242 4.243a2 2 0 0 0 2.829 0L41.657 36a2 2 0 0 0 0-2.828l-4.243-4.243"></path><rect width={12} height={42} x={34.606} y={4.908} fill="#fff" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} rx={2} transform="rotate(45 34.606 4.908)"></rect><circle cx={24} cy={24} r={2} fill="#000"></circle><circle cx={20} cy={28} r={2} fill="#000"></circle><circle cx={28} cy={20} r={2} fill="#000"></circle></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSModify0)"></path></svg>
                    }
                />
                <BotonesMenu
                    className=""
                    titulo="Eliminar"
                    icono={
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M7.823 3.368A2 2 0 0 1 9.721 2h4.558a2 2 0 0 1 1.898 1.368L16.72 5H20a1 1 0 1 1 0 2h-1v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4a1 1 0 0 1 0-2h3.28zM9.387 5l.334-1h4.558l.334 1z"></path></g></svg>
                    }
                />
                */}
            </div>
        </>
    );
}
