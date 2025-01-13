'use client'
import { useState } from "react";
import { useAuth } from "../../providers/authProvider";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { dispatchMenssage } from "@/app/utils/menssageDispatcher";
import React from "react";
export default function NavBar() {
    const { isLoggedIn, rol, handleLogout } = useAuth();
    const [theme, setTheme] = useState('cupcake');
    const router = useRouter();
    const toggleTheme = () => {
        const newTheme = theme === 'cupcake' ? 'dark' : 'cupcake';
        setTheme(newTheme);
        document.body.setAttribute('data-theme', newTheme);
    };

    const handleClick = () => {
        router.push('/sistema');
    };


    return (
        <>
            <div className='text-primary'>{"logged " + isLoggedIn}</div>
            <div className='text-primary'>{"admin " + rol}</div>
            <div className="bg-base-100">
                <div className="navbar max-w-screen-lg mx-auto ">
                    <div className="navbar-start">

                        <button className="btn btn-ghost text-xl max-md:px-2" onClick={handleClick}>
                            ExpertGuide
                            <div className="indicator h-3/4">
                                <span className="hidden indicator-item indicator-bottom badge badge-primary md:inline-block">BETA</span>
                                <span className="indicator-item indicator-bottom badge badge-primary md:hidden">B</span>
                            </div>
                        </button>

                    </div>



                    <div className="navbar-end">
                        <label className="flex cursor-pointer gap-2 mr-8 max-md:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                            <input type="checkbox" value="dark" className="toggle toggle-sm theme-controller" onChange={toggleTheme} />
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                        </label>
                        <label className="hidden swap swap-rotate mr-2 max-md:inline-grid">

                            {/* this hidden checkbox controls the state */}
                            <input type="checkbox" className="theme-controller" value="dark" onChange={toggleTheme} />

                            {/* sun icon */}
                            <svg className="swap-off fill-current w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>

                            {/* moon icon */}
                            <svg className="swap-on fill-current w-6 h-6 m-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>

                        </label>

                        {isLoggedIn &&
                            <>

                                <div className="dropdown dropdown-end">
                                    <div className="indicator">
                                        {rol === 'admin' && <span className="indicator-item indicator-center indicator-bottom badge badge-sm font-semibold badge-secondary">Admin</span>}
                                        <div className="grid place-items-center">
                                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                                <div className="w-10 rounded-full">
                                                    <Image
                                                        src="/img/default-user-1.jpeg"
                                                        alt="Picture of the author"
                                                        width={40}
                                                        height={40}

                                                    />
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[3] p-2 shadow bg-base-100 rounded-box w-52">
                                        <li>
                                            <a className="justify-between">
                                                Profile
                                                <span className="badge">New</span>
                                            </a>

                                        </li>
                                        <li><a>Settings</a></li>
                                        <li><a onClick={() => {
                                            handleLogout()
                                            router.push('/sistema')
                                            dispatchMenssage("success", "Se cerró la sesión correctamente")
                                        }}>Logout</a></li>
                                    </ul>
                                </div>
                            </>
                        }


                    </div>

                </div>
            </div>

        </>
    );
}