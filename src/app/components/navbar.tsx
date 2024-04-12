'use client';
import Image from 'next/image';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, BellIcon, XIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ExpertsIcon from './icon/experts_icon';
import BotonLlamativo from './botonLlamativo';


const link = [
    { href: '/', label: 'Nuestra Empresa' },
    { href: '/about', label: 'Servicios' },
    { href: '/contact', label: 'Contacto' },

];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
    const path = usePathname();
    return (
        <>
            {/*
            This example requires updating your template:
    
            ```
            <html class="h-full bg-gray-100">
            <body class="h-full">
            ```
          */}
            <div>
                <Disclosure as="nav" className="bg-black text-left relative z-[9999] bg-offpurple/20 backdrop-blur-[75px] bg-transparent">
                    {({ open }) => (
                        <>
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex h-24 items-center justify-between">

                                    <div className="flex justify-between w-full lg:w-auto lg:relative lg:z-10 h-24">
                                        <Link
                                            href='/'
                                            className='flex items-center transition duration-300 ease-in-out md:hover:scale-100'
                                        >
                                            <ExpertsIcon
                                                fill="#000000"
                                                className='transition duration-300 ease-in-out md:hover:scale-110'
                                            />
                                        </Link>

                                    </div>

                                    <div className="hidden md:flex md:justify-center md:items-center md:absolute md:inset-0">
                                        <div className="flex items-baseline space-x-4">
                                            {link.map((item) => (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    className={classNames(
                                                        item.href === path
                                                            ? 'text-opacity-70 scale-105'
                                                            : '',
                                                        'text-white bg-transparent text-sm flex justify-center px-2 xl:px-4 border-0 relative z-10 hover:text-opacity-70 transition duration-300 ease-in-out hover:scale-105'
                                                    )}
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    <BotonLlamativo colorBase='#F42A2A'>
                                        Lanzar Sistema
                                    </BotonLlamativo>


                                    <div className="-mr-2 flex md:hidden">
                                        {/* Mobile menu button */}
                                        <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="absolute -inset-0.5" />
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <XIcon className="block h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                            )}
                                        </Disclosure.Button>
                                    </div>

                                </div>

                            </div>

                            <Transition
                                show={open}
                                as={Fragment}
                                enter="duration-200 ease-out"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="duration-100 ease-in"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Disclosure.Panel className="md:hidden">
                                    <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                                        {link.map((item) => (

                                            <Disclosure.Button
                                                key={item.label}
                                                as="a"
                                                href={item.href}
                                                className={classNames(
                                                    path === item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'block rounded-md px-3 py-2 text-base font-medium'
                                                )}

                                            >
                                                {item.label}
                                            </Disclosure.Button>
                                        ))}
                                    </div>
                                </Disclosure.Panel>
                            </Transition>
                        </>
                    )}
                </Disclosure>

                <hr className=' bottom-0 w-full h-px border-0 opacity-15 max-md:hidden' style={{ backgroundImage: 'linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 52.07%, rgba(255, 255, 255, 0) 100%)' }} />

            </div >

        </>
    )
}