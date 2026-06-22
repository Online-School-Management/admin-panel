import { useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useTranslation } from '@/i18n/context'
import { Download, Loader2 } from 'lucide-react'
import {
  DEFAULT_PAYOUT_SUMMARY_COLUMN_IDS,
  PAYOUT_SUMMARY_EXPORT_COLUMNS,
  type PayoutSummaryColumnId,
} from '../utils/payoutSummaryExportColumns'

const COLUMN_STORAGE_KEY = 'teacher-payout-export-columns'

interface ExportExcelColumnsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (columnIds: PayoutSummaryColumnId[]) => void
  isExporting?: boolean
}

function loadStoredColumnIds(): PayoutSummaryColumnId[] {
  try {
    const raw = localStorage.getItem(COLUMN_STORAGE_KEY)
    if (!raw) return [...DEFAULT_PAYOUT_SUMMARY_COLUMN_IDS]

    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return [...DEFAULT_PAYOUT_SUMMARY_COLUMN_IDS]

    const validIds = new Set(PAYOUT_SUMMARY_EXPORT_COLUMNS.map((column) => column.id))
    const filtered = parsed.filter((id): id is PayoutSummaryColumnId => typeof id === 'string' && validIds.has(id as PayoutSummaryColumnId))
    if (filtered.length === 0) return [...DEFAULT_PAYOUT_SUMMARY_COLUMN_IDS]
    return PAYOUT_SUMMARY_EXPORT_COLUMNS.map((column) => column.id).filter((id) => filtered.includes(id))
  } catch {
    return [...DEFAULT_PAYOUT_SUMMARY_COLUMN_IDS]
  }
}

export function ExportExcelColumnsModal({
  open,
  onOpenChange,
  onConfirm,
  isExporting = false,
}: ExportExcelColumnsModalProps) {
  const { t } = useTranslation()
  const [selectedColumnIds, setSelectedColumnIds] = useState<PayoutSummaryColumnId[]>(
    loadStoredColumnIds
  )

  useEffect(() => {
    if (open) {
      setSelectedColumnIds(loadStoredColumnIds())
    }
  }, [open])

  const allColumnIds = useMemo(
    () => PAYOUT_SUMMARY_EXPORT_COLUMNS.map((column) => column.id),
    []
  )

  const allSelected = selectedColumnIds.length === allColumnIds.length

  const toggleColumn = (columnId: PayoutSummaryColumnId, checked: boolean) => {
    setSelectedColumnIds((current) => {
      if (checked) {
        return allColumnIds.filter((id) => current.includes(id) || id === columnId)
      }
      return current.filter((id) => id !== columnId)
    })
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedColumnIds(checked ? [...allColumnIds] : [])
  }

  const handleConfirm = () => {
    if (selectedColumnIds.length === 0) return
    const orderedColumnIds = allColumnIds.filter((id) => selectedColumnIds.includes(id))
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(orderedColumnIds))
    onConfirm(orderedColumnIds)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('teacherPayout.exportColumns.title')}</DialogTitle>
          <DialogDescription>{t('teacherPayout.exportColumns.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-md border px-3 py-2">
            <Checkbox
              id="export-columns-all"
              checked={allSelected}
              onCheckedChange={(checked) => handleSelectAll(checked === true)}
            />
            <label htmlFor="export-columns-all" className="text-sm font-medium cursor-pointer">
              {t('teacherPayout.exportColumns.selectAll')}
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
            {PAYOUT_SUMMARY_EXPORT_COLUMNS.map((column) => {
              const inputId = `export-column-${column.id}`
              return (
                <div key={column.id} className="flex items-center gap-2 rounded-md border px-3 py-2">
                  <Checkbox
                    id={inputId}
                    checked={selectedColumnIds.includes(column.id)}
                    onCheckedChange={(checked) => toggleColumn(column.id, checked === true)}
                  />
                  <label htmlFor={inputId} className="text-sm cursor-pointer">
                    {t(column.labelKey)}
                  </label>
                </div>
              )
            })}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            {t('teacherPayout.actions.cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isExporting || selectedColumnIds.length === 0}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isExporting
              ? t('teacherPayout.actions.exportAllSummaryExporting')
              : t('teacherPayout.exportColumns.download')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
