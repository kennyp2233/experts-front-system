'use client';
import { Poppins } from "next/font/google";
import "./styles/global.css";
import NavBar from "./components/navbar";
import { AuthProvider } from "./providers/authProvider";
import { useState } from "react";
import { SistemStateProvider } from './providers/sistemStateContext';
import { AdminModulesProvider } from "./providers/adminModulesProvider";
import { MantenimientoProvider } from "./providers/mantenimientoProvider";
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

  return (
    <>
      <AuthProvider>
        <SistemStateProvider>
          <AdminModulesProvider>

            <MantenimientoProvider>


              <html lang="es">
                <body data-theme="cupcake">
                  <div className={inter.className}>
                    <EventAlerts />
                    <NavBar />
                    {children}
                    <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                      <aside>
                        <p>Copyright © 2024 - All right reserved by <a className="btn btn-active btn-link p-0" href="https://www.linkedin.com/in/kenny-pinchao-54543825b">Kenny Pinchao</a></p>
                      </aside>
                    </footer>
                  </div>
                </body>
              </html>



            </MantenimientoProvider>
          </AdminModulesProvider>
        </SistemStateProvider>
      </AuthProvider>

    </>
  );
}
