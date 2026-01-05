import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormSkeleton } from '@/components/common/skeletons/FormSkeleton'
import { PAYMENT_STATUS_OPTIONS, PAYMENT_STATUS, PAYMENT_METHOD_OPTIONS, PAYMENT_METHOD } from '@/constants'
import { useUpdateStudentPayment, useStudentPayment } from '../hooks/useStudentPayments'
import type { UpdateStudentPaymentInput } from '../types/student-payment.types'
import { updateStudentPaymentSchema, type UpdateStudentPaymentFormData } from '../schemas/student-payment.schemas'
import { useTranslation } from '@/i18n/context'
import { useAdmins } from '@/features/admins/hooks/useAdmins'

interface StudentPaymentFormProps {
  paymentId: number
}

/**
 * StudentPaymentForm component - handles payment update (mark as paid)
 */
export function StudentPaymentForm({ paymentId }: StudentPaymentFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    data: paymentData,
    isLoading: isLoadingPayment,
    isFetching: isFetchingPayment,
    dataUpdatedAt: paymentDataUpdatedAt,
  } = useStudentPayment(paymentId)

  const updatePayment = useUpdateStudentPayment()

  // Fetch admins for received_by dropdown
  const { data: adminsData } = useAdmins({ per_page: 100 })

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status
  }

  const getPaymentMethodLabel = (method: string) => {
    return t(`studentPayment.paymentMethod.${method}`) || method
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateStudentPaymentFormData>({
    resolver: zodResolver(updateStudentPaymentSchema),
    defaultValues: {
      status: PAYMENT_STATUS.PENDING,
      amount_paid: undefined,
      payment_date: undefined,
      payment_method: PAYMENT_METHOD.KBZ_PAY,
      notes: undefined,
    },
  })

  // Track the last dataUpdatedAt timestamp and paymentId we used to populate the form
  const lastPopulatedRef = useRef<{ paymentId: number; timestamp: number } | null>(null)

  // Populate form values when payment data loads
  useEffect(() => {
    if (isLoadingPayment || isFetchingPayment || !paymentData?.data) return

    // Check if we need to populate
    const shouldPopulate =
      lastPopulatedRef.current === null ||
      lastPopulatedRef.current.paymentId !== paymentId ||
      paymentDataUpdatedAt > lastPopulatedRef.current.timestamp

    if (!shouldPopulate) return

    const payment = paymentData.data

    // Reset form with all values at once using reset()
    reset({
      status: payment.status || PAYMENT_STATUS.PENDING,
      amount_paid: payment.amount_paid || undefined,
      payment_date: payment.payment_date || undefined,
      payment_method: payment.payment_method || PAYMENT_METHOD.KBZ_PAY,
      received_by: payment.received_by || undefined,
      notes: payment.notes || undefined,
    }, {
      keepDefaultValues: false,
    })

    // Update the last populated tracking
    lastPopulatedRef.current = {
      paymentId,
      timestamp: paymentDataUpdatedAt,
    }
  }, [paymentId, paymentData, isLoadingPayment, isFetchingPayment, paymentDataUpdatedAt, reset])

  const onSubmit = async (data: UpdateStudentPaymentFormData) => {
    const updateData: UpdateStudentPaymentInput = {
      status: data.status,
      amount_paid: data.amount_paid || undefined,
      payment_date: data.payment_date || undefined,
      payment_method: data.payment_method || undefined,
      received_by: data.received_by || undefined,
      notes: data.notes || undefined,
    }

    // If marking as paid, set payment_date and paid_at if not provided
    if (updateData.status === PAYMENT_STATUS.PAID) {
      if (!updateData.payment_date) {
        updateData.payment_date = new Date().toISOString().split('T')[0]
      }
      updateData.paid_at = new Date().toISOString()
    }

    updatePayment.mutate({ id: paymentId, data: updateData })
  }

  const status = watch('status')

  if (isLoadingPayment) {
    return <FormSkeleton />
  }

  if (!paymentData?.data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{t('studentPayment.messages.paymentNotFound')}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('studentPayment.form.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">
              {t('studentPayment.form.status')} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={status}
              onValueChange={(value) => setValue('status', value as 'pending' | 'paid')}
            >
              <SelectTrigger id="status" className={errors.status ? 'border-destructive' : ''}>
                <SelectValue placeholder={t('studentPayment.form.selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {getStatusLabel(option.value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          {/* Amount Paid */}
          <div className="space-y-2">
            <Label htmlFor="amount_paid">{t('studentPayment.form.amountPaid')}</Label>
            <Input
              id="amount_paid"
              type="number"
              step="0.01"
              min="0"
              {...register('amount_paid', { valueAsNumber: true })}
              className={errors.amount_paid ? 'border-destructive' : ''}
              placeholder={t('studentPayment.form.enterAmount')}
            />
            {errors.amount_paid && (
              <p className="text-sm text-destructive">{errors.amount_paid.message}</p>
            )}
          </div>

          {/* Payment Date */}
          {status === PAYMENT_STATUS.PAID && (
            <div className="space-y-2">
              <Label htmlFor="payment_date">{t('studentPayment.form.paymentDate')}</Label>
              <Input
                id="payment_date"
                type="date"
                {...register('payment_date')}
                className={errors.payment_date ? 'border-destructive' : ''}
              />
              {errors.payment_date && (
                <p className="text-sm text-destructive">{errors.payment_date.message}</p>
              )}
            </div>
          )}

          {/* Payment Method */}
          {status === PAYMENT_STATUS.PAID && (
            <div className="space-y-2">
              <Label htmlFor="payment_method">{t('studentPayment.form.paymentMethod')}</Label>
              <Select
                value={watch('payment_method') || PAYMENT_METHOD.KBZ_PAY}
                onValueChange={(value) => setValue('payment_method', value as any)}
              >
                <SelectTrigger id="payment_method" className={errors.payment_method ? 'border-destructive' : ''}>
                  <SelectValue placeholder={t('studentPayment.form.selectPaymentMethod')} />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {getPaymentMethodLabel(option.value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.payment_method && (
                <p className="text-sm text-destructive">{errors.payment_method.message}</p>
              )}
            </div>
          )}

          {/* Received By */}
          {status === PAYMENT_STATUS.PAID && adminsData?.data && (
            <div className="space-y-2">
              <Label htmlFor="received_by">{t('studentPayment.form.receivedBy')}</Label>
              <Select
                value={watch('received_by')?.toString() || ''}
                onValueChange={(value) => setValue('received_by', value ? parseInt(value) : undefined)}
              >
                <SelectTrigger id="received_by" className={errors.received_by ? 'border-destructive' : ''}>
                  <SelectValue placeholder={t('studentPayment.form.selectAdmin')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('studentPayment.form.noAdmin')}</SelectItem>
                  {adminsData.data.map((admin) => (
                    <SelectItem key={admin.id} value={admin.id.toString()}>
                      {admin.user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.received_by && (
                <p className="text-sm text-destructive">{errors.received_by.message}</p>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t('studentPayment.form.notes')}</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              className={errors.notes ? 'border-destructive' : ''}
              placeholder={t('studentPayment.form.enterNotes')}
              rows={4}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/student-payments/${paymentId}`)}
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('studentPayment.actions.cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('studentPayment.messages.updating')}
            </>
          ) : (
            <>
              {t('studentPayment.actions.update')}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

