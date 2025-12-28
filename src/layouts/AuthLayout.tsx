import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

/**
 * Authentication Layout
 * Used for login, register, and other auth pages
 * Centered layout with no sidebar
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}

