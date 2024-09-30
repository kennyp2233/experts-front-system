'use client'

import { useState } from "react";
import { useAuth } from "../../providers/authProvider";
import { dispatchMenssage } from "@/app/utils/menssageDispatcher";
import { useRouter } from "next/navigation";

export default function Login() {
    const { handleLogin, isLoggedIn } = useAuth();
    const router = useRouter();

    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [recordar, setRecordar] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Si el formulario ya se está enviando, salimos de la función
        if (isSubmitting) return;

        setIsSubmitting(true);

        // Aquí puedes hacer la petición al backend para iniciar sesión
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
        <>

            <div className="relative hero min-h-screen bg-base-200">

                <div className="hero-content min-w-0 w-full flex-col lg:flex-row-reverse">

                    <h1 className=" text-3xl font-bold lg:hidden max-md:text-center">
                        Iniciar Sesión
                    </h1>
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <form className="card-body" onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text flex text-center justify-center">

                                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 my-auto text-xl" width="1em" height="1em" viewBox="0 0 24 24"><g fill="currentColor"><path d="M22 7.535V17a3 3 0 0 1-2.824 2.995L19 20H5a3 3 0 0 1-2.995-2.824L2 17V7.535l9.445 6.297l.116.066a1 1 0 0 0 .878 0l.116-.066z" /><path d="M19 4c1.08 0 2.027.57 2.555 1.427L12 11.797l-9.555-6.37a3 3 0 0 1 2.354-1.42L5 4z" /></g></svg>
                                        Email o Usuario
                                    </span>
                                </label>
                                <input type="text" value={usuario} onChange={e => setUsuario(e.target.value)} placeholder="Email o Usuario" className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text flex text-center justify-center">
                                        <svg className="mr-2 my-auto text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M21 2a8.998 8.998 0 0 0-8.612 11.612L2 24v6h6l10.388-10.388A9 9 0 1 0 21 2m0 16a7.013 7.013 0 0 1-2.032-.302l-1.147-.348l-.847.847l-3.181 3.181L12.414 20L11 21.414l1.379 1.379l-1.586 1.586L9.414 23L8 24.414l1.379 1.379L7.172 28H4v-3.172l9.802-9.802l.848-.847l-.348-1.147A7 7 0 1 1 21 18" /><circle cx="22" cy="10" r="2" fill="currentColor" /></svg>
                                        Contraseña
                                    </span>
                                </label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" className="input input-bordered" required />
                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">Recordarme</span>
                                        <input type="checkbox" checked={recordar} onChange={e => setRecordar(e.target.checked)} className="checkbox checkbox-primary" />
                                    </label>
                                </div>
                                <label className="label">
                                    <a onClick={handleForgot} className="label-text-alt link link-hover">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </label>
                            </div>
                            <div className="form-control mt-6">
                                <button className="btn btn-primary">
                                    <svg className="mr-1 my-auto text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M11 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zm1.293 6.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L13.586 13H5a1 1 0 1 1 0-2h8.586l-1.293-1.293a1 1 0 0 1 0-1.414" clipRule="evenodd" /></svg>
                                    Ingresar
                                </button>

                                <button onClick={handleRegister} className="btn btn-outline btn-neutral mt-2 lg:hidden" type="button">
                                    <svg className="mr-1 my-auto text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M15 14c-2.67 0-8 1.33-8 4v2h16v-2c0-2.67-5.33-4-8-4m-9-4V7H4v3H1v2h3v3h2v-3h3v-2m6 2a4 4 0 0 0 4-4a4 4 0 0 0-4-4a4 4 0 0 0-4 4a4 4 0 0 0 4 4" /></svg>
                                    Registrarse
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="hidden text-left lg:block max-w-lg">
                        <h1 className="text-5xl font-bold py-6">No tienes cuenta todavia?</h1>
                        <button onClick={handleRegister} className="btn btn-outline" type="button">
                            Registrate ahora
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}