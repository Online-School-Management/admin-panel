import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/ErrorBoundary'

/**
 * App component
 * Uses RouterProvider with createBrowserRouter (data router API)
 * This pattern matches the example folder and provides better component instance management
 */
function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster />
    </ErrorBoundary>
  )
}

export default App

