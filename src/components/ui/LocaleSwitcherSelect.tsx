'use client';

import { Locale, routing, usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { ReactNode } from "react";

type Props = {
    children : ReactNode;
    defaultValue : string;
    label : string;
}

export default function LocaleSwitcherSelect({defaultValue, children, label} : Props){
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    function onSelectChange(nextLocale: string){
        router.replace(
            // @ts-expect-error -- TypeScript will validate that only known `params`
            // are used in combination with a given `pathname`. Since the two will
            // always match for the current route, we can skip runtime checks.
            { pathname, params },
            { locale: nextLocale as Locale }
        )
    }
    

    return (
        <select 
        defaultValue={defaultValue} onChange={(e)=>onSelectChange(e.target.value)}
        className="bg-inherit text-black rounded focus:outline-none focus:border-none"
        >
            {children}
        </select>
    )
}