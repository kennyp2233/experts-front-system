import { useRouter } from "next/navigation";
import React from "react";

interface Route {
    name: string;
    path: string;
    icon?: JSX.Element; // ícono opcional para cada ruta
}

interface BaseRouteProps {
    routes: Route[]; // Las rutas que se construirán dinámicamente
}

export default function BaseRoute({ routes }: BaseRouteProps) {
    const router = useRouter();

    return (
        <div className="text-sm breadcrumbs self-start max-sm:hidden">
            <ul>
                {routes.map((route, index) => (
                    <li key={index}>
                        <a onClick={() => router.push(route.path)}>
                            {route.icon && <span className="mr-2">{route.icon}</span>}
                            {!route.icon && (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>


                            )}
                            {route.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
