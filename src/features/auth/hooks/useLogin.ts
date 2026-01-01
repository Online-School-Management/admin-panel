import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { login } from '../services/auth.service'
import type { LoginCredentials } from '../types/auth.types'
import { toast } from '@/hooks/use-toast'
import { showErrorToast } from '@/utils/toast'

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
    onError: (error: unknown) => {
      // Show error toast with API error message
      showErrorToast(error, { title: 'Login Failed' })
    },
  })
}


