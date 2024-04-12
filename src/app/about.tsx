'use client'
import Contenedor from './components/contenedor';
import Rosa3D from './components/rosa3d';
export default function About() {

    return (
        <>
            <section className="max-w-screen-lg m-auto py-24 px-10 relative">
                <Rosa3D />
                <h1 className="text-6xl text-center tracking-tighter font-light" style={{ lineHeight: "1.1" }}>
                    Sobre nosotros
                </h1>
                <p className="pt-10 text-2xl text-center tracking-tighter font-light"> Somos una empresa de planeación logística en la exportación de flores al mundo, contribuyendo a la mejora de la competitividad exportadora e importadora. Trabajamos con aliados de negocios reconocidos en el mercado y con amplio conocimiento en el campo de la logística integral.</p>
                <div className='flex items-center justify-center gap-3 mt-6 max-md:flex-col'>
                    <div className="block max-w-sm p-6 bg-transparent backdrop-blur-[75px] border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Fidelidad</h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">Comprometidos con nuestros clientes a largo plazo.</p>
                    </div>

                    <div className="block max-w-sm p-6 bg-transparent backdrop-blur-[75px] border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Excelencia</h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">Brindamos un servicio de máxima calidad.</p>
                    </div>

                    <div className="block max-w-sm p-6 bg-transparent backdrop-blur-[75px] border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Creatividad</h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">Soluciones innovadoras para cada reto logístico.</p>
                    </div>
                </div>

            </section>
        </>
    );
}