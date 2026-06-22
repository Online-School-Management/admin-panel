import format from 'date-fns/format'
import type { PayoutItem, TeacherPayoutDetail } from '@/features/payouts/types/payout.types'
import { getPayoutExportSummary } from '@/features/payouts/services/payout.service'
import { formatCurrency, safeText } from '@/utils/format'
import {
  exportAllTeachersPayoutSummaryToExcel,
  exportPayoutSummaryToExcel,
  type PayoutSummaryExportRow,
} from './exportPayoutSummaryExcel'
import {
  DEFAULT_PAYOUT_SUMMARY_COLUMN_IDS,
  PAYOUT_SUMMARY_EXPORT_COLUMNS,
  type PayoutSummaryColumnId,
} from './payoutSummaryExportColumns'

type TranslateFn = (key: string, params?: Record<string, string | number>) => string

export function formatPayoutMonthYear(payout: {
  payout_month?: string | null
  period_start?: string
}): string {
  if (payout.payout_month && /^\d{4}-\d{2}$/.test(payout.payout_month)) {
    const [y, m] = payout.payout_month.split('-').map(Number)
    return format(new Date(y, m - 1, 1), 'MMMM yyyy')
  }
  if (payout.period_start) {
    return format(new Date(payout.period_start), 'MMMM yyyy')
  }
  return '—'
}

export function formatPayoutPeriodLabel(payout: PayoutItem): string {
  if (payout.period_start && payout.period_end) {
    return `${format(new Date(payout.period_start), 'dd MMM yyyy')} – ${format(new Date(payout.period_end), 'dd MMM yyyy')}`
  }
  return payout.payout_month ?? '—'
}

export function getCommissionLabel(
  tp: TeacherPayoutDetail,
  t: TranslateFn
): string {
  switch (tp.commission_type) {
    case 'monthly_percent':
      return `${Number(tp.commission_rate) || 0}%`
    case 'per_session':
      return `${Number(tp.sessions_count) || 0} × ${formatCurrency(tp.per_session_rate)}`
    case 'monthly_salary':
      return t('teacherPayout.detailPage.salaryAllCourses')
    case 'fixed_amount':
      return `${t('teacherPayout.detailPage.commissionFixedAmount')}: ${formatCurrency(tp.payout_amount)}`
    default:
      return '—'
  }
}

export function getSummaryTitleText(
  teacherName: string,
  monthYear: string,
  locale: string,
  t: TranslateFn
): string {
  if (locale === 'mm') {
    return `${monthYear}${t('teacherPayout.detailPage.sectionSummaryMmBetweenMonthAndTeacher')}${teacherName}${t('teacherPayout.detailPage.sectionSummaryMmSuffix')}`
  }
  return `${t('teacherPayout.detailPage.sectionSummaryLead')}${teacherName}${t('teacherPayout.detailPage.sectionSummaryBetween')}${monthYear}`
}

export function getSummaryExportHeaders(
  t: TranslateFn,
  columnIds: PayoutSummaryColumnId[] = DEFAULT_PAYOUT_SUMMARY_COLUMN_IDS
): string[] {
  return columnIds.map((columnId) => {
    const column = PAYOUT_SUMMARY_EXPORT_COLUMNS.find((item) => item.id === columnId)
    return column ? t(column.labelKey) : columnId
  })
}

export function buildSummaryExportRows(
  summaryLines: TeacherPayoutDetail[],
  teacherName: string,
  periodLabel: string,
  t: TranslateFn,
  columnIds: PayoutSummaryColumnId[] = DEFAULT_PAYOUT_SUMMARY_COLUMN_IDS
) {
  const expandByStudent =
    columnIds.includes('studentNames') || columnIds.includes('studentsCount')

  const rows: PayoutSummaryExportRow[] = []

  let courseGroupNumber = 0

  summaryLines.forEach((tp) => {
    courseGroupNumber += 1

    const studentNameList = Array.isArray(tp.student_names)
      ? tp.student_names.filter((name) => typeof name === 'string' && name.trim())
      : []

    const baseRow = {
      teacher: teacherName,
      period: periodLabel,
      course: tp.course
        ? safeText(tp.course.title)
        : t('teacherPayout.detailPage.salaryAllCourses'),
      subject:
        tp.course?.subject && typeof tp.course.subject.name === 'string'
          ? tp.course.subject.name
          : null,
      coursePrice:
        tp.course?.monthly_fee != null
          ? Number(tp.course.monthly_fee)
          : tp.course?.total_fee != null
            ? Number(tp.course.total_fee)
            : null,
      collected: Number(tp.total_collected ?? 0),
      commission: getCommissionLabel(tp, t),
      toTeacher: Number(tp.payout_amount ?? 0),
      sessions: tp.sessions?.length ?? tp.sessions_count ?? 0,
    }

    const pushRow = (
      studentName: string,
      studentsCount: number | null,
      courseGroupIndex: number,
      courseGroupSize: number
    ) => {
      const isStudentContinuationRow = courseGroupIndex > 0

      rows.push({
        no: courseGroupNumber,
        ...baseRow,
        collected: isStudentContinuationRow ? null : baseRow.collected,
        commission: isStudentContinuationRow ? '' : baseRow.commission,
        toTeacher: isStudentContinuationRow ? null : baseRow.toTeacher,
        sessions: isStudentContinuationRow ? null : baseRow.sessions,
        studentsCount: isStudentContinuationRow ? null : studentsCount,
        studentNames: studentName,
        isStudentContinuationRow,
        courseGroupIndex,
        courseGroupSize,
      })
    }

    if (!expandByStudent || studentNameList.length === 0) {
      pushRow(
        studentNameList.join(', '),
        studentNameList.length > 0 ? studentNameList.length : Number(tp.students_count ?? 0),
        0,
        1
      )
      return
    }

    studentNameList.forEach((studentName, index) => {
      pushRow(studentName, studentNameList.length, index, studentNameList.length)
    })
  })

  return rows
}

export function buildSummaryFooterTotals(summaryLines: TeacherPayoutDetail[]) {
  return {
    collected: summaryLines.reduce((acc, tp) => acc + Number(tp.total_collected ?? 0), 0),
    toTeacher: summaryLines.reduce((acc, tp) => acc + Number(tp.payout_amount ?? 0), 0),
    sessions: summaryLines.reduce(
      (acc, tp) => acc + (tp.sessions?.length ?? tp.sessions_count ?? 0),
      0
    ),
    studentsCount: summaryLines.reduce((acc, tp) => acc + Number(tp.students_count ?? 0), 0),
  }
}

export function buildPayoutSummaryExportOptions(
  payout: PayoutItem,
  locale: string,
  t: TranslateFn,
  columnIds: PayoutSummaryColumnId[] = DEFAULT_PAYOUT_SUMMARY_COLUMN_IDS
) {
  const summaryLines = payout.teacher_payouts ?? []
  if (summaryLines.length === 0) return null

  const teacherName = safeText(payout.teacher?.name ?? payout.recipient_name)
  const monthYear = formatPayoutMonthYear(payout)
  const periodLabel = formatPayoutPeriodLabel(payout)
  const footerTotals = buildSummaryFooterTotals(summaryLines)

  return {
    title: getSummaryTitleText(teacherName, monthYear, locale, t),
    paymentStatusLabel: t('teacherPayout.detailPage.paymentStatusTitle'),
    paymentStatus: t(`teacherPayout.status.${payout.status}`),
    columnIds,
    headers: getSummaryExportHeaders(t, columnIds),
    rows: buildSummaryExportRows(summaryLines, teacherName, periodLabel, t, columnIds),
    footerLabel: t('teacherPayout.detailPage.summaryFooterTotal'),
    footerTotals: {
      collected: payout.total_collected ?? footerTotals.collected,
      toTeacher: footerTotals.toTeacher,
      sessions: footerTotals.sessions,
      studentsCount: footerTotals.studentsCount,
    },
  }
}

export function sanitizeExcelSheetName(name: string, usedNames: Set<string>): string {
  const cleaned = name
    .replace(/[\\/?*[\]:]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 31) || 'Sheet'

  let candidate = cleaned
  let suffix = 2
  while (usedNames.has(candidate.toLowerCase())) {
    const tail = ` (${suffix})`
    candidate = `${cleaned.slice(0, 31 - tail.length)}${tail}`
    suffix += 1
  }

  usedNames.add(candidate.toLowerCase())
  return candidate
}

export async function downloadPayoutSummaryExport({
  periodStart,
  periodEnd,
  payoutId,
  columnIds,
  locale,
  t,
  fileName,
}: {
  periodStart: string
  periodEnd: string
  payoutId?: number
  columnIds: PayoutSummaryColumnId[]
  locale: string
  t: TranslateFn
  fileName: string
}): Promise<number> {
  const response = await getPayoutExportSummary({
    period_start: periodStart,
    period_end: periodEnd,
    payout_id: payoutId,
  })

  const payouts = Array.isArray(response.data) ? response.data : []
  if (payouts.length === 0) {
    return 0
  }

  if (payoutId != null || payouts.length === 1) {
    const payout = payouts[0]
    const options = buildPayoutSummaryExportOptions(payout, locale, t, columnIds)
    if (!options) return 0

    exportPayoutSummaryToExcel({
      ...options,
      fileName,
    })
    return 1
  }

  const usedSheetNames = new Set<string>()
  const sheets = payouts
    .map((payout) => {
      const options = buildPayoutSummaryExportOptions(payout, locale, t, columnIds)
      if (!options) return null

      const teacherName = safeText(payout.teacher?.name ?? payout.recipient_name)
      return {
        sheetName: sanitizeExcelSheetName(teacherName, usedSheetNames),
        options,
      }
    })
    .filter((sheet): sheet is NonNullable<typeof sheet> => sheet !== null)

  if (sheets.length === 0) return 0

  exportAllTeachersPayoutSummaryToExcel(sheets, fileName)
  return sheets.length
}
