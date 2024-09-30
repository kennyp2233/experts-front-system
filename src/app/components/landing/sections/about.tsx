'use client'
import { RefObject, useEffect, useRef } from 'react';
import Rosa3D from '../rosa3d';

import React from 'react';
const divs = [
    { title: 'Fidelidad', description: 'Comprometidos con nuestros clientes a largo plazo.' },
    { title: 'Excelencia', description: 'Brindamos un servicio de máxima calidad.' },
    { title: 'Creatividad', description: 'Soluciones innovadoras para cada reto logístico.' }
];

const About = React.forwardRef((props, ref) => {


    return (
        <>

            <section ref={ref as RefObject<HTMLElement> | null} className="max-w-screen-lg m-auto py-24 px-10 relative pt-[196px] min-h-[100vh] max-md:px-4 max-md:pt-28">
                <Rosa3D />
                <h1 className="text-6xl text-center tracking-tighter font-bold max-md:text-4xl" >
                    Sobre nosotros
                </h1>
                <p className="pt-10 text-2xl text-center tracking-tighter font-light text-gray-200 max-md:text-xl"> Somos una empresa de planeación logística en la exportación de flores al mundo, contribuyendo a la mejora de la competitividad exportadora e importadora. Trabajamos con aliados de negocios reconocidos en el mercado y con amplio conocimiento en el campo de la logística integral.</p>
                <div className='flex items-center justify-center gap-3 mt-6  pt-5 max-lg:flex-wrap'>
                    {divs.map((div, index) => {


                        return (
                            <div key={index} className="block max-w-sm p-6 bg-transparent backdrop-blur-[50px] border border-gray-200 rounded-lg shadow max-md:w-full max-lg:min-h-36">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-white max-md:text-xl">{div.title}</h5>
                                <p className="text-gray-400 ">{div.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section >
        </>
    );
});
About.displayName = 'About';
export default About;