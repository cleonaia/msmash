'use client'

import { useEffect } from 'react'

export default function AutoPrint() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.print()
    }, 250)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  return null
}
