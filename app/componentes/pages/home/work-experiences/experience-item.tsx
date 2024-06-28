import { TechBagde } from "@/app/componentes/tech-bagde"
import Image from "next/image"

export const ExperienceItem = () => {
    return(
        <div className="grid grid-cols-[40px,1fr] gap-4 md:gap-10">
            <div className="flex flex-col items-center gap-4">
                <div className="rounded-full border border-gray-500 p-0.5">
                    <Image 
                    src="https://images.tcdn.com.br/img/img_prod/677766/1706630151_48x48px.ico"
                    width={40}
                    height={40}
                    className="rounded-full"
                    alt="Logo Loja Comac"
                    />
                </div>
                <div className="h-full w-[1px] bg-gray-800"></div>
            </div>

            <div>
                <div className="flex flex-col gap-2 text-sm sm:text-base">
                    <a 
                    href="https://www.instagram.com/e.comac"
                    target="_blank"
                    className="text-gray-500 hover:text-purple-500 transition-colors"
                    >
                        @e.comac
                    </a>
                    <h4 className="text-gray-300">Auxiliar Administrativo</h4>
                    <span className="text-gray-500"> jan 2023 • O momento • (1 ano)</span>
                    <p className="text-gray-400">
                        Auxílio para com o administrativo, consulta e alteração em banco de dados, atendimento ao cliente, geração de relatórios, logística de frete.
                    </p>
                </div>
                <p className="text-gray-400 text-sm mb-3 mt-6 font-semibold">Competências</p>
                <div className="flex gap-x-2 gap-y-3 flex-wrap lg:max-w-[350px] mb-8">
                    <TechBagde name="Excel" />
                    <TechBagde name="Word" />
                    <TechBagde name="Banco de Dados" />
                    <TechBagde name="Atendimento a cliente" />
                </div>
            </div>
        </div>
    )
}