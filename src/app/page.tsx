'use client';
import Hero from "../components/landing/sections/hero";
import About from "../components/landing/sections/about";
import Contact from "../components/landing/sections/contact";
import Navbar from "../components/landing/navbar";
import { useRef } from "react";
import React from "react";
import LogisticsInfrastructure from "@/components/landing/sections/LogisticInfraestructure";
import GlobalDestinations from "@/components/landing/sections/GlobalDestinations";
import ExperienceTimeline from "@/components/landing/sections/ExperienceTimeline";

export default function Page() {
  const sectionRefs: React.RefObject<HTMLElement>[] = [React.createRef(), React.createRef(), React.createRef()];

  return (
    <>
      <Navbar sections={sectionRefs} />
      <div className="overflow-x-hidden">
        <Hero ref={sectionRefs[0]} />
        <About ref={sectionRefs[1]} />
        <LogisticsInfrastructure />
        <GlobalDestinations />
        <ExperienceTimeline />
        <Contact ref={sectionRefs[2]} />

      </div>
    </>
  );
}