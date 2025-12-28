import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../services/user.service'
import {
  getMockUsers,
  getMockUserById,
  mockUsers,
} from '../data/mockUsers'
import type {
  CreateUserInput,
  UpdateUserInput,
  UserResponse,
  UsersResponse,
  User,
} from '../types/user.types'

// Set to true to use mock data, false to use API
const USE_MOCK_DATA = true

/**
 * Query keys for user-related queries
 */
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

/**
 * Hook to fetch all users with pagination
 */
export function useUsers(params?: {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}) {
  return useQuery<UsersResponse>({
    queryKey: userKeys.list(params),
    queryFn: () => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        return new Promise<UsersResponse>((resolve) => {
          setTimeout(() => {
            resolve(getMockUsers(params))
          }, 300)
        })
      }
      return getUsers(params)
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch a single user by ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        return new Promise<UserResponse>((resolve, reject) => {
          setTimeout(() => {
            const user = getMockUserById(id)
            if (user) {
              resolve({ user })
            } else {
              reject(new Error('User not found'))
            }
          }, 300)
        })
      }
      return getUserById(id)
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: CreateUserInput) => {
      if (USE_MOCK_DATA) {
        // Simulate API delay and create mock user
        await new Promise((resolve) => setTimeout(resolve, 500))
        const newUser: User = {
          id: String(mockUsers.length + 1),
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          role: data.role,
          userType: data.userType || 'individual',
          memberLevel: data.memberLevel || 'silver',
          status: data.status || 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        mockUsers.unshift(newUser) // Add to beginning of array
        return { user: newUser }
      }
      return createUser(data)
    },
    onSuccess: (response) => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      
      toast.success('User created successfully', {
        description: `${response.user.name} has been added.`,
      })
      
      // Navigate back to users list
      navigate('/users')
    },
    onError: (error: Error) => {
      toast.error('Failed to create user', {
        description: error.message || 'Something went wrong',
      })
    },
  })
}

/**
 * Hook to update an existing user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserInput }) => {
      if (USE_MOCK_DATA) {
        // Simulate API delay and update mock user
        await new Promise((resolve) => setTimeout(resolve, 500))
        const userIndex = mockUsers.findIndex((u) => u.id === id)
        if (userIndex === -1) {
          throw new Error('User not found')
        }
        const updatedUser: UserResponse['user'] = {
          ...mockUsers[userIndex],
          ...data,
          updatedAt: new Date().toISOString(),
        }
        mockUsers[userIndex] = updatedUser
        return { user: updatedUser }
      }
      return updateUser(id, data)
    },
    onSuccess: (response, variables) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) })
      
      toast.success('User updated successfully', {
        description: `${response.user.name} has been updated.`,
      })
      
      // Navigate back to users list
      navigate('/users')
    },
    onError: (error: Error) => {
      toast.error('Failed to update user', {
        description: error.message || 'Something went wrong',
      })
    },
  })
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_MOCK_DATA) {
        // Simulate API delay and delete mock user
        await new Promise((resolve) => setTimeout(resolve, 500))
        const userIndex = mockUsers.findIndex((u) => u.id === id)
        if (userIndex === -1) {
          throw new Error('User not found')
        }
        mockUsers.splice(userIndex, 1)
        return
      }
      return deleteUser(id)
    },
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      
      toast.success('User deleted successfully')
    },
    onError: (error: Error) => {
      toast.error('Failed to delete user', {
        description: error.message || 'Something went wrong',
      })
    },
  })
}

