export default function Boton({ children, onClick, style, className }: { children?: React.ReactNode, onClick?: () => void, style?: React.CSSProperties, className?: string }) {
    return (
        <button
            className={'flex items-center justify-center h-fit px-5 py-2 rounded-2xl border ' + className}
            onClick={onClick}
            style={{
                ...style,

            }}
        >
            {children}
        </button>
    );
}