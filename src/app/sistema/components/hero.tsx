export default function Hero({ handleClick }: { handleClick: (n: number) => void }) {

    return (
        <>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Bienvenidos a ExpertGuide</h1>
                        <p className="py-6">Gestiona tus Guías de Manera Eficiente.</p>
                        <button className="btn btn-primary" onClick={() => handleClick(1)}>Iniciar</button>
                    </div>
                </div>
            </div>
        </>
    );
}