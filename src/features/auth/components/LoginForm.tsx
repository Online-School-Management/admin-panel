import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLogin } from '../hooks/useLogin'
import type { LoginCredentials } from '../types/auth.types'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { loginSchema, type LoginFormData } from '../schemas/auth.schemas'
import { useTranslation } from '@/i18n/context'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const loginMutation = useLogin()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginFormData) => {
    const credentials: LoginCredentials = {
      email: data.email,
      password: data.password,
    }
    loginMutation.mutate(credentials)
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t('auth.messages.welcomeBack')}</CardTitle>
        <CardDescription>
          {t('auth.messages.loginDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.form.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@gmail.com"
              {...register('email')}
              disabled={loginMutation.isPending}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.form.password')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.form.enterPassword')}
                {...register('password')}
                disabled={loginMutation.isPending}
                className={errors.password ? 'border-destructive' : ''}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loginMutation.isPending}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? t('auth.form.hidePassword') : t('auth.form.showPassword')}
                </span>
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('auth.messages.loggingIn')}
              </>
            ) : (
              t('common.buttons.login')
            )}
          </Button>

          {/* Demo Credentials Hint */}
          <div className="mt-4 rounded-md bg-muted p-3 text-sm">
            <p className="font-medium">{t('auth.messages.demoCredentials')}:</p>
            <p className="text-muted-foreground">
              {t('auth.form.email')}: <span className="font-mono">admin@gmail.com</span>
            </p>
            <p className="text-muted-foreground">
              {t('auth.form.password')}: <span className="font-mono">admin</span>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

