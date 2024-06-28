import { SectionTitle } from "@/app/componentes/section-title"
import { KnowTech } from "./known-tech"
import { TbBrandHtml5 } from "react-icons/tb"
import { KnownTech as IKnownTech } from "@/app/types/projects"

type KnownTechsProps = {
    techs: IKnownTech[]
}

export const KnownTechs = ({techs}: KnownTechsProps) => {
    return(
        <section className="container py-16">
            <SectionTitle subtitle="competências" title="Conhecimentos" />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(264px,1fr))] gap-3 mt-[60px]">
                {techs?.map((tech) => (
                    <KnowTech key={tech.name} tech={tech}/>
                ))}
                
            </div>
        </section>
    )
}