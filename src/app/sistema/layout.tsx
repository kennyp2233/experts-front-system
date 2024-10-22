'use client';
import { useEffect, useState } from 'react';
import { Poppins } from "next/font/google";
import "./styles/global.css";
import NavBar from "./components/navbar";
import { AuthProvider } from "../providers/authProvider";
import EventAlerts from "../utils/eventAlerts";

const inter = Poppins({
  subsets: ["latin"],
  weight: "400"
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [bodyClass, setBodyClass] = useState(inter.className);

  useEffect(() => {
    // Agregar las clases de Tailwind CSS después de que el componente se monte en el cliente
    setBodyClass(`${inter.className} bg-base-200 flex flex-col`);

  }, []);

  return (
    <AuthProvider>
      <html lang="es">
        <body className={bodyClass} data-theme="cupcake">
          <EventAlerts />
          <NavBar />

          <section className="hero min-h-screen w-full bg-base-200">
            {children}
          </section>
          <footer className="footer footer-center p-4 bg-base-300 text-base-content z-10">
            <aside>
              <p>
                Copyright © 2024 - All right reserved by
                <a
                  className="btn btn-active btn-link p-0"
                  href="https://www.linkedin.com/in/kenny-pinchao-54543825b"
                >
                  Kenny Pinchao
                </a>
              </p>
            </aside>
          </footer>
        </body>
      </html>
    </AuthProvider>
  );
}
