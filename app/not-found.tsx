"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from './componentes/button'
import { HiArrowNarrowLeft } from 'react-icons/hi'

export default function NotFound() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-9xl font-bold text-blue-800">404</h1>
      <h2 className="text-3xl font-medium text-gray-400 mb-4">
        Página não encontrada
      </h2>
      <Link href="/">
        <Button>
          <HiArrowNarrowLeft size={20} />
          Voltar para Home
        </Button>
      </Link>
    </div>
  )
}