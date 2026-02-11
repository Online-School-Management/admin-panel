import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAdmins } from '@/features/admins/hooks/useAdmins'
import { useCreatePayout } from '../hooks/usePayouts'
import { useTranslation } from '@/i18n/context'
import type { CreatePayoutInput } from '../types/payout.types'

const NON_TEACHER_TYPES = [
  { value: 'admin', labelKey: 'monthlyClosing.addPayoutModal.admin' },
  { value: 'server', labelKey: 'monthlyClosing.type.server' },
  { value: 'facebook', labelKey: 'monthlyClosing.type.facebook' },
  { value: 'domain', labelKey: 'monthlyClosing.type.domain' },
  { value: 'content_writer', labelKey: 'monthlyClosing.type.content_writer' },
  { value: 'other', labelKey: 'monthlyClosing.type.other' },
] as const

export interface AddPayoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  periodStart: string
  periodEnd: string
  payoutMonth?: string | null
  onSuccess?: () => void
}

export function AddPayoutModal({
  open,
  onOpenChange,
  periodStart,
  periodEnd,
  payoutMonth = null,
  onSuccess,
}: AddPayoutModalProps) {
  const { t } = useTranslation()
  const [recipientType, setRecipientType] = useState<CreatePayoutInput['recipient_type']>('admin')
  const [recipientId, setRecipientId] = useState<number | ''>('')
  const [recipientName, setRecipientName] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [status, setStatus] = useState<CreatePayoutInput['status']>('paid')
  const [notes, setNotes] = useState('')

  const { data: adminsData } = useAdmins({ page: 1, per_page: 200 })
  const createPayout = useCreatePayout()

  const admins = Array.isArray(adminsData?.data) ? adminsData.data : []

  useEffect(() => {
    if (!open) return
    setRecipientType('admin')
    setRecipientId('')
    setRecipientName('')
    setTotalAmount('')
    setStatus('paid')
    setNotes('')
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(totalAmount)
    if (Number.isNaN(amount) || amount <= 0) return
    if (recipientType === 'admin') {
      if (recipientId === '' || recipientId === null) return
      const admin = admins.find((a) => a.id === Number(recipientId))
      createPayout.mutate(
        {
          recipient_type: 'admin',
          recipient_id: Number(recipientId),
          recipient_name: admin?.user?.name,
          period_start: periodStart,
          period_end: periodEnd,
          payout_month: payoutMonth ?? undefined,
          total_amount: amount,
          status: status ?? 'paid',
          notes: notes || undefined,
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            onSuccess?.()
          },
        }
      )
    } else {
      if (!recipientName.trim()) return
      createPayout.mutate(
        {
          recipient_type: recipientType,
          recipient_name: recipientName.trim(),
          period_start: periodStart,
          period_end: periodEnd,
          payout_month: payoutMonth ?? undefined,
          total_amount: amount,
          status: status ?? 'paid',
          notes: notes || undefined,
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            onSuccess?.()
          },
        }
      )
    }
  }

  const isAdmin = recipientType === 'admin'
  const canSubmit =
    ((isAdmin && recipientId !== '') || (!isAdmin && recipientName.trim() !== '')) &&
    totalAmount !== '' &&
    Number(totalAmount) > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('monthlyClosing.addPayoutModal.title')}</DialogTitle>
          <DialogDescription>{t('monthlyClosing.addPayoutModal.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('monthlyClosing.addPayoutModal.recipientType')}</Label>
            <Select
              value={recipientType}
              onValueChange={(v) => {
                setRecipientType(v as CreatePayoutInput['recipient_type'])
                setRecipientId('')
                setRecipientName('')
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('monthlyClosing.addPayoutModal.selectType')} />
              </SelectTrigger>
              <SelectContent>
                {NON_TEACHER_TYPES.map(({ value, labelKey }) => (
                  <SelectItem key={value} value={value}>
                    {t(labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isAdmin ? (
            <div className="space-y-2">
              <Label>{t('monthlyClosing.addPayoutModal.recipientAdmin')}</Label>
              <Select
                value={recipientId === '' ? undefined : String(recipientId)}
                onValueChange={(v) => setRecipientId(v === undefined ? '' : Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('monthlyClosing.addPayoutModal.recipientAdmin')} />
                </SelectTrigger>
                <SelectContent>
                  {admins.map((admin) => (
                    <SelectItem key={admin.id} value={String(admin.id)}>
                      {admin.user?.name ?? admin.admin_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>{t('monthlyClosing.addPayoutModal.recipientName')}</Label>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder={t('monthlyClosing.addPayoutModal.recipientNamePlaceholder')}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>{t('monthlyClosing.addPayoutModal.amount')}</Label>
            <Input
              type="number"
              min={1}
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t('monthlyClosing.addPayoutModal.status')}</Label>
            <Select
              value={status ?? 'paid'}
              onValueChange={(v) => setStatus(v as 'pending' | 'paid')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">{t('monthlyClosing.addPayoutModal.statusPaid')}</SelectItem>
                <SelectItem value="pending">{t('monthlyClosing.addPayoutModal.statusPending')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            {t('monthlyClosing.addPayoutModal.period')}: {periodStart} — {periodEnd}
          </div>

          <div className="space-y-2">
            <Label className="optional">{t('monthlyClosing.addPayoutModal.notes')}</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('monthlyClosing.addPayoutModal.notesPlaceholder')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createPayout.isPending}
            >
              {t('monthlyClosing.actions.cancel')}
            </Button>
            <Button type="submit" disabled={!canSubmit || createPayout.isPending}>
              {createPayout.isPending
                ? t('monthlyClosing.actions.processing')
                : t('monthlyClosing.actions.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
