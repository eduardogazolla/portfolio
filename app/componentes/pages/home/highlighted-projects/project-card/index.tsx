import { Link } from "@/app/componentes/link"
import { TechBagde } from "@/app/componentes/tech-bagde"
import Image from "next/image"
import { HiArrowNarrowRight } from "react-icons/hi"

export const ProjectCard = () => {
    return (
        <div className="flex gap-6 lg:gap-12 flex-col lg:flex-row">
            <div className="w-full h-full">
                <Image
                width={420}
                height={304}
                src="https://i.imgur.com/UEfknCw.png"
                alt="Thumbnail do projeto Ponto Fácil"
                className="w-full h-[200px] sm:h-[300px] lg:w-[420px] lg:min-h-full object-cover rounded-lg aspect-auto"
                />
            </div>
            <div>
                <h3 className="flex items-center gap-3 font-medium text-lg text-gray-50">
                <Image
                width={20}
                height={20}
                alt=""
                src="/images/icons/project-title-icon.svg"
                />
                Ponto Fácil (em desenvolvimento)
                </h3>

                <p className="text-gray-400 my-6">
                    Esse é um projeto acadêmico, feito com um amigo. Aqui temos o projeto Ponto Fácil, onde estamos construindo um site para o registro de ponto de uma determinada empresa, o qual, irá ser utilizado por meio de um domínio próprio da empresa, somente os computadores conectados na rede da empresa poderão acessar o site para realizar o registro de ponto diário de cada funcionário.
                </p>

                <div className="flex gap-x-2 gap-y-3 flex-wrap mb-8 lg:max-w-[350px]">
                    <TechBagde name="HTML5" />
                    <TechBagde name="CSS3" />
                    <TechBagde name="JavaScript" />
                    <TechBagde name="Firebase" />
                </div>

                <Link href="https://github.com/eduardogazolla/projeto-integrador"> 
                Ver repositório
                <HiArrowNarrowRight/>
                </Link>
            </div>
        </div>
    )
}