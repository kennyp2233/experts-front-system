
// src/app/infrastructure/page.tsx - Página de Infraestructura
export default function InfrastructurePage() {
    return (
        <div className="redirect-page">
            <script
                dangerouslySetInnerHTML={{
                    __html: `
              // Redirigir a la página principal con hash para la sección infrastructure
              window.location.href = '/#infrastructure';
            `,
                }}
            />
        </div>
    );
}

// Metadata para SEO
export const metadata = {
    title: 'ExpertGuide | Infraestructura Logística para Flores - Instalaciones y Tecnología',
    description: 'Nuestra infraestructura incluye instalaciones de almacenamiento refrigerado y flota de transporte especializada para mantener la cadena de frío de flores de exportación.',
    keywords: 'cuartos fríos, transporte refrigerado, cadena de frío, logística flores, Tababela'
};