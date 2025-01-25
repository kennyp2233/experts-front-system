import { useState, useEffect } from 'react';
import OtransecLogo from "../icon/otransec_icon";
import SenaeLogo from "../icon/senae_icon";

export default function Colaboraciones({ className }: { className?: string }) {
    const [highlight, setHighlight] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setHighlight(prevHighlight => (prevHighlight + 1) % 2);
        }, 5000); // Cambia el resaltado cada 3 segundos

        return () => clearInterval(timer); // Limpia el intervalo cuando el componente se desmonta
    }, []);

    return (
        <>
            <div className={"" + className}>
                <div className="pt-10 text-xl text-center text-gray-300 tracking-tighter font-light max-md:text-base">
                    Trabajamos en estrecha colaboración con{" "}
                    <div className='relative inline-block' style={{ transition: 'color 3s, font-weight 3s', color: `${highlight === 0 ? 'white' : 'inherit'}`, fontWeight: `${highlight === 0 ? 'bold' : 'normal'}` }}>
                        compañias de carga
                        <div className="h-[0.7px] bg-gray-500 absolute bottom-0 left-0 right-0">
                            <div style={{ transition: 'width 3s', width: `${highlight === 0 ? '100%' : '0%'}` }} className="h-full bg-white"></div>
                        </div>
                    </div>
                    {" "}
                    e
                    {" "}
                    <div className='relative inline-block' style={{ transition: 'color 3s, font-weight 3s', color: `${highlight === 1 ? 'white' : 'inherit'}`, fontWeight: `${highlight === 1 ? 'bold' : 'normal'}` }}>
                        instituciones gubernamentales
                        <div className="h-[0.7px] bg-gray-500 absolute bottom-0 left-0 right-0">
                            <div style={{ transition: 'width 3s', width: `${highlight === 1 ? '100%' : '0%'}` }} className="h-full bg-white"></div>
                        </div>
                    </div>
                </div>
                <div className="logos flex text-center justify-center h-32 mt-6 max-md:h-28">
                    <div className='absolute h-32 max-md:h-28' style={{ transition: 'opacity 3s', opacity: `${highlight === 0 ? '1' : '0'}` }}>
                        <OtransecLogo className="scale-[1]" />
                    </div>
                    <div style={{ transition: 'opacity 3s', opacity: `${highlight === 1 ? '1' : '0'}` }}>
                        <SenaeLogo className="scale-[1]" />
                    </div>
                </div>
            </div>
        </>
    );
}