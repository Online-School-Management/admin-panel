import { useMutation, useQueryClient } from '@tanstack/react-query'
import { closeMonth } from '../services/monthly-close.service'
import { showUpdateSuccessToast, showUpdateErrorToast } from '@/utils/toast'

const MONTHLY_CLOSING_SUMMARY_KEY = ['payouts', 'monthly-closing-summary'] as const

export function useCloseMonth() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ year, month }: { year: number; month: number }) =>
      closeMonth(year, month).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MONTHLY_CLOSING_SUMMARY_KEY })
      queryClient.invalidateQueries({ queryKey: ['payouts', 'list'] })
      showUpdateSuccessToast('Month close', 'Month closed successfully')
    },
    onError: (error: unknown) => {
      showUpdateErrorToast('month close', error)
    },
  })
}
