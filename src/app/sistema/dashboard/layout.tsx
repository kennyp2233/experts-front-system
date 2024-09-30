export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="hero-content flex-col justify-start w-full h-full">
            {children}
        </section>
    );
}