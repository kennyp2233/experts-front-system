'use client'

import { motion } from "framer-motion";
import Escena3D from './components/fondo3d_rosa';
import { useState, useEffect, useRef, Suspense } from 'react';
import "./hero.css";
const opcionesHero = [
    "esparce pasión",
    "cultiva sueños",
    "crea esperanzas",
    "destila alegrías",
    "siembra emociones"

];
export default function Hero() {
    const [currentOption, setCurrentOption] = useState(0);
    const currentOptionRef = useRef(currentOption);
    const ref = useRef(null);

    useEffect(() => {
        currentOptionRef.current = currentOption;
    }, [currentOption]);

    useEffect(() => {
        const node = ref.current;
        if (node) {
            const handleAnimationIteration = () => {
                setCurrentOption((currentOptionRef.current + 1) % opcionesHero.length);
            };
            (node as HTMLElement).addEventListener('animationiteration', handleAnimationIteration);
            return () => {
                (node as HTMLElement).removeEventListener('animationiteration', handleAnimationIteration);
            };
        }
    }, []);

    return (
        <section className="max-w-screen-lg m-auto pt-24 px-10 relative mb-52">

            <h1 className="text-7xl text-center tracking-tighter font-light" style={{ lineHeight: "1.1" }}>
                Nuestra empresa ecuatoriana  <br />
                <div
                    ref={ref}
                    className="animate-slide w-fit m-auto"
                    style={{
                        background: "linear-gradient(45deg, rgba(167,4,4,1) 0%, rgba(242,126,2,1) 89%, rgba(247,218,208,1) 100%)",
                        WebkitTextFillColor: "transparent",
                        WebkitBackgroundClip: "text",
                        perspective: "1000px",

                    }}
                >
                    {opcionesHero[currentOption]}
                </div>
                <span className="bg-transparent">para alegrar al mundo.</span>

            </h1>
            <p className="pt-10 text-2xl text-center tracking-tighter font-light">Servicios logísticos integrales para la exportación de flores frescas y de la más alta calidad.</p>
            <Suspense>
                <Escena3D />
            </Suspense>
        </section>
    )

}