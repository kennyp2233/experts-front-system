'use client';
import ProtectedRoute from "../components/protectedRoute";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ProtectedRoute allowedRoles={['user', 'admin']}> {/* Ajusta los roles permitidos según sea necesario */}
            <section className="hero-content flex-col justify-start w-[100dvw] h-full">
                {children}
            </section>
        </ProtectedRoute>
    );
}
