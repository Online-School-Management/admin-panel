import * as XLSX from 'xlsx'

export interface PayoutSummaryExportRow {
  no: number
  teacher: string
  period: string
  course: string
  subject?: string | null
  coursePrice: number | null
  collected: number
  commission: string
  toTeacher: number
  sessions: number
}

export interface PayoutSummaryExportOptions {
  title: string
  paymentStatusLabel: string
  paymentStatus: string
  headers: string[]
  rows: PayoutSummaryExportRow[]
  footerLabel: string
  footerTotals: {
    collected: number
    toTeacher: number
    sessions: number
  }
  fileName: string
}

function sanitizeFileName(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '').replace(/\s+/g, '_').slice(0, 120)
}

export function exportPayoutSummaryToExcel(options: PayoutSummaryExportOptions): void {
  const {
    title,
    paymentStatusLabel,
    paymentStatus,
    headers,
    rows,
    footerLabel,
    footerTotals,
    fileName,
  } = options

  const sheetRows: (string | number)[][] = [
    [title],
    [`${paymentStatusLabel}: ${paymentStatus}`],
    [],
    headers,
    ...rows.map((row) => [
      row.no,
      row.teacher,
      row.period,
      row.subject ? `${row.course} (${row.subject})` : row.course,
      row.coursePrice ?? '—',
      row.collected,
      row.commission,
      row.toTeacher,
      row.sessions,
    ]),
    [],
    [
      footerLabel,
      '',
      '',
      '',
      '',
      footerTotals.collected,
      '',
      footerTotals.toTeacher,
      footerTotals.sessions,
    ],
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(sheetRows)
  worksheet['!cols'] = [
    { wch: 5 },
    { wch: 22 },
    { wch: 26 },
    { wch: 32 },
    { wch: 20 },
    { wch: 20 },
    { wch: 22 },
    { wch: 18 },
    { wch: 14 },
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Summary')

  const safeName = sanitizeFileName(fileName)
  XLSX.writeFile(workbook, safeName.endsWith('.xlsx') ? safeName : `${safeName}.xlsx`)
}
