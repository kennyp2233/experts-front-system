import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    const { nombre, email, telefono, empresa, servicio, mensaje } = await req.json();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false, // 🚨 Desactiva la verificación de certificados
        },
    });


    try {
        await transporter.sendMail({
            from: `"${nombre}" <${email}>`,
            to: 'kennyp41234@gmail.com',
            subject: 'Nueva consulta de contacto',
            html: `
                <h3>Nuevo mensaje de contacto</h3>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${telefono}</p>
                <p><strong>Empresa:</strong> ${empresa || 'No especificado'}</p>
                <p><strong>Servicio interesado:</strong> ${servicio}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${mensaje}</p>
            `,
        });

        return NextResponse.json({ message: 'Correo enviado con éxito' }, { status: 200 });
    } catch (error) {
        console.error('Error enviando correo:', error);
        return NextResponse.json({ message: 'Error al enviar correo' }, { status: 500 });
    }
}
