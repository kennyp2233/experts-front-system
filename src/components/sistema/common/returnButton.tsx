export default function ReturnButton({ onClick, text, className }: { onClick: () => void, text: string, className?: string }) {
    return (
        <button className={"z-10 btn btn-neutral self-start place-self-start " + className} onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path fill="currentColor" d="M12 9.059V6.5a1.001 1.001 0 0 0-1.707-.708L4 12l6.293 6.207a.997.997 0 0 0 1.414 0A.999.999 0 0 0 12 17.5v-2.489c2.75.068 5.755.566 8 3.989v-1c0-4.633-3.5-8.443-8-8.941" /></svg>
            <p>{text}</p>
        </button>
    );
}