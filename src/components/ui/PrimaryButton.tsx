
type Props = {
    text: string;
    onClick: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
}

export function PrimaryButton({text, onClick, className, type = "button"} : Props){
    return (
        <button
            onClick={onClick}
            type={type}
            aria-label={text}
            className={`transition-colors border-none outline-none bg-slate-700 text-white  font-semibold px-5 py-2 hover:bg-gray-700 ${className}`}
            >
            {text}
        </button>
    )
}