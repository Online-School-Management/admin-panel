export const PAYOUT_SUMMARY_EXPORT_COLUMNS = [
  { id: 'no', labelKey: 'teacherPayout.table.no', defaultSelected: true },
  { id: 'teacher', labelKey: 'teacherPayout.detailPage.summaryTeacher', defaultSelected: true },
  { id: 'period', labelKey: 'teacherPayout.detailPage.summaryPeriod', defaultSelected: true },
  { id: 'course', labelKey: 'teacherPayout.detailPage.summaryCourseName', defaultSelected: true },
  { id: 'subject', labelKey: 'teacherPayout.exportColumns.subject', defaultSelected: true },
  { id: 'coursePrice', labelKey: 'teacherPayout.detailPage.summaryCoursePrice', defaultSelected: true },
  { id: 'studentsCount', labelKey: 'teacherPayout.exportColumns.studentsCount', defaultSelected: true },
  { id: 'studentNames', labelKey: 'teacherPayout.exportColumns.studentNames', defaultSelected: true },
  { id: 'collected', labelKey: 'teacherPayout.detailPage.summaryCollected', defaultSelected: true },
  { id: 'commission', labelKey: 'teacherPayout.detailPage.commission', defaultSelected: true },
  { id: 'toTeacher', labelKey: 'teacherPayout.detailPage.summaryToTeacher', defaultSelected: true },
  { id: 'sessions', labelKey: 'teacherPayout.detailPage.totalSessionClass', defaultSelected: true },
] as const

export type PayoutSummaryColumnId = (typeof PAYOUT_SUMMARY_EXPORT_COLUMNS)[number]['id']

export const DEFAULT_PAYOUT_SUMMARY_COLUMN_IDS: PayoutSummaryColumnId[] =
  PAYOUT_SUMMARY_EXPORT_COLUMNS.filter((column) => column.defaultSelected).map((column) => column.id)

export const PAYOUT_SUMMARY_FOOTER_TOTAL_KEYS = [
  'collected',
  'toTeacher',
  'sessions',
  'studentsCount',
] as const

export type PayoutSummaryFooterTotalKey = (typeof PAYOUT_SUMMARY_FOOTER_TOTAL_KEYS)[number]

export function isFooterTotalColumn(columnId: PayoutSummaryColumnId): columnId is PayoutSummaryFooterTotalKey {
  return (PAYOUT_SUMMARY_FOOTER_TOTAL_KEYS as readonly string[]).includes(columnId)
}
