import * as XLSX from 'xlsx-js-style'
import type { PayoutSummaryColumnId } from './payoutSummaryExportColumns'
import { isFooterTotalColumn } from './payoutSummaryExportColumns'

const HEADER_ROW = 3
const TITLE_ROW = 0
const PAYMENT_STATUS_ROW = 1

const HIGHLIGHT_ROW_STYLE = {
  fill: {
    patternType: 'solid',
    fgColor: { rgb: 'FFFF00' },
  },
  font: {
    bold: true,
  },
  alignment: {
    vertical: 'center',
  },
}

export interface PayoutSummaryExportRow {
  no: number
  teacher: string
  period: string
  course: string
  subject?: string | null
  coursePrice: number | null
  collected: number | null
  commission: string
  toTeacher: number | null
  sessions: number | null
  studentsCount: number | null
  studentNames: string
  isStudentContinuationRow?: boolean
  courseGroupIndex: number
  courseGroupSize: number
}

export interface PayoutSummaryExportOptions {
  title: string
  paymentStatusLabel: string
  paymentStatus: string
  columnIds: PayoutSummaryColumnId[]
  headers: string[]
  rows: PayoutSummaryExportRow[]
  footerLabel: string
  footerTotals: {
    collected: number
    toTeacher: number
    sessions: number
    studentsCount: number
  }
  fileName: string
}

export interface PayoutSummarySheetInput {
  sheetName: string
  options: Omit<PayoutSummaryExportOptions, 'fileName'>
}

const COLUMN_WIDTHS: Record<PayoutSummaryColumnId, number> = {
  no: 5,
  teacher: 22,
  period: 26,
  course: 32,
  subject: 18,
  coursePrice: 20,
  collected: 20,
  commission: 22,
  toTeacher: 18,
  sessions: 14,
  studentsCount: 14,
  studentNames: 36,
}

function sanitizeFileName(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '').replace(/\s+/g, '_').slice(0, 120)
}

const DATA_START_ROW = 4

function getRowCellValue(row: PayoutSummaryExportRow, columnId: PayoutSummaryColumnId): string | number {
  if (row.isStudentContinuationRow && columnId !== 'studentNames') {
    return ''
  }

  switch (columnId) {
    case 'no':
      return row.no
    case 'teacher':
      return row.teacher
    case 'period':
      return row.period
    case 'course':
      return row.course
    case 'subject':
      return row.subject ?? '—'
    case 'coursePrice':
      return row.coursePrice ?? '—'
    case 'collected':
      return row.collected ?? ''
    case 'commission':
      return row.commission
    case 'toTeacher':
      return row.toTeacher ?? ''
    case 'sessions':
      return row.sessions ?? ''
    case 'studentsCount':
      return row.studentsCount ?? ''
    case 'studentNames':
      return row.studentNames || '—'
    default:
      return '—'
  }
}

function buildCourseGroupMerges(
  rows: PayoutSummaryExportRow[],
  columnIds: PayoutSummaryColumnId[]
): XLSX.Range[] {
  const merges: XLSX.Range[] = []

  rows.forEach((row, dataRowIndex) => {
    if (row.courseGroupIndex !== 0 || row.courseGroupSize <= 1) {
      return
    }

    const startRow = DATA_START_ROW + dataRowIndex
    const endRow = startRow + row.courseGroupSize - 1

    columnIds.forEach((columnId, colIndex) => {
      if (columnId === 'studentNames') return

      merges.push({
        s: { r: startRow, c: colIndex },
        e: { r: endRow, c: colIndex },
      })
    })
  })

  return merges
}

function applyCellHighlight(worksheet: XLSX.WorkSheet, rowIndex: number, colIndex: number): void {
  const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })
  if (!worksheet[cellAddress]) {
    worksheet[cellAddress] = { t: 's', v: '' }
  }
  worksheet[cellAddress].s = HIGHLIGHT_ROW_STYLE
}

function applyRowHighlight(worksheet: XLSX.WorkSheet, rowIndex: number, columnCount: number): void {
  for (let col = 0; col < columnCount; col += 1) {
    applyCellHighlight(worksheet, rowIndex, col)
  }
}

function applyMetaCellHighlights(worksheet: XLSX.WorkSheet): void {
  applyCellHighlight(worksheet, TITLE_ROW, 0)
  applyCellHighlight(worksheet, PAYMENT_STATUS_ROW, 0)
}

function applyFooterHighlight(
  worksheet: XLSX.WorkSheet,
  rowIndex: number,
  columnIds: PayoutSummaryColumnId[]
): void {
  columnIds.forEach((columnId, colIndex) => {
    if (colIndex === 0 || isFooterTotalColumn(columnId)) {
      applyCellHighlight(worksheet, rowIndex, colIndex)
    }
  })
}

function getFooterRowIndex(rowCount: number): number {
  return DATA_START_ROW + rowCount + 1
}

function buildSummarySheetRows(options: Omit<PayoutSummaryExportOptions, 'fileName'>): (string | number)[][] {
  const {
    title,
    paymentStatusLabel,
    paymentStatus,
    columnIds,
    headers,
    rows,
    footerLabel,
    footerTotals,
  } = options

  const footerRow = columnIds.map((columnId) => {
    if (columnId === columnIds[0]) {
      return footerLabel
    }
    if (isFooterTotalColumn(columnId)) {
      return footerTotals[columnId]
    }
    return ''
  })

  return [
    [title],
    [`${paymentStatusLabel}: ${paymentStatus}`],
    [],
    headers,
    ...rows.map((row) => columnIds.map((columnId) => getRowCellValue(row, columnId))),
    [],
    footerRow,
  ]
}

function createSummaryWorksheet(options: Omit<PayoutSummaryExportOptions, 'fileName'>): XLSX.WorkSheet {
  const worksheet = XLSX.utils.aoa_to_sheet(buildSummarySheetRows(options))
  const columnCount = options.columnIds.length
  worksheet['!cols'] = options.columnIds.map((columnId) => ({ wch: COLUMN_WIDTHS[columnId] }))

  const merges = buildCourseGroupMerges(options.rows, options.columnIds)
  applyMetaCellHighlights(worksheet)

  if (merges.length > 0) {
    worksheet['!merges'] = merges
  }

  applyRowHighlight(worksheet, HEADER_ROW, columnCount)
  applyFooterHighlight(worksheet, getFooterRowIndex(options.rows.length), options.columnIds)

  return worksheet
}

export function exportPayoutSummaryToExcel(options: PayoutSummaryExportOptions): void {
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, createSummaryWorksheet(options), 'Summary')

  const safeName = sanitizeFileName(options.fileName)
  XLSX.writeFile(workbook, safeName.endsWith('.xlsx') ? safeName : `${safeName}.xlsx`)
}

export function exportAllTeachersPayoutSummaryToExcel(
  sheets: PayoutSummarySheetInput[],
  fileName: string
): void {
  if (sheets.length === 0) return

  const workbook = XLSX.utils.book_new()

  for (const sheet of sheets) {
    XLSX.utils.book_append_sheet(
      workbook,
      createSummaryWorksheet(sheet.options),
      sheet.sheetName
    )
  }

  const safeName = sanitizeFileName(fileName)
  XLSX.writeFile(workbook, safeName.endsWith('.xlsx') ? safeName : `${safeName}.xlsx`)
}
