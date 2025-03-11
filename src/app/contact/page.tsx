// src/app/contact/page.tsx - Página de Contacto
export default function ContactPage() {
    return (
        <div className="redirect-page">
            <script
                dangerouslySetInnerHTML={{
                    __html: `
              // Redirigir a la página principal con hash para la sección contact
              window.location.href = '/#contact';
            `,
                }}
            />
        </div>
    );
}

// Metadata para SEO
export const metadata = {
    title: 'ExpertGuide | Contacto - Solicita información sobre servicios de exportación',
    description: 'Contáctanos para obtener información sobre nuestros servicios de logística y exportación de flores. Estamos ubicados en Sangolquí, Ecuador.',
    keywords: 'contacto logística, cotización exportación flores, transporte refrigerado Ecuador'
};