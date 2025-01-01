'use client';
import ProtectedRoute from "@/app/sistema/components/protectedRoute";
import ReturnButton from "../../components/returnButton";
import { useRouter } from "next/navigation";
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

    const router = useRouter();
    return (
        <>
            <ReturnButton
                onClick={() => router.back()}
                text="Regresar"
            />
            {children}
        </>


    );
}