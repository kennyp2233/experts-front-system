'use client';
import ProtectedRoute from "@/components/sistema/protectedRoute";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ProtectedRoute allowedRoles={['admin']}> {/* Ajusta los roles permitidos según sea necesario */}
            <section className="hero-content flex-col justify-start w-[100dvw] h-full">
                {children}
            </section>
        </ProtectedRoute>
    );
}
