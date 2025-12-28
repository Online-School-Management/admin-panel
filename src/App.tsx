import { Suspense } from 'react'
import { BrowserRouter, useRoutes, Navigate } from 'react-router-dom'
import { routes } from '@/routes'
import { Toaster } from '@/components/ui/toaster'

// Loading component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

// App Routes component
function AppRoutes() {
  const element = useRoutes([
    ...routes,
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: '*',
      element: <Navigate to="/dashboard" replace />,
    },
  ])

  return element
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <AppRoutes />
      </Suspense>
      <Toaster />
    </BrowserRouter>
  )
}

export default App

