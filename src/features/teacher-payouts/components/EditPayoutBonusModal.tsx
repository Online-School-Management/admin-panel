import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslation } from '@/i18n/context'
import { useUpdatePayoutBonus } from '@/features/payouts/hooks/usePayouts'
import { formatCurrency } from '@/utils/format'
import { Gift } from 'lucide-react'

export interface PayoutBonusModalPayout {
  id: number
  total_amount: number
  bonus_amount?: number
  bonus_notes?: string | null
  total_to_pay?: number
  recipient_name?: string | null
  teacher?: { name?: string | null } | null
}

interface EditPayoutBonusModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payout: PayoutBonusModalPayout | null
}

/**
 * Modal to add or edit bonus for a pending payout.
 * Used on teacher payout list and detail pages.
 */
export function EditPayoutBonusModal({
  open,
  onOpenChange,
  payout,
}: EditPayoutBonusModalProps) {
  const { t } = useTranslation()
  const [bonusAmount, setBonusAmount] = useState<string>('0')
  const [bonusNotes, setBonusNotes] = useState<string>('')

  const updateBonus = useUpdatePayoutBonus()

  useEffect(() => {
    if (open && payout) {
      setBonusAmount(String(payout.bonus_amount ?? 0))
      setBonusNotes(payout.bonus_notes ?? '')
    }
  }, [open, payout?.id, payout?.bonus_amount, payout?.bonus_notes])

  const handleSave = () => {
    if (!payout) return
    const amount = parseFloat(bonusAmount) || 0
    if (amount < 0) return
    updateBonus.mutate(
      { id: payout.id, data: { bonus_amount: amount, bonus_notes: bonusNotes.trim() || undefined } },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  const displayName = payout?.teacher?.name ?? payout?.recipient_name ?? t('teacherPayout.detailPage.bonusTitle')
  const baseAmount = payout?.total_amount ?? 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            {t('teacherPayout.detailPage.bonusTitle')}
          </DialogTitle>
          <DialogDescription>
            {payout && (
              <>
                {t('teacherPayout.detailPage.forTeacher')}: <strong>{displayName}</strong>
                <br />
                {t('teacherPayout.detailPage.base')}: {formatCurrency(baseAmount)}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {payout && (
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="modal-bonus_amount">{t('teacherPayout.detailPage.bonusAmount')}</Label>
              <Input
                id="modal-bonus_amount"
                type="number"
                min={0}
                step={1}
                value={bonusAmount}
                onChange={(e) => setBonusAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="modal-bonus_notes">{t('teacherPayout.detailPage.bonusNotes')}</Label>
              <Input
                id="modal-bonus_notes"
                value={bonusNotes}
                onChange={(e) => setBonusNotes(e.target.value)}
                placeholder={t('teacherPayout.detailPage.bonusNotesPlaceholder')}
              />
            </div>
            <div className="rounded-md border bg-muted/50 p-3 text-sm">
              <span className="text-muted-foreground mr-1">{t('teacherPayout.detailPage.totalToPay')}:</span>
              <span className="font-semibold">{formatCurrency(baseAmount + (parseFloat(bonusAmount) || 0))}</span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={updateBonus.isPending}>
            {t('teacherPayout.actions.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={updateBonus.isPending || !payout}>
            {updateBonus.isPending ? t('teacherPayout.detailPage.saving') : t('teacherPayout.detailPage.saveBonus')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
