import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PAYMENT_STATUS } from '@/constants'
import { useUpdateStudentPayment, useStudentPayment } from '../hooks/useStudentPayments'
import type { UpdateStudentPaymentInput } from '../types/student-payment.types'
import { updateStudentPaymentSchema, type UpdateStudentPaymentFormData } from '../schemas/student-payment.schemas'
import { useTranslation } from '@/i18n/context'

interface EditStudentPaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentId: number | null
}

/**
 * EditStudentPaymentModal - modal to edit only Free (status) and Discount per payment.
 * Used from both the student payments list and the payment detail page.
 */
export function EditStudentPaymentModal({
  open,
  onOpenChange,
  paymentId,
}: EditStudentPaymentModalProps) {
  const { t } = useTranslation()
  const paymentIdToFetch = open && paymentId ? paymentId : 0
  const {
    data: paymentData,
    isLoading: isLoadingPayment,
    isFetching: isFetchingPayment,
    dataUpdatedAt: paymentDataUpdatedAt,
  } = useStudentPayment(paymentIdToFetch)

  const updatePayment = useUpdateStudentPayment()
  const lastPopulatedRef = useRef<{ paymentId: number; timestamp: number } | null>(null)

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
      discount_type: undefined,
      discount_value: undefined,
    },
  })

  useEffect(() => {
    if (!open || !paymentId || isLoadingPayment || isFetchingPayment || !paymentData?.data) return

    const payment = paymentData.data
    const shouldPopulate =
      lastPopulatedRef.current === null ||
      lastPopulatedRef.current.paymentId !== paymentId ||
      paymentDataUpdatedAt > lastPopulatedRef.current.timestamp

    if (!shouldPopulate) return

    reset(
      {
        status: payment.status || PAYMENT_STATUS.PENDING,
        discount_type: payment.discount_type ?? undefined,
        discount_value: payment.discount_value ?? undefined,
      },
      { keepDefaultValues: false }
    )
    lastPopulatedRef.current = { paymentId, timestamp: paymentDataUpdatedAt }
  }, [open, paymentId, paymentData, isLoadingPayment, isFetchingPayment, paymentDataUpdatedAt, reset])

  const onSubmit = async (data: UpdateStudentPaymentFormData) => {
    if (!paymentId) return
    const updateData: UpdateStudentPaymentInput = {
      status: data.status,
      discount_type: data.discount_type ?? undefined,
      discount_value: data.discount_value ?? undefined,
    }
    if (updateData.status === PAYMENT_STATUS.FREE) {
      updateData.amount_paid = 0
      updateData.original_amount = 0
      updateData.discount_type = null
      updateData.discount_value = null
    }

    updatePayment.mutate(
      { id: paymentId, data: updateData },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  const status = watch('status')
  const isLoading = isLoadingPayment || isFetchingPayment || updatePayment.isPending
  const payment = paymentData?.data
  const showForm = open && paymentId && payment

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('studentPayment.pages.edit')}</DialogTitle>
          <DialogDescription>
            {payment
              ? t('studentPayment.monthNumber', { number: payment.month_number }) +
                (payment.enrollment?.course?.title ? ` — ${payment.enrollment.course.title}` : '')
              : t('studentPayment.descriptions.edit')}
          </DialogDescription>
        </DialogHeader>

        {isLoading && !payment ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : showForm ? (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 flex-1 min-h-0">
            <div className="space-y-4 overflow-y-auto pr-1">
              {/* Student name (read-only context) */}
              <div className="rounded-lg border bg-muted/40 p-3 space-y-1 text-sm">
                <p className="font-medium text-muted-foreground">
                  {t('studentPayment.detail.student')}
                </p>
                <p className="font-semibold">{payment.enrollment?.student?.name ?? '-'}</p>
              </div>

              {/* Free checkbox (like enrollment) */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit_modal_free"
                  checked={status === PAYMENT_STATUS.FREE}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setValue('status', PAYMENT_STATUS.FREE, { shouldValidate: true })
                      setValue('discount_type', undefined)
                      setValue('discount_value', undefined)
                    } else {
                      setValue(
                        'status',
                        payment.status === PAYMENT_STATUS.PAID ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.PENDING,
                        { shouldValidate: true }
                      )
                    }
                  }}
                  disabled={isLoading}
                />
                <Label htmlFor="edit_modal_free" className="font-normal cursor-pointer">
                  {t('enrollment.form.freeCheckbox')}
                </Label>
              </div>

              {/* Discount (only when not free) */}
              {status !== PAYMENT_STATUS.FREE && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_modal_discount_type">
                      {t('studentPayment.form.discountType')}
                    </Label>
                    <Select
                      value={watch('discount_type') ?? 'none'}
                      onValueChange={(value) => {
                        const v = value === 'none' ? undefined : (value as 'percentage' | 'fixed')
                        setValue('discount_type', v, { shouldValidate: true })
                        if (v === undefined) setValue('discount_value', undefined)
                      }}
                      disabled={isLoading}
                    >
                      <SelectTrigger
                        id="edit_modal_discount_type"
                        className={errors.discount_type ? 'border-destructive' : ''}
                      >
                        <SelectValue placeholder={t('studentPayment.form.selectDiscountType')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{t('enrollment.form.discountNone')}</SelectItem>
                        <SelectItem value="percentage">{t('enrollment.form.discountPercentage')}</SelectItem>
                        <SelectItem value="fixed">{t('enrollment.form.discountFixed')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(watch('discount_type') === 'percentage' || watch('discount_type') === 'fixed') && (
                    <div className="space-y-2">
                      <Label htmlFor="edit_modal_discount_value">
                        {watch('discount_type') === 'percentage'
                          ? t('enrollment.form.discountValuePercent')
                          : t('enrollment.form.discountValueFixed')}
                      </Label>
                      <Input
                        id="edit_modal_discount_value"
                        type="number"
                        min={0}
                        step={watch('discount_type') === 'percentage' ? 1 : 0.01}
                        {...register('discount_value', { valueAsNumber: true })}
                        className={errors.discount_value ? 'border-destructive' : ''}
                        disabled={isLoading}
                      />
                      {errors.discount_value && (
                        <p className="text-sm text-destructive">{errors.discount_value.message}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0 border-t pt-4 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading || isSubmitting}
              >
                {t('studentPayment.actions.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading || isSubmitting}>
                {isLoading || isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('studentPayment.messages.updating')}
                  </>
                ) : (
                  t('studentPayment.actions.update')
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
