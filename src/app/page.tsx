'use client'
import Hero from "./hero";
import About from "./about";
import NavBar from "./components/navbar";
import { useRef } from "react";
import React from "react";

export default function Page() {
  const sectionRefs = [React.createRef(), React.createRef()];

  return (
    <>
      <NavBar sections={sectionRefs} />
      <div className="overflow-x-hidden">
        <Hero ref={sectionRefs[0]} />
        <About ref={sectionRefs[1]} />
      </div>
    </>
  );
}