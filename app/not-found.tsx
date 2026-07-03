"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from './componentes/button'
import { HiArrowNarrowLeft } from 'react-icons/hi'
import { useLanguage } from './componentes/context/language-context'

export default function NotFound() {
  const { translations } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-9xl font-bold text-blue-800">404</h1>
      <h2 className="text-3xl font-medium text-gray-400 mb-4">
        {translations.notFound.title}
      </h2>
      <Link href="/">
        <Button>
          <HiArrowNarrowLeft size={20} />
          {translations.notFound.backToHome}
        </Button>
      </Link>
    </div>
  )
}