// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/sistema/initial/login/', '/sistema/dashboard/'],
        },
        sitemap: 'https://expertshcargo.com/sitemap.xml', // Reemplaza con tu URL real
    };
}