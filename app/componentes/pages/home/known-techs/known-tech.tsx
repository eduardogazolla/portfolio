"use client";

import { CMSIcon } from "@/app/componentes/cms-icon"
import { KnownTech as IKnownTech } from "@/app/types/projects"
import { getRelativeTimeString } from "@/app/utils/get-relative-time"
import { useLanguage } from "@/app/componentes/context/language-context"

 type KnowTechProps = {
    tech: IKnownTech
 }

export const KnowTech = ({tech}: KnowTechProps) => {
    const { locale, translations } = useLanguage();
    
    const rawRelativeTime = getRelativeTimeString(new Date(tech.startDate), locale);
    const relativeTime = locale === "en"
        ? rawRelativeTime.replace(" ago", "")
        : rawRelativeTime.replace("há", "").trim();

    return (
        <div className="p-6 rounded-lg bg-gray-600/20 text-gray-500 flex flex-col gap-2 hover:text-blue-500 hover:bg-gray-600/30 transition-all">
            <div className="flex item-center justify-between">
                <p className="font-medium">{tech.name}</p>
                <CMSIcon icon={tech.iconSvg} />
            </div>
            <span>{relativeTime} {translations.knownTechs.experience}</span>
        </div>
    )
}