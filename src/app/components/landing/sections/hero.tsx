'use client'

import { motion } from "framer-motion";
import Escena3D from '../fondo3d_rosa';
import { useState, useEffect, useRef, Suspense, RefObject } from 'react';
import "./styles/hero.css";
import React from "react";
import Colaboraciones from "./colaboraciones";
const opcionesHero = [
    "esparce pasión",
    "cultiva sueños",
    "crea esperanzas",
    "destila alegrías",
    "siembra emociones"

];

const Hero = React.forwardRef((props, ref) => {
    const [currentOption, setCurrentOption] = useState(0);
    const currentOptionRef = useRef(currentOption);
    const refAnim = useRef(null);

    useEffect(() => {
        currentOptionRef.current = currentOption;
    }, [currentOption]);

    useEffect(() => {
        const node = refAnim.current;
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
    //mb-52
    return (
        <>

            <section ref={ref as RefObject<HTMLElement> | null} className="flex flex-col h-full w-full m-auto px-10 relative max-md:px-8 pt-48 min-h-[100vh]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%,rgba(255,255,255,0) 60%, rgba(0,0,0,1) 100%)' }}>
                <Escena3D />
                <h1 className="text-7xl text-center tracking-tighter font-light max-md:text-4xl" style={{ lineHeight: "1.1" }}>
                    Nuestra empresa ecuatoriana  <br />
                    <div
                        ref={refAnim}
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
                <p className="pt-10 text-2xl text-center tracking-tighter font-light max-md:text-xl">Servicios logísticos integrales para la exportación de flores frescas y de la más alta calidad.</p>
                <Colaboraciones className="mt-auto" />
            </section>
        </>

    )

});

Hero.displayName = 'Hero';
export default Hero;