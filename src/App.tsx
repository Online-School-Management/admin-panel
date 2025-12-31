import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'
import { Toaster } from '@/components/ui/toaster'

/**
 * App component
 * Uses RouterProvider with createBrowserRouter (data router API)
 * This pattern matches the example folder and provides better component instance management
 */
function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App

