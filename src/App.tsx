import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { I18nProvider } from '@/i18n/context'

/**
 * App component
 * Uses RouterProvider with createBrowserRouter (data router API)
 * This pattern matches the example folder and provides better component instance management
 */
function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <RouterProvider router={router} />
        <Toaster />
      </I18nProvider>
    </ErrorBoundary>
  )
}

export default App

