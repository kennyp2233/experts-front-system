import Stats from "./stats";
export default function Hero({ handleClick }: { handleClick: (n: number) => void }) {

    return (
        <>
            <div className="hero min-h-screen bg-base-200" style={{ backgroundImage: 'url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg)' }}>
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content max-w-lg text-center">

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