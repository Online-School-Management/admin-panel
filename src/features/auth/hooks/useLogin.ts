import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { login } from '../services/auth.service'
import type { LoginCredentials } from '../types/auth.types'
import { toast } from '@/hooks/use-toast'

/**
 * Login mutation hook
 * Handles login logic with TanStack Query
 */
export function useLogin() {
  const navigate = useNavigate()
  const { login: setAuth } = useAuthStore()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (data) => {
      // Update auth store with user and token
      setAuth(data.user, data.token)
      
      // Show success toast
      toast({
        title: 'Login successful',
        description: `Welcome back, ${data.user.name}!`,
      })

      // Redirect to dashboard
      navigate('/dashboard')
    },
    onError: (error: Error) => {
      // Show error toast
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      })
    },
  })
}


