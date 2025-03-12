import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";



const inter = Inter({ subsets: ["latin"] });

// src/app/page.tsx
export const metadata = {
  title: 'Experts Handling Cargo | Servicios logísticos para exportación de flores de Ecuador',
  description: 'Empresa ecuatoriana especializada en logística de exportación de flores. Ofrecemos transporte refrigerado, almacenamiento en frío y coordinación de envíos internacionales.',
  keywords: 'exportación flores, logística Ecuador, transporte refrigerado, cadena de frío'
};

// src/app/layout.tsx
export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Experts Handling Cargo",
              "legalName": "Experts Handling Cargo S.A.",
              "url": "https://expertshcargo.com",
              "logo": "https://expertshcargo.com/img/logo.png",
              "description": "Empresa ecuatoriana especializada en logística para exportación de flores",
              // Incluir secciones principales
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Servicios de Experts",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Transporte Refrigerado",
                      "url": "https://expertshcargo.com/#infrastructure"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Exportación Internacional",
                      "url": "https://expertshcargo.com/#destinations"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}