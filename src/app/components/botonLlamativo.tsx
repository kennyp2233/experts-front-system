import { useState } from 'react';
import Boton from './boton';
import tinycolor from 'tinycolor2';

interface BotonLlamativoProps {
    children: React.ReactNode;
    onClick?: () => void;
    colorBase?: string;
    className?: string;
    style?: React.CSSProperties;
}

export default function BotonLlamativo({ children, onClick, colorBase, className, style }: BotonLlamativoProps) {
    let color1 = '#8a6cff';
    let color2 = 'rgba(53,41,128,0)';
    let color3 = 'rgba(16,0,51,.4)';
    let color4 = '#1e0d49';

    let colorBaseLightened = colorBase;

    if (colorBase) {
        colorBaseLightened = tinycolor(colorBase).lighten(15).toString(); // Aumenta la luminosidad del color base
        color1 = tinycolor(colorBase).lighten(20).toString();
        color2 = tinycolor(colorBase).lighten(10).setAlpha(0).toString();
        color3 = tinycolor(colorBase).darken(20).setAlpha(0.4).toString();
        color4 = tinycolor(colorBase).darken(30).toString();
    }
    const [bgColor, setBgColor] = useState('transparent'); // Inicializa el estado del color de fondo

    return (
        <div
            className={`relative flex align-middle justify-center overflow-hidden w-fit rounded-2xl transition duration-200 ease-in-out`}
            style={{ backgroundColor: bgColor }}
            onMouseEnter={() => { setBgColor(colorBaseLightened as any) }}
            onMouseLeave={() => setBgColor('transparent')}
        >
            <Boton
                className={'font-medium justify-center flex flex-nowrap whitespace-nowrap text-sm w-full ' + className}
                style={{
                    ...style,
                    background: `radial-gradient(231.94% 231.94% at 50% 100%,${color1} 0,${color2} 25.24%),linear-gradient(180deg,rgba(243,238,255,0),rgba(243,238,255,.04)),rgba(147,130,255,.01)`,
                    boxShadow: `0 0 0 0 ${color3},0 2px 5px 0 ${color3},0 8px 8px 0 ${color3},0 19px 11px 0 ${color3},0 34px 14px 0 ${color3},0 53px 15px 0 ${color3},inset 0 0 12px 0 hsla(0,0%,100%,.08),inset 0 -8px 32px 0 ${color4}`,

                }}
                onClick={onClick}
            >
                {children}
            </Boton>
        </div>

    );
}