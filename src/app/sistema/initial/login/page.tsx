'use client'

import { useState } from "react";
import { useAuth } from "../../../providers/authProvider";
import { dispatchMenssage } from "@/app/utils/menssageDispatcher";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaSignInAlt, FaUserPlus, FaEnvelope } from 'react-icons/fa';

export default function Login() {
    const { handleLogin, isLoggedIn } = useAuth();
    const router = useRouter();

    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [recordar, setRecordar] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        const response = await handleLogin(usuario, password, recordar);
        if (response) {
            router.push('/sistema/dashboard');
        }

        setIsSubmitting(false);
    };

    const handleForgot = () => {
        router.push('/sistema/initial/forgot');
    }

    const handleRegister = () => {
        router.push('/sistema/initial/register');
    }

    if (isLoggedIn) {
        router.push('/sistema/dashboard');
        return null;
    }

    return (
        <div className="relative hero min-h-screen bg-base-200">
            <div className="hero-content min-w-0 w-full flex-col lg:flex-row-reverse">
                <h1 className="text-3xl font-bold lg:hidden max-md:text-center">
                    Iniciar Sesión
                </h1>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleSubmit}>
                        {/* Campo de Usuario/Email */}
                        <div className="form-control">
                            <label htmlFor="usuario" className="label">
                                <span className="label-text flex items-center">
                                    <FaUser className="mr-2 text-sm" aria-hidden="true" />
                                    Email o Usuario
                                </span>
                            </label>
                            <input
                                type="text"
                                id="usuario"
                                value={usuario}
                                onChange={e => setUsuario(e.target.value)}
                                placeholder="Email o Usuario"
                                className="input input-bordered"
                                required
                                aria-required="true"
                            />
                        </div>

                        {/* Campo de Contraseña */}
                        <div className="form-control">
                            <label htmlFor="password" className="label">
                                <span className="label-text flex items-center">
                                    <FaLock className="mr-2 text-sm" aria-hidden="true" />
                                    Contraseña
                                </span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Contraseña"
                                className="input input-bordered"
                                required
                                aria-required="true"
                            />
                        </div>

                        {/* Opciones adicionales */}
                        <div className="form-control">
                            <label htmlFor="recordar" className="label cursor-pointer flex justify-start">
                                <input
                                    type="checkbox"
                                    id="recordar"
                                    checked={recordar}
                                    onChange={e => setRecordar(e.target.checked)}
                                    className="checkbox checkbox-primary mr-2 checkbox-sm"
                                />
                                <span className="label-text">Recordarme</span>
                            </label>
                            <label className="label">
                                <a
                                    onClick={handleForgot}
                                    className="label-text-alt link link-hover"
                                    href="#"
                                    role="button"
                                    tabIndex={0}
                                    onKeyPress={(e) => { if (e.key === 'Enter') handleForgot(); }}
                                >
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </label>
                        </div>

                        {/* Botones de Acción */}
                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className="btn btn-primary flex items-center justify-center"
                                disabled={isSubmitting}
                                aria-label="Ingresar"
                            >
                                <FaSignInAlt className="mr-2 text-xl" aria-hidden="true" />
                                Ingresar
                            </button>

                            <button
                                onClick={handleRegister}
                                className="btn btn-outline btn-neutral mt-2 lg:hidden flex items-center justify-center"
                                type="button"
                                aria-label="Registrarse"
                            >
                                <FaUserPlus className="mr-2 text-xl" aria-hidden="true" />
                                Registrarse
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sección Adicional para Pantallas Grandes */}
                <div className="hidden text-left lg:block max-w-lg">
                    <h1 className="text-5xl font-bold py-6">¿No tienes cuenta todavía?</h1>
                    <button
                        onClick={handleRegister}
                        className="btn btn-outline flex items-center justify-center"
                        type="button"
                        aria-label="Registrarse ahora"
                    >
                        <FaEnvelope className="mr-2 text-xl" aria-hidden="true" />
                        Regístrate ahora
                    </button>
                </div>
            </div>
        </div>
    );
}
