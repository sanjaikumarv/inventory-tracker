'use client'
import { useAuth } from '@/lib/AuthContext'
import { useEffect } from 'react'

export default function Page() {
  const { logout } = useAuth()

  useEffect(() => {
    logout()
  }, [])

}
