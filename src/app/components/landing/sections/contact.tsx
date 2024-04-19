'use client'
import { RefObject, useEffect, useRef } from 'react';
import Rosa3D from '../rosa3d';
import "./styles/contact.css"
import React from 'react';
const divs = [
    { title: 'Fidelidad', description: 'Comprometidos con nuestros clientes a largo plazo.' },
    { title: 'Excelencia', description: 'Brindamos un servicio de máxima calidad.' },
    { title: 'Creatividad', description: 'Soluciones innovadoras para cada reto logístico.' }
];

const Contact = React.forwardRef((props, ref) => {
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

            <section ref={ref as RefObject<HTMLElement> | null} className="max-w-screen-lg m-auto py-24 px-10 relative pt-[196px] min-h-[100vh] max-md:px-4 max-md:pt-28">
                <h1 className="text-6xl text-center tracking-tighter font-bold max-md:text-4xl">
                    Contacto
                </h1>
                <div className="container-grid w-full mt-12">
                    <div className="direccion min-w-0 block p-6 bg-transparent backdrop-blur-[50px] border border-gray-200 rounded-lg shadow max-md:w-full max-lg:min-h-36">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-white max-md:text-xl">
                            <span className="mr-2 text-blue-500 animate-bounce">🏠</span> Dirección
                        </h5>
                        <p className="text-gray-400">
                            10 DE DICIEMBRE Y CHILLANES CONJUNTO MI PASEO CASA 31, SANGOLQUI ECUADOR
                        </p>
                    </div>
                    <div className="telefono min-w-0 block p-6 bg-transparent backdrop-blur-[50px] border border-gray-200 rounded-lg shadow max-md:w-full max-lg:min-h-36">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-white max-md:text-xl">
                            <span className="mr-2 text-blue-500 animate-bounce">📞</span> Teléfono
                        </h5>
                        <p className="text-gray-400">023526170</p>
                        <p className="text-gray-400">0960058635</p>
                    </div>
                    <div className="correo min-w-0 block p-6 bg-transparent backdrop-blur-[50px] border border-gray-200 rounded-lg shadow max-md:w-full max-lg:min-h-36">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-white max-md:text-xl">
                            <span className="mr-2 text-blue-500 animate-bounce">✉️</span> Correo
                        </h5>
                        <p className="text-gray-400 break-words">
                            <a href="mailto:manager@expertshcargo.com">manager@expertshcargo.com</a>
                        </p>
                        <p className="text-gray-400 break-words">
                            <a href="mailto:coordination@expertshcargo.com">
                                coordination@expertshcargo.com
                            </a>
                        </p>
                        <p className="text-gray-400 break-words">
                            <a href="mailto:expertshcargosa@gmail.com">expertshcargosa@gmail.com</a>
                        </p>
                    </div>
                </div>
                <div className="mt-12">
                    <h2 className="text-3xl font-semibold mb-4">Ubicación</h2>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d814.8629519751344!2d-78.44019015204388!3d-0.35087356115242013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sec!4v1713365037178!5m2!1ses-419!2sec"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-lg shadow-md"
                    ></iframe>
                </div>
            </section>
        </>
    );
});
Contact.displayName = 'Contact';
export default Contact;