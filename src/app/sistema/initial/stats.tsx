'use client'
import { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

interface AnimatedNumberProps {
    from: number;
    to: number;
    duration?: number; // Duración en segundos
}

const Stats: React.FC = () => {
    // Valores iniciales y objetivos
    const [lastUsers] = useState(1);
    const [targetUsers] = useState(427);
    const [lastVisits] = useState(0);
    const [targetVisits] = useState(150);

    // Cálculo del porcentaje de cambio
    const percentageChange = ((targetUsers - lastUsers) / lastUsers) * 100;

    /**
     * Componente interno para animar números de manera sencilla.
     * Utiliza Framer Motion para animar el valor de 'from' a 'to' durante 'duration' segundos.
     */
    const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ from, to, duration = 2 }) => {
        const motionValue = useMotionValue(from);
        const [current, setCurrent] = useState(from);

        useEffect(() => {
            // Inicia la animación del valor desde 'from' hasta 'to'
            const animation = animate(motionValue, to, {
                duration,
                ease: "linear",
                onUpdate: (latest) => {
                    setCurrent(Math.floor(latest));
                },
            });

            // Limpia la animación al desmontar el componente
            return () => animation.stop();
        }, [to, duration, motionValue]);

        return <span>{current}</span>;
    };

    return (
        <motion.div
            className="stats overflow-hidden w-full max-md:stats-vertical max-md:max-w-xs mx-auto shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Estadística de Visitas */}
            <motion.div
                className="stat"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="stat-figure text-base-content text-3xl max-sm:text-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"
                        />
                    </svg>
                </div>
                <div className="stat-title max-sm:text-sm">Visitas</div>
                <div className="stat-value">
                    <AnimatedNumber from={lastVisits} to={targetVisits} duration={2} />
                </div>
                <div className="stat-desc">Enero 1 - Febrero 1</div>
            </motion.div>

            {/* Estadística de Usuarios */}
            <motion.div
                className="stat"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <div className="stat-figure text-base-content text-3xl max-sm:text-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                        <path
                            fill="currentColor"
                            d="M7.879 7.5c.504-.61 1.267-1 2.121-1s1.617.39 2.121 1a2.75 2.75 0 1 1-4.243 0m5.871 1.75c0-.632-.156-1.228-.432-1.75H17.5A1.5 1.5 0 0 1 19 9v.5c0 1.587-1.206 3.212-3.315 3.784A2.5 2.5 0 0 0 13.5 12h-.95a3.74 3.74 0 0 0 1.2-2.75M13.5 13a1.496 1.496 0 0 1 1.5 1.5v.5c0 1.971-1.86 4-5 4s-5-2.029-5-4v-.5A1.496 1.496 0 0 1 6.5 13zM1 9.5c0 1.587 1.206 3.212 3.315 3.784A2.5 2.5 0 0 1 6.5 12h.95a3.74 3.74 0 0 1-1.2-2.75c0-.632.156-1.228.433-1.75H2.5A1.5 1.5 0 0 0 1 9zm7.75-5.75a2.75 2.75 0 1 0-5.5 0a2.75 2.75 0 0 0 5.5 0m8 0a2.75 2.75 0 1 0-5.5 0a2.75 2.75 0 0 0 5.5 0"
                        />
                    </svg>
                </div>
                <div className="stat-title max-sm:text-sm">Nuestros Usuarios</div>
                <div className="stat-value">
                    <AnimatedNumber from={lastUsers} to={targetUsers} duration={2} />
                </div>
                <div className={`stat-desc ${targetUsers - lastUsers > 0 ? "text-base-content font-semibold" : ""}`}>
                    ↗︎ 427 ({percentageChange.toFixed(2)}%)
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Stats;
