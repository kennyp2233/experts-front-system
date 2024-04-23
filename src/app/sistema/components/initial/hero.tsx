import { useAuth } from "../../authProvider";
import { useSistemState } from "../../sistemStateContext";
import Stats from "./stats";
import Image from "next/image";
export default function Hero({ handleClick }: { handleClick: (n: number) => void }) {
    const { isLoggedIn, setIsLoggedIn, verifyAdmin, isAdministrator } = useAuth();
    const { sistemState, handleSistemState, } = useSistemState();
    return (
        <>
            <div className="relative hero min-h-screen bg-base-200 bg-opacity-0" >
                <Image
                    className="-z-[1]"
                    src="/img/descarga.jpeg"
                    alt="Background Image"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                />
                <div className="hero-overlay bg-opacity-75"></div>
                <div className="hero-content text-center text-neutral-content">

                    <div className="flex flex-col text-center justify-center">

                        <h1 className="text-5xl font-bold">Bienvenidos a ExpertGuide</h1>

                        <p className="py-6">Gestiona tus Guías de Manera Eficiente.</p>
                        <Stats />

                        <button className="btn btn-primary max-w-xs w-full mx-auto mt-4" onClick={() => isLoggedIn ? handleSistemState(1) : handleClick(1)}>Ingresar</button>
                    </div>
                </div>
            </div>
        </>
    );
}