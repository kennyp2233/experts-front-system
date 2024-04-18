import { Inter } from "next/font/google";
import "./styles/global.css";
import NavBar from "./components/navbar";


const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="es">
      <body className={inter.className} data-theme="cupcake">
        <NavBar />
        {children}
        <footer className="footer footer-center p-4 bg-base-300 text-base-content">
          <aside>
            <p>Copyright © 2024 - All right reserved by Kenny Pinchao</p>
          </aside>
        </footer>
      </body>
    </html>
  );
}
