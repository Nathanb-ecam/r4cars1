
type Props = {
    label: string;
    type?: "text" | "email" | "password";
    value: string;
    placeholder: string;
    onChange?: (value: string) => void;
    className?: string;
    required?: boolean;
    inputSize?: "sm" | "md" | "lg";
}

export function LabelInput({label, onChange, placeholder, type = "text", className, required = false, value, inputSize = "sm"}: Props){
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <label htmlFor={label} className='block text-sm font-semibold text-gray-800 hover:cursor-pointer'>{label}{required && '*'}</label>

            {inputSize === "lg" ? (
                <textarea required={required} id={label} value={value} className={`flex border border-gray-300 rounded-lg p-2 h-40 `} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} />
            ) : (
                <input required={required} id={label} type={type} value={value} className={`flex border border-gray-300 rounded-lg p-2 ${inputSize === "sm" ? "h-12" : inputSize === "md" ? "h-24" : ""}`}   onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} />
            )}
        </div>
    )
}