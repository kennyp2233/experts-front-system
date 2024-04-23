import { register } from "@/app/api/auth.api";
import { useState } from "react";
import toast, { resolveValue, Toaster } from 'react-hot-toast';
export default function Register({ handleClick }: { handleClick: (n: number) => void }) {
    const [usuario, setUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }
        const res = await register(usuario, email, password);
        if (res.ok) {
            toast.success('Usuario registrado correctamente');
            handleClick(1);
        } else {
            toast.error(res.msg || 'Error desconocido');
        }
    }
    return (
        <>

            <Toaster position="top-right" />
            <div className="hero min-h-screen bg-base-200">
                <button className="m-6 z-10 btn btn-neutral self-start place-self-start" onClick={() => handleClick(1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path fill="currentColor" d="M12 9.059V6.5a1.001 1.001 0 0 0-1.707-.708L4 12l6.293 6.207a.997.997 0 0 0 1.414 0A.999.999 0 0 0 12 17.5v-2.489c2.75.068 5.755.566 8 3.989v-1c0-4.633-3.5-8.443-8-8.941" /></svg>
                    <p>Login</p>
                </button>


                <div className="hero-content min-w-0 w-full flex-col lg:flex-row-reverse">

                    <div className="text-left lg:text-center">
                        <h1 className="text-5xl font-bold py-6 px-10 max-md:pt-14 max-sm:pt-20">Regístrate</h1>
                    </div>

                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">

                        <form className="card-body" onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Nombre de Usuario</span>
                                </label>
                                <input
                                    type="text"
                                    value={usuario}
                                    onChange={e => setUsuario(e.target.value)}
                                    placeholder="Ejemplo: JuanPerez123"
                                    className="input input-bordered"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Email"
                                    className="input input-bordered"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Contraseña</span>
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Contraseña"
                                    className="input input-bordered"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Confirmar Contraseña</span>
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="Confirmar Contraseña"
                                    className="input input-bordered"
                                    required
                                />
                            </div>
                            <div className="form-control mt-6">
                                <button className="btn btn-primary">Registrarse</button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </>
    );
}