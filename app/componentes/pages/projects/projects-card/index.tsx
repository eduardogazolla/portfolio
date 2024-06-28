import Image from 'next/image'

export const ProjectCard = () => {
    return (
        <div className='rounded-lg h-[436px] flex flex-col bg-gray-800 overflow-hidden border-2 border-gray-800 hover:border-purple-500 opacity-70 hover:opacity-100 transition-all group'>
            <div className='w-full h-48 overflow-hidden'>
                <Image
                src="https://i.imgur.com/UEfknCw.png"
                width={380}
                height={200}
                alt="Thumbnail do projeto Ponto Fácil"
                unoptimized
                className='w-full h-full object-cover group-hover:scale-110 duration-500 transition-all'
                />
            </div>
            <div className='flex-1 flex flex-col p-8'>
                <strong className='font-medium text-gray-50/90 group-hover:text-purple-500 transition-all'>Ponto Fácil</strong>
                <p className='mt-2 text-gray-400 line-clamp-4'>Esse é um projeto acadêmico, feito com um amigo. Aqui temos o projeto Ponto Fácil, onde estamos construindo um site para o registro de ponto de uma determinada empresa, o qual, irá ser utilizado por meio de um domínio próprio da empresa, somente os computadores conectados na rede da empresa poderão acessar o site para realizar o registro de ponto diário de cada funcionário.</p>
                <span className='text-gray-300 text-sm font-medium block mt-auto truncate'>HTML5, CSS3, JavaScript, Firebase</span>
            </div>
        </div>
    )
}