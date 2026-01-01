import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { logout as logoutApi } from '../services/auth.service'
import { toast } from '@/hooks/use-toast'

/**
 * Logout mutation hook
 * Handles logout logic with API call
 */
export function useLogout() {
  const navigate = useNavigate()
  const { logout: clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      // Clear auth store
      clearAuth()
      
      // Show success toast
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      })

      // Redirect to login
      navigate('/login')
    },
    onError: () => {
      // Even if API call fails, clear local state
      clearAuth()
      
      // Show info toast since logout still succeeded locally
      toast({
        title: 'Logged out',
        description: 'You have been logged out locally.',
      })

      // Redirect to login
      navigate('/login')
    },
  })
}



