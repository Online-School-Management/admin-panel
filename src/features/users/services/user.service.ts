import apiClient from '@/services/api-client'
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  UsersResponse,
  UserResponse,
} from '../types/user.types'

/**
 * User service - handles all user-related API calls
 */

/**
 * Get all users with pagination
 */
export async function getUsers(params?: {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}): Promise<UsersResponse> {
  const response = await apiClient.get<UsersResponse>('/users', { params })
  return response.data
}

/**
 * Get a single user by ID
 */
export async function getUserById(id: string): Promise<UserResponse> {
  const response = await apiClient.get<UserResponse>(`/users/${id}`)
  return response.data
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserInput): Promise<UserResponse> {
  const response = await apiClient.post<UserResponse>('/users', data)
  return response.data
}

/**
 * Update an existing user
 */
export async function updateUser(
  id: string,
  data: UpdateUserInput
): Promise<UserResponse> {
  const response = await apiClient.put<UserResponse>(`/users/${id}`, data)
  return response.data
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`)
}


