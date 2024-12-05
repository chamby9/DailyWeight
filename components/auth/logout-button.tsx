'use client'

import { FC } from 'react'
import { useRouter } from 'next/navigation'
import { handleLogout } from '@/lib/auth/logout'
import { Button } from '@/components/ui/button'

interface LogoutButtonProps {
  className?: string
}

export const LogoutButton: FC<LogoutButtonProps> = ({ className }) => {
  const router = useRouter()

  const onLogout = async () => {
    try {
      const { error } = await handleLogout()
      
      if (error) {
        throw error
      }
      
      // Redirect to login page after successful logout
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error during logout:', error)
      // Here you could add a toast notification for error feedback
    }
  }

  return (
    <Button 
      onClick={onLogout}
      variant="ghost"
      className={className}
    >
      Logout
    </Button>
  )
}

export default LogoutButton