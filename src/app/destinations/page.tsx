export default function DestinationsPage() {
    return (
        <div className="redirect-page">
            <script
                dangerouslySetInnerHTML={{
                    __html: `
              // Redirigir a la página principal con hash para la sección destinations
              window.location.href = '/#destinations';
            `,
                }}
            />
        </div>
    );
}

// Metadata para SEO
export const metadata = {
    title: 'ExpertGuide | Destinos Internacionales - Mercados de Exportación de Flores',
    description: 'Conectamos las flores ecuatorianas con mercados internacionales en América, Europa y Asia. Conoce nuestras rutas y destinos principales de exportación.',
    keywords: 'exportación a Estados Unidos, exportación Europa, fletes aéreos, carga flores'
};