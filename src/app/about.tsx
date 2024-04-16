'use client'
import { RefObject, useEffect, useRef } from 'react';
import Contenedor from './components/contenedor';
import Rosa3D from './components/rosa3d';
import { useInView } from 'react-intersection-observer';
import React from 'react';
const divs = [
    { title: 'Fidelidad', description: 'Comprometidos con nuestros clientes a largo plazo.' },
    { title: 'Excelencia', description: 'Brindamos un servicio de máxima calidad.' },
    { title: 'Creatividad', description: 'Soluciones innovadoras para cada reto logístico.' }
];

const About = React.forwardRef((props, ref) => {
    /*
    const { ref: paragraphRef, inView: paragraphInView } = useInView({
        triggerOnce: false,
        threshold: 0.1,
    });

    <h1 style={{ opacity: paragraphInView ? 1 : 0, transition: 'opacity 0.5s', lineHeight: "1.1" }} className="text-6xl text-center tracking-tighter font-light" >
                    Sobre nosotros
                </h1>
                <p ref={paragraphRef} style={{ opacity: paragraphInView ? 1 : 0, transition: 'opacity 0.5s' }} className="pt-10 text-2xl text-center tracking-tighter font-light"> Somos una empresa de planeación logística en la exportación de flores al mundo, contribuyendo a la mejora de la competitividad exportadora e importadora. Trabajamos con aliados de negocios reconocidos en el mercado y con amplio conocimiento en el campo de la logística integral.</p>
                <div className='flex items-center justify-center gap-3 mt-6 max-md:flex-col'>
                    {divs.map((div, index) => {
                        const { ref: divRef, inView: divInView } = useInView({
                            triggerOnce: false,
                            threshold: 0.1,
                        });

                        return (
                            <div key={index} ref={divRef} style={{ opacity: divInView ? 1 : 0, transition: `opacity 0.5s ${index * 0.2}s` }} className="block max-w-sm p-6 bg-transparent backdrop-blur-[75px] border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{div.title}</h5>
                                <p className="font-normal text-gray-700 dark:text-gray-400">{div.description}</p>
                            </div>
                        );
                    })}
                </div>
    */

    return (
        <>
            <Rosa3D />
            <section ref={ref as RefObject<HTMLElement> | null} className="max-w-screen-lg m-auto py-24 px-10 relative pt-[196px]">

                <h1 className="text-6xl text-center tracking-tighter font-light" >
                    Sobre nosotros
                </h1>
                <p className="pt-10 text-2xl text-center tracking-tighter font-light text-gray-200 max-md:text-xl"> Somos una empresa de planeación logística en la exportación de flores al mundo, contribuyendo a la mejora de la competitividad exportadora e importadora. Trabajamos con aliados de negocios reconocidos en el mercado y con amplio conocimiento en el campo de la logística integral.</p>
                <div className='flex items-center justify-center gap-3 mt-6  pt-5 max-[929px]:flex-wrap'>
                    {divs.map((div, index) => {


                        return (
                            <div key={index} className="block max-w-sm p-6 bg-transparent backdrop-blur-[50px] border border-gray-200 rounded-lg shadow max-md: w-full max-[929px]:min-h-36">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{div.title}</h5>
                                <p className="font-normal text-gray-400 ">{div.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section >
        </>
    );
});

export default About;