'use client';

import { useRef, useState, useEffect } from 'react';
import Navbar from '@/components/landing/navbar';
import Hero from '@/components/landing/sections/hero';
import About from '@/components/landing/sections/about';
import LogisticsInfrastructure from '@/components/landing/sections/LogisticInfraestructure';
import GlobalDestinations from '@/components/landing/sections/GlobalDestinations';
import ContactForm from '@/components/landing/sections/contact';
import ExperienceTimeline from '@/components/landing/sections/ExperienceTimeline';
import useHashNavigation from '@/utils/hashNavigationHandler';

export default function LandingPage() {
  // Referencias para cada sección
  const aboutRef = useRef<HTMLElement>(null);
  const infrastructureRef = useRef<HTMLElement>(null);
  const destinationsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLElement>(null);

  // Agrupar las referencias para el controlador de navegación
  const sectionRefs = {
    'about': aboutRef,
    'infrastructure': infrastructureRef,
    'destinations': destinationsRef,
    'contact': contactRef,
    'timeline': timelineRef
  };

  // Usar el controlador de navegación por hash
  const { navigateToSection } = useHashNavigation(sectionRefs);

  // Para la animación de "listo para navegar"
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    // Marcar como cargado después de un breve retraso
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="overflow-x-hidden">
      <Navbar
        sections={[aboutRef, infrastructureRef, destinationsRef, contactRef]}
      />

      <Hero />

      {/* Sección About con ID para SEO */}
      <section id="about">
        <About ref={aboutRef} />
      </section>

      {/* Sección Timeline (integrada en About para SEO) */}
      <section id="timeline">
        <ExperienceTimeline ref={timelineRef} />
      </section>

      {/* Sección Infraestructura con ID para SEO */}
      <section id="infrastructure">
        <LogisticsInfrastructure ref={infrastructureRef} />
      </section>

      {/* Sección Destinos con ID para SEO */}
      <section id="destinations">
        <GlobalDestinations ref={destinationsRef} />
      </section>

      {/* Sección Contacto con ID para SEO */}
      <section id="contact">
        <ContactForm ref={contactRef} />
      </section>
    </main>
  );
}