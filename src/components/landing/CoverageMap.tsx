import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl, Tooltip } from 'react-leaflet';
import L, { LatLngExpression, Icon, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importa las imágenes directamente (mantenemos esto por compatibilidad)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuración de íconos para Leaflet (para fallback)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const CoverageMap: React.FC = () => {
    // Mantener el useEffect que ya tienes funcionando
    useEffect(() => {
        const mapContainer = document.getElementById('map');
        if (mapContainer && (mapContainer as any)._leaflet_id) {
            (mapContainer as any)._leaflet_id = null;
        }
    }, []);

    // Crear iconos personalizados con HTML y CSS (similar a como lo haría react-icons)
    const createCustomIcon = (type: 'airport' | 'office' | 'destination') => {
        // Definir el HTML para cada tipo de icono
        let iconHtml = '';
        let iconClass = '';

        switch (type) {
            case 'airport':
                // Icono de avión
                iconHtml = `<div class="custom-div-icon">
                    <div class="marker-pin airport-pin">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                        </svg>
                    </div>
                </div>`;
                iconClass = 'airport-icon';
                break;

            case 'office':
                // Icono de edificio/oficina
                iconHtml = `<div class="custom-div-icon">
                    <div class="marker-pin office-pin">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                        </svg>
                    </div>
                </div>`;
                iconClass = 'office-icon';
                break;

            case 'destination':
                // Icono de destino
                iconHtml = `<div class="custom-div-icon">
                    <div class="marker-pin destination-pin">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                    </div>
                </div>`;
                iconClass = 'destination-icon';
                break;
        }

        // Crear un div icon con el HTML que contiene el SVG
        return new L.DivIcon({
            html: iconHtml,
            className: `custom-marker ${iconClass}`,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -35]
        });
    };

    // Agregar estilos CSS para los iconos personalizados
    useEffect(() => {
        // Crear un elemento de estilo
        const style = document.createElement('style');
        style.id = 'map-custom-icons-style';

        // Definir los estilos para los iconos personalizados
        style.innerHTML = `
            .custom-marker {
                background: transparent;
                border: none;
            }
            
            .custom-div-icon {
                position: relative;
                width: 40px;
                height: 40px;
            }
            
            .marker-pin {
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                background: #007BFF;
                position: absolute;
                transform: rotate(-45deg);
                left: 50%;
                top: 50%;
                margin: -15px 0 0 -15px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
            }
            
            .marker-pin svg {
                transform: rotate(45deg);
                color: white;
            }
            
            .airport-pin {
                background: #4285F4;
            }
            
            .office-pin {
                background: #34A853;
            }
            
            .destination-pin {
                background: #EA4335;
            }
        `;

        // Agregar el estilo al head si no existe
        if (!document.getElementById('map-custom-icons-style')) {
            document.head.appendChild(style);
        }

        // Limpiar al desmontar
        return () => {
            const existingStyle = document.getElementById('map-custom-icons-style');
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, []);

    // Coordenadas como objetos para mejor organización
    const locations = useMemo(() => ({
        tababela: {
            position: [-0.1807, -78.4678] as LatLngExpression,
            name: 'Aeropuerto de Tababela',
            description: 'Punto de Operación Principal',
            type: 'airport' as const
        },
        sangolqui: {
            position: [-0.25, -78.57] as LatLngExpression,
            name: 'Oficinas en Sangolquí',
            description: 'Centro de operaciones y logística',
            type: 'office' as const
        },
        moscow: {
            position: [55.4088, 37.9006] as LatLngExpression,
            name: 'Aeropuerto de Domodedovo',
            description: 'Destino de Exportación: Rusia',
            type: 'destination' as const
        }
    }), []);

    // Centro aproximado para visualizar la ruta
    const mapCenter: LatLngExpression = [27.61, -20.28];

    // Estilo mejorado para el contenedor
    const mapContainerStyle = {
        height: '100%',
        width: '100%',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    };

    // Estilo para la línea de ruta
    const routeOptions = {
        color: '#FF4136',
        weight: 3,
        opacity: 0.7,
        dashArray: '5, 10',
        lineCap: 'round' as L.LineCapShape
    };

    // Función para crear HTML personalizado para los popups
    const createPopupContent = (name: string, description: string, type: string) => {
        return `
            <div style="font-family: Arial, sans-serif; padding: 2px;">
                <h3 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">${name}</h3>
                <p style="margin: 0; color: #666; font-size: 14px;">${description}</p>
                <div style="margin-top: 8px; font-size: 12px; color: #999;">
                    <span>${type}</span>
                </div>
            </div>
        `;
    };

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            <MapContainer
                id="map"
                center={mapCenter}
                zoom={3}
                scrollWheelZoom={true}
                style={mapContainerStyle}
                zoomControl={false} // Desactivar controles default para reposicionarlos
                attributionControl={false} // Mover los créditos a una posición mejor
            >
                {/* TileLayer en modo Dark con mejores opciones */}
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    maxZoom={19}
                    subdomains="abcd"
                    detectRetina={true}
                />

                {/* Marcadores con iconos personalizados */}
                <Marker
                    position={locations.tababela.position}
                    icon={createCustomIcon(locations.tababela.type)}
                >
                    <Popup>
                        <div dangerouslySetInnerHTML={{
                            __html: createPopupContent(
                                locations.tababela.name,
                                locations.tababela.description,
                                'Aeropuerto de Origen'
                            )
                        }} />
                    </Popup>
                    <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
                        {locations.tababela.name}
                    </Tooltip>
                </Marker>

                <Marker
                    position={locations.sangolqui.position}
                    icon={createCustomIcon(locations.sangolqui.type)}
                >
                    <Popup>
                        <div dangerouslySetInnerHTML={{
                            __html: createPopupContent(
                                locations.sangolqui.name,
                                locations.sangolqui.description,
                                'Oficina Central'
                            )
                        }} />
                    </Popup>
                    <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
                        {locations.sangolqui.name}
                    </Tooltip>
                </Marker>

                <Marker
                    position={locations.moscow.position}
                    icon={createCustomIcon(locations.moscow.type)}
                >
                    <Popup>
                        <div dangerouslySetInnerHTML={{
                            __html: createPopupContent(
                                locations.moscow.name,
                                locations.moscow.description,
                                'Aeropuerto de Destino'
                            )
                        }} />
                    </Popup>
                    <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
                        {locations.moscow.name}
                    </Tooltip>
                </Marker>

                {/* Ruta de exportación mejorada */}
                <Polyline
                    positions={[locations.tababela.position, locations.moscow.position]}
                    pathOptions={routeOptions}
                >
                    <Tooltip sticky>Ruta de exportación principal</Tooltip>
                </Polyline>

                {/* Controles de mapa reposicionados */}
                <ZoomControl position="bottomright" />
            </MapContainer>

            {/* Overlay para leyenda del mapa */}
            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '8px',
                borderRadius: '4px',
                fontSize: '12px',
                maxWidth: '200px',
                zIndex: 1000
            }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Leyenda</div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#4285F4',
                        borderRadius: '50% 50% 50% 0',
                        transform: 'rotate(-45deg)',
                        marginRight: '8px'
                    }}></div>
                    <span>Aeropuerto de origen</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#34A853',
                        borderRadius: '50% 50% 50% 0',
                        transform: 'rotate(-45deg)',
                        marginRight: '8px'
                    }}></div>
                    <span>Oficinas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#EA4335',
                        borderRadius: '50% 50% 50% 0',
                        transform: 'rotate(-45deg)',
                        marginRight: '8px'
                    }}></div>
                    <span>Destino de exportación</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '15px', height: '2px', backgroundColor: '#FF4136', marginRight: '5px' }}></div>
                    <span>Ruta de exportación</span>
                </div>
            </div>
        </div>
    );
};

export default CoverageMap;