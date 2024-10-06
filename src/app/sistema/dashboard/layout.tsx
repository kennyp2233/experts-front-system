export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="hero-content flex-col justify-start w-[100dvw] h-full">
            {children}
        </section>
    );
}