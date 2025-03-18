import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Experts Handling Cargo",
  description: "We are the best in the business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="es">
      <body className={inter.className} style={{ background: "transparent" }}>
        {children}
      </body>
    </html>
  );
}
