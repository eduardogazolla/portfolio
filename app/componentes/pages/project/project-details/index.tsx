import { Button } from "@/app/componentes/button"
import { SectionTitle } from "@/app/componentes/section-title"
import { TechBagde } from "@/app/componentes/tech-bagde"
import { TbBrandGithub } from "react-icons/tb"
import {FiGlobe} from "react-icons/fi"
import { Link } from "@/app/componentes/link"
import { HiArrowNarrowLeft } from "react-icons/hi"

export const ProjectDetails = () =>{
    return (
        <section className="w-full sm:min-h-[750px] flex flex-col items-center justify-end relative pb-10 sm:pb-24 py-14 px-6 overflow-hidden">
            <div
            className="absolute inset-0 z-[-1] "
            style={{
                background: 'url(/images/hero-bg.png) no-repeat center/cover, url(https://i.imgur.com/UEfknCw.png) no-repeat center/cover'
            }}
            />

            <SectionTitle
            subtitle="projetos"
            title="Ponto Fácil"
            className="text-center items-center sm:[&>h3]:text-4xl"
            />
            
            <p className="text-gray-400 text-center max-w-[640px] my-4 sm:my-6 text-sm sm:text-base">
            Esse é um projeto acadêmico, feito com um amigo. Aqui temos o projeto Ponto Fácil, onde estamos construindo um site para o registro de ponto de uma determinada empresa, o qual, irá ser utilizado por meio de um domínio próprio da empresa, somente os computadores conectados na rede da empresa poderão acessar o site para realizar o registro de ponto diário de cada funcionário.
            </p>
            <div className="w-full max-w[330px] flex flex-wrap gap-2 items-center justify-center">
                <TechBagde name={"HTML5"}/>
                <TechBagde name={"CSS3"}/>
                <TechBagde name={"JavaScript"}/>
                <TechBagde name={"Firebase"}/>
            </div>
            <div className="my-6 sm:my-12 flex items-center gap-2 sm:gap-4 flex-col sm:flex-row">
                <a href="https://github.com/eduardogazolla/projeto-integrador" target="_blank">
                    <Button className="min-w-[180px]">
                        <TbBrandGithub size={20}/>
                        Repositório
                    </Button>
                </a>

                <a href="https://github.com/eduardogazolla/projeto-integrador" target="_blank">
                    <Button className="min-w-[180px] ">
                        <FiGlobe size={20}/>
                        Projeto Online
                    </Button>
                </a>
            </div>
            <Link href={'/projects'}>
                <HiArrowNarrowLeft size={20}/>
                Voltar para projetos
            </Link>

        </section>
    )
}