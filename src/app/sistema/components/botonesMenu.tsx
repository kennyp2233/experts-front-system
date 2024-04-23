export default function BotonesMenu({ titulo, icono, onClick, className }: { titulo: string, icono: any, onClick?: () => void, className?: string }) {
    return (
        <button className={"card btn bg-base-100 shadow-xl h-fit " + className} onClick={onClick}>
            <figure className="px-10 pt-10 text-8xl">
                {icono}
            </figure>
            <div className="card-body items-center text-center h-fit">
                <h2 className="card-title">{titulo}</h2>
            </div>
        </button>
    );
}