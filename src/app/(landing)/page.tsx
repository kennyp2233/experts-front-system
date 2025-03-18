'use client';
import Hero from "../../components/landing/sections/hero";
import About from "../../components/landing/sections/about";
import Contact from "../../components/landing/sections/contact";
import Navbar from "../../components/landing/navbar";
import { useRef } from "react";
import React from "react";
import LogisticsInfrastructure from "@/components/landing/sections/LogisticInfraestructure";
import GlobalDestinations from "@/components/landing/sections/GlobalDestinations";
import ExperienceTimeline from "@/components/landing/sections/ExperienceTimeline";
import ShippingCalculator from "@/components/landing/sections/ShippingCalculator";
export default function Page() {
  // Crear 5 referencias para corresponder con los 5 enlaces de navegación
  // (Sistema no necesita ref porque redirecciona a otra página)
  const sectionRefs: React.RefObject<HTMLElement>[] = [
    React.createRef(), // Nuestra Empresa (Hero)
    React.createRef(), // Infraestructura (LogisticsInfrastructure)
    React.createRef(), // Destinos (GlobalDestinations)
    React.createRef(), // Contacto (Contact)
  ];

  return (
    <>
      <Navbar sections={sectionRefs} />
      <div className="overflow-x-hidden">
        {/* Asignar referencias a cada sección en el orden correcto */}
        <Hero ref={sectionRefs[0]} />
        <About /> {/* About puede quedarse sin ref si no está en la navegación */}
        <LogisticsInfrastructure ref={sectionRefs[1]} />
        <GlobalDestinations ref={sectionRefs[2]} />
        <ExperienceTimeline /> {/* Timeline puede quedarse sin ref si no está en la navegación */}
        <ShippingCalculator /> {/* Calculator puede quedarse sin ref si no está en la navegación */}
        <Contact ref={sectionRefs[3]} />
      </div>
    </>
  );
}