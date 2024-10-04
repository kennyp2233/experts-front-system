'use client';
import ProtectedRoute from "@/app/sistema/components/protectedRoute";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    /*
    return (
        <ProtectedRoute
            adminOnly={true}
        >
            {children}
        </ProtectedRoute>
    );
    */
    return (

        children

    );
}