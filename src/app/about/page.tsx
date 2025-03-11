// src/app/about/page.tsx - Página Sobre Nosotros
export default function AboutPage() {
    return (
        <div className="redirect-page">
            <script
                dangerouslySetInnerHTML={{
                    __html: `
              // Redirigir a la página principal con hash para la sección about
              window.location.href = '/#about';
            `,
                }}
            />
        </div>
    );
}

// Metadata para SEO
export const metadata = {
    title: 'ExpertGuide | Sobre Nosotros - Empresa logística especializada en exportación de flores',
    description: 'Somos una empresa de planeación logística especializada en la exportación de flores al mundo. Conoce nuestra historia, valores y compromiso con la calidad.',
    keywords: 'exportación de flores, logística Ecuador, transporte refrigerado, cadena de frío'
};
