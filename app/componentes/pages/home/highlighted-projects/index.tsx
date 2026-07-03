"use client";

import { HorizontalDivider } from "@/app/componentes/divider/horizontal"
import { SectionTitle } from "@/app/componentes/section-title"
import { ProjectCard } from "./project-card"
import { Link } from "@/app/componentes/link"
import { HiArrowNarrowRight } from "react-icons/hi"
import { Project } from "@/app/types/projects"
import { useLanguage } from "@/app/componentes/context/language-context";

type HighlightedProjectsProps = {
    projects: Project[]
}

export const HighlightedProjects = ({projects}: HighlightedProjectsProps) => {
    const { translations } = useLanguage();

    return (
        <section className="container py-16">
            <SectionTitle subtitle={translations.highlightedProjects.subtitle} title={translations.highlightedProjects.title}/>
            <HorizontalDivider className="mb-16"/>

            <div>
                {projects?.map(project => (
                    <div key={project.slug}>
                        <ProjectCard project={project} />
                        <HorizontalDivider className="my-16"/>
                    </div>
                ))}
                
                <p className="flex items-center gap-1.5">
                    <span className="text-gray-400">{translations.highlightedProjects.interested}</span>
                    <Link href="/projects" className="inline-flex" >
                    {translations.highlightedProjects.viewAll}
                    <HiArrowNarrowRight size={18} />
                    </Link>
                </p>
            </div>
        </section>
    )
}
