'use client';
import ReturnButton from "@/app/sistema/components/returnButton";
import { useRouter } from "next/navigation";
export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    return (


        <section className="hero-content gap-0 flex-col justify-start h-full w-full max-w-screen-xl p-0">

            {children}
        </section>
    );
}