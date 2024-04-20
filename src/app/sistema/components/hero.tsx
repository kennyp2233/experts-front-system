import Stats from "./stats";
export default function Hero({ handleClick }: { handleClick: (n: number) => void }) {

    return (
        <>
            <div className="hero min-h-screen bg-base-200" style={{ backgroundImage: 'url(img/descarga.jpeg)' }}>
                <div className="hero-overlay bg-opacity-70"></div>
                <div className="hero-content text-center text-neutral-content">

                    <div className="flex flex-col text-center justify-center">

                        <h1 className="text-5xl font-bold">Bienvenidos a ExpertGuide</h1>

                        <p className="py-6">Gestiona tus Guías de Manera Eficiente.</p>
                        <Stats />

                        <button className="btn btn-primary w-fit m-auto mt-4" onClick={() => handleClick(1)}>Ingresar</button>
                    </div>
                </div>
            </div>
        </>
    );
}