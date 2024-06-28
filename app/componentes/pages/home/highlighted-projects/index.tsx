import { HorizontalDivider } from "@/app/componentes/divider/horizontal"
import { SectionTitle } from "@/app/componentes/section-title"
import { ProjectCard } from "./project-card"
import { Link } from "@/app/componentes/link"
import { HiArrowNarrowRight } from "react-icons/hi"

export const HighlightedProjects = () => {
    return (
        <section className="container py-16">
            <SectionTitle subtitle="destaques" title="Projetos"/>
            <HorizontalDivider className="mb-16"/>

            <div>
                <ProjectCard/>
                <HorizontalDivider className="my-16"/>

                <p className="flex items-center gap-1.5">
                    <span className="text-gray-400">Se interessou?</span>
                    <Link href="/projects" className="inline-flex" >
                    Ver todos
                    <HiArrowNarrowRight size={18} />
                    </Link>
                </p>
            </div>
        </section>
    )
}
