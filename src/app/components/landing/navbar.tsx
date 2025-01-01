'use client';
import Image from 'next/image';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, BellIcon, XIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import LogoExperts from './icon/experts_icon';
import BotonLlamativo from './botonLlamativo';


const link = [
    { href: '/sistema', label: 'Sistema' },
    { href: '/', label: 'Nuestra Empresa' },
    { href: '/about', label: 'Servicios' },
    { href: '/contact', label: 'Contacto' },

];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar({ sections }: { sections?: any[] }) {
    const [refSelected, setRefSelected] = useState(0);

    const handleClick = (sectionRef: any) => {

        if (sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            let minTop = Infinity;
            let selected = 0;
            sections?.forEach((section, index) => {
                const rect = section.current?.getBoundingClientRect();
                if (rect) {
                    const top = Math.abs(rect.top);
                    if (top < minTop) {
                        minTop = top;
                        selected = index;
                    }
                }
            });
            setRefSelected(selected);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [sections]);

    const path = usePathname();
    const handleBtnClick = () => {
        if (path !== '/sistema') {
            window.location.href = '/sistema';
        }
    }
    return (
        <>
            {/*
            This example requires updating your template:
    
            ```
            <html class="h-full bg-gray-100">
            <body class="h-full">
            ```
          */}
            <div className='fixed w-full backdrop-blur-[75px] z-20 max-md:bg-black'>
                <Disclosure as="nav" className="bg-black text-left relative bg-offpurple/20 bg-transparent max-md:pr-2">
                    {({ open }) => (
                        <>
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex h-24 items-center justify-between">

                                    <div className="flex justify-between w-full lg:w-auto lg:relative lg:z-10 h-24">
                                        <Link
                                            href='/'
                                            className='flex items-center transition duration-300 ease-in-out md:hover:scale-100'
                                        >
                                            <LogoExperts
                                                fill="#000000"
                                                className='transition duration-300 ease-in-out md:hover:scale-110 max-md:scale-[0.8]'
                                            />
                                        </Link>

                                    </div>

                                    <div className="hidden md:flex md:justify-center md:items-center md:absolute md:inset-0">
                                        <div className="flex items-baseline space-x-4">
                                            {link.map((item) => (
                                                (item.label !== 'Sistema' &&
                                                    <button
                                                        key={item.label}
                                                        onClick={() => handleClick(sections?.[link.indexOf(item) - 1])}
                                                        className={classNames(
                                                            refSelected === link.indexOf(item) - 1
                                                                ? 'scale-105 font-semibold'
                                                                : '',
                                                            'text-white bg-transparent text-sm flex justify-center px-2 xl:px-4 border-0 relative z-10 hover:text-opacity-70 transition duration-100 ease-in-out hover:scale-105'
                                                        )}
                                                        style={refSelected === link.indexOf(item) - 1 ? { textShadow: '0px 0px 5px rgba(255, 255, 255, 1)' } : {}}
                                                    >
                                                        {item.label}
                                                    </button>
                                                )
                                            ))}
                                        </div>
                                    </div>



                                    <BotonLlamativo className='max-md:hidden' colorBase='#F42A2A' onClick={handleBtnClick}>
                                        Lanzar Sistema
                                    </BotonLlamativo>


                                    <div className="-mr-2 flex md:hidden">
                                        {/* Mobile menu button */}
                                        <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-white  border-white hover:bg-orange-700 hover:text-white focus:border-none focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-800">
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
                                                onClick={() => item.label === 'Sistema' ? handleBtnClick() : handleClick(sections?.[link.indexOf(item) - 1])}
                                                className={classNames(
                                                    refSelected === link.indexOf(item) - 1 ? 'bg-orange-900 text-white' : 'text-gray-300 hover:bg-orange-700 hover:text-white',
                                                    'w-full block rounded-md px-3 py-2 text-base font-medium'
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