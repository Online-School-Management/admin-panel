import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/**
 * Shown when the admin is signed in but lacks permission for the current route.
 */
export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Access denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You do not have permission to view this page. If you think this is a mistake, contact an
            administrator.
          </p>
          <Button asChild variant="default">
            <Link to="/">Back to home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
