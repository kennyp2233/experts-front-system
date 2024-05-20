'use client';
import BotonDashboard from "../components/botonesMenu";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/protectedRoute";

const Dashboard = () => {
    const router = useRouter();

    const handleGuias = () => {
        router.push('/sistema/dashboard/modulos/guias');
    }

    const handleCoordinacion = () => {
        router.push('/sistema/dashboard/modulos/coordinacion');
    }

    const handleUsuarios = () => {
        router.push('/sistema/dashboard/modulos/usuarios');
    }

    const handleMantenimiento = () => {
        router.push('/sistema/dashboard/modulos/mantenimiento');
    }

    const handleModulos = () => {
        router.push('/sistema/dashboard/modulos');
    }

    return (
        <ProtectedRoute adminOnly={false}>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col justify-start w-full h-full">
                    <h1 className="text-5xl font-bold self-start pt-10 max-sm:text-4xl">Dashboard</h1>
                    <h2 className="text-4xl self-start max-sm:text-3xl">Accesos Directos</h2>
                    <div className="grid grid-cols-3 w-full gap-3 max-md:grid-cols-2 max-sm:grid-cols-1 ">


                        <BotonDashboard
                            titulo="Guias"
                            icono={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M1.75 10v4c0 2.829 0 4.243.879 5.122c.217.217.467.38.763.504a8.48 8.48 0 0 1-.019-.134c-.123-.918-.123-2.063-.123-3.393V7.902c0-1.33 0-2.476.123-3.393l.02-.134a2.309 2.309 0 0 0-.764.504C1.75 5.758 1.75 7.172 1.75 10m20 0v4c0 2.829 0 4.243-.879 5.122c-.217.217-.467.38-.763.504l.019-.134c.123-.918.123-2.063.123-3.393V7.902c0-1.33 0-2.476-.123-3.393a8.452 8.452 0 0 0-.02-.134c.297.123.547.287.764.504c.879.879.879 2.293.879 5.121" /><path fill="currentColor" fillRule="evenodd" d="M5.629 2.879C4.75 3.757 4.75 5.172 4.75 8v8c0 2.828 0 4.243.879 5.121C6.507 22 7.922 22 10.75 22h2c2.828 0 4.243 0 5.121-.879c.879-.878.879-2.293.879-5.121V8c0-2.828 0-4.243-.879-5.121C16.993 2 15.578 2 12.75 2h-2c-2.828 0-4.243 0-5.121.879M8 17a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3A.75.75 0 0 1 8 17m.75-4.75a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5zM8 9a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6A.75.75 0 0 1 8 9" clipRule="evenodd" /></svg>
                            }
                            onClick={handleGuias}

                        />

                        <BotonDashboard
                            titulo="Coordinacion"
                            icono={
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4.25q.325 0 .538-.213t.212-.537t-.213-.537T12 2.75t-.537.213t-.213.537t.213.538t.537.212M18 23q-2.075 0-3.537-1.463T13 18t1.463-3.537T18 13t3.538 1.463T23 18t-1.463 3.538T18 23M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h4.2q.325-.9 1.088-1.45T12 1t1.713.55T14.8 3H19q.825 0 1.413.588T21 5v5.45q0 .45-.375.7t-.8.1q-.425-.125-.888-.188T18 11q-.275 0-.513.013t-.487.062q-.125-.025-.3-.05q-.125 0-.312-.012T16 11H8q-.425 0-.712.288T7 12t.288.713T8 13h5.125q-.45.425-.812.925T11.675 15H8q-.425 0-.712.288T7 16t.288.713T8 17h3.075q-.05.25-.062.488T11 18q0 .5.05.95t.175.875t-.125.8t-.675.375zm12.5-2.5v2q0 .2.15.35T18 21t.35-.15t.15-.35v-2h2q.2 0 .35-.15T21 18t-.15-.35t-.35-.15h-2v-2q0-.2-.15-.35T18 15t-.35.15t-.15.35v2h-2q-.2 0-.35.15T15 18t.15.35t.35.15zM8 9h8q.425 0 .713-.288T17 8t-.288-.712T16 7H8q-.425 0-.712.288T7 8t.288.713T8 9" /></svg>

                            }
                            onClick={handleCoordinacion}
                        />

                        <BotonDashboard
                            titulo="Usuarios"
                            icono={
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 100 100"><path fill="currentColor" d="M49.947 0C22.354.03 0 22.406 0 50a50 50 0 0 0 20.404 40.21c-.265-2.031-.213-4.128.117-6.202a45.22 45.22 0 0 1-8.511-9.877h12.445c1.182-1.845 2.4-3.67 4.525-5c-1.245-5.1-2.006-10.716-2.146-16.631h1.346a18.653 18.653 0 0 1 1.93-5h-3.243c.212-5.935 1.043-11.554 2.363-16.63H47.5v8.888a13.75 13.75 0 0 1 5 1.804V30.87h19.195c.26.997.495 2.02.715 3.057a19.769 19.769 0 0 1 5.084-.117a76.416 76.416 0 0 0-.639-2.94h13.89a44.747 44.747 0 0 1 3.965 14.028c.58 5.049.591 10.975-1.246 16.771a45.007 45.007 0 0 1-2.286 6.478c1.128 1.187 2.494 2.309 3.867 3.454A50 50 0 0 0 100 50c0-27.614-22.386-50-50-50ZM52.5 5.682c5.268.896 10.302 5.236 14.268 12.437c1.278 2.321 2.42 4.927 3.408 7.75H52.5Zm-5 .197v19.99H30.75c.988-2.823 2.13-5.429 3.408-7.75C37.89 11.341 42.571 7.102 47.5 5.88M35.98 7.232c-2.324 2.352-4.41 5.22-6.203 8.475c-1.68 3.05-3.125 6.467-4.312 10.162H12.01c5.535-8.706 13.975-15.37 23.97-18.637m29.41.463c9.398 3.413 17.32 9.868 22.6 18.174H75.455c-1.184-3.695-2.627-7.112-4.307-10.162c-1.676-3.045-3.613-5.749-5.757-8.012M9.257 30.87h14.808c-1.245 5.162-2.008 10.76-2.203 16.631H5.072a44.79 44.79 0 0 1 4.184-16.63M5.072 52.5h16.762c.129 5.856.82 11.454 1.994 16.63H9.256A44.79 44.79 0 0 1 5.072 52.5" color="currentColor" /><path fill="currentColor" d="M76 37.769c-8.285 0-15 6.716-15 15c0 8.284 6.715 15 15 15c8.283 0 15-6.716 15-15c0-8.284-6.717-15-15-15m0 32.223c-16.57 0-24 7.431-24 24v2c.075 3.94 1.817 4.056 5.5 4h37c4.695-.004 5.532.005 5.5-4v-2c0-16.569-7.432-24-24-24M44 43.39c-6.787 0-12.291 5.504-12.291 12.292c0 6.787 5.504 12.289 12.291 12.289c6.787 0 12.29-5.502 12.29-12.29c0-6.787-5.503-12.29-12.29-12.29m0 26.401c-13.575 0-19.664 6.09-19.664 19.664v1.639c.062 3.228 1.489 3.323 4.506 3.277h19.123c-.488-8.088 1.901-16.678 7.851-22.139c-3.012-1.646-6.925-2.441-11.816-2.441" /></svg>
                            }
                            onClick={handleUsuarios}
                        />

                        <BotonDashboard
                            titulo="Mantenimiento"
                            icono={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 19q.825 0 1.413-.587T20 17t-.587-1.412T18 15t-1.412.588T16 17t.588 1.413T18 19m-.2 3q-.35 0-.612-.225t-.338-.575l-.15-.7q-.3-.125-.562-.262T15.6 19.9l-.725.225q-.325.1-.637-.025t-.488-.4l-.2-.35q-.175-.3-.125-.65t.325-.575l.55-.475q-.05-.3-.05-.65t.05-.65l-.55-.475q-.275-.225-.325-.562t.125-.638l.225-.375q.175-.275.475-.4t.625-.025l.725.225q.275-.2.538-.337t.562-.263l.15-.725q.075-.35.337-.562T17.8 12h.4q.35 0 .613.225t.337.575l.15.7q.3.125.562.262t.538.338l.725-.225q.325-.1.638.025t.487.4l.2.35q.175.3.125.65t-.325.575l-.55.475q.05.3.05.65t-.05.65l.55.475q.275.225.325.563t-.125.637l-.225.375q-.175.275-.475.4t-.625.025L20.4 19.9q-.275.2-.537.337t-.563.263l-.15.725q-.075.35-.337.563T18.2 22zM4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h5.175q.4 0 .763.15t.637.425L12 6h8q.825 0 1.413.588T22 8v1.9q0 .45-.387.675t-.813.025q-.65-.3-1.375-.45t-1.45-.15q-2.95 0-4.962 2.063T11 16.975q0 .475.063.938t.187.912t-.125.813t-.675.362z" /></svg>
                            }
                            onClick={handleMantenimiento}
                        />

                        <BotonDashboard
                            titulo="Modulos"
                            icono={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><path fill="currentColor" fillRule="evenodd" d="M4.88 0a1 1 0 0 0-1 1v4.25a1 1 0 0 0 1 1h4.25a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zM1 7.75a1 1 0 0 0-1 1V13a1 1 0 0 0 1 1h4.25a1 1 0 0 0 1-1V8.75a1 1 0 0 0-1-1zm6.75 1a1 1 0 0 1 1-1H13a1 1 0 0 1 1 1V13a1 1 0 0 1-1 1H8.75a1 1 0 0 1-1-1z" clipRule="evenodd" /></svg>
                            }
                            onClick={handleModulos}
                        />


                    </div>

                </div>
            </div>
        </ProtectedRoute>
    );
}

export default Dashboard; 