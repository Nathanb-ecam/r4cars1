import { useState } from "react";

interface Props{
    title:string;
    label:string;
    initiallyChecked:boolean;
    onToggle:()=>void;
}

export default function ToggleSwitch({title,label, initiallyChecked, onToggle} : Props){
    const [checked, setChecked] = useState(initiallyChecked ?? false);

    return <div className="mt-2">
            <label htmlFor={label} className="flex items-center cursor-pointer">                
                <div className="relative">
                    <input
                        id={label}
                        type="checkbox"
                        checked={checked}
                        onChange={()=>{
                            onToggle?.();       
                            setChecked(!checked);
                        }}
                        className="sr-only"
                    />
                    <div
                        className={`block w-10 h-6 rounded-full transition-colors duration-300 ${
                        checked ? 'bg-indigo-500' : 'bg-gray-300'
                        }`}
                    ></div>
                    <div
                        className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                        checked ? 'transform translate-x-4' : ''
                        }`}
                    ></div>
                </div>
                <span className="text-sm font-medium text-gray-700 ml-3">{title}</span>
            </label>
    </div>
}