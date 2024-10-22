
import { useRouter } from "next/navigation";
import { useAuth } from "../../providers/authProvider";
import Stats from "./stats";
import Image from "next/image";
import React from "react";
export default function Hero() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const handleIngresar = () => {
        if (isLoggedIn) {
            router.push('sistema/dashboard');
        } else {
            router.push('sistema/initial/login');
        }
    }

    return (
        <>
            <div className="relative hero min-h-screen bg-base-200 bg-opacity-0" >
                <Image
                    className="z-[0]"
                    src="/img/descarga.jpeg"
                    alt="Background Image"
                    layout="fill"
                    style={{ objectFit: 'cover' }}
                    quality={100}
                />
                <div className="hero-overlay bg-opacity-75 z-[1]"></div>
                <div className="hero-content text-center text-neutral-content z-[2]">

                    <div className="flex flex-col text-center justify-center">

                        <h1 className="text-5xl font-bold max-sm:text-3xl">Bienvenidos a ExpertGuide</h1>

                        <p className="py-6 max-sm:text-base">Gestiona tus Guías de Manera Eficiente.</p>
                        <Stats />

                        <button className="btn btn-primary max-w-xs w-full mx-auto mt-4" onClick={handleIngresar}>Ingresar</button>
                    </div>
                </div>
            </div>
        </>
    );
}