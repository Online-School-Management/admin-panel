/**
 * Monthly closing translations (English)
 */

export const monthlyClosing = {
  page: {
    title: 'Monthly closing',
    description: 'View summary by type, all payouts for the period, and add non-teacher payouts',
  },
  period: {
    custom: 'Custom range',
  },
  summary: {
    title: 'Summary',
    monthCloseHint:
      'When teacher payouts for this month are paid, use Month close below to save the official snapshot.',
    monthCloseCustomRange:
      'Closing the month applies to one calendar month. Select a month tab above.',
    teachers: 'Teachers',
    allTeachers: 'All Teachers',
    admin: 'Admin',
    server: 'Server',
    facebook: 'Facebook',
    domain: 'Domain',
    contentWriter: 'Content writer',
    other: 'Other',
    fromStudents: 'From students',
    totalToPay: 'Total to pay',
    balance: 'Balance',
    prepaymentHeld: 'Holding Pre-payment',
    prepaymentHeldHint: 'Paid for fee months after this period',
    totalWithPrepayment: 'Total',
    totalWithPrepaymentHint: 'Balance plus prepayment held',
  },
  type: {
    teacher: 'Teacher',
    admin: 'Admin',
    server: 'Server',
    facebook: 'Facebook',
    domain: 'Domain',
    content_writer: 'Content writer',
    other: 'Other',
  },
  table: {
    no: '#',
    name: 'Name',
    type: 'Type',
    course: 'Course',
    amount: 'Amount',
    status: 'Status',
    actions: 'Actions',
  },
  actions: {
    addPayout: 'Add payout',
    calculatePayout: 'Calculate payout',
    reCalculate: 'Re-calculate',
    calculating: 'Calculating...',
    view: 'View',
    markPaid: 'Mark paid',
    monthClose: 'Month close',
    calculateDisabledMonthClosed:
      'This month is already closed. Re-calculate and add payout are not allowed.',
    cancel: 'Cancel',
    submit: 'Create payout',
    processing: 'Processing...',
  },
  addPayoutModal: {
    title: 'Add payout',
    description: 'Add a payout for Admin, Server, Facebook, Domain, or Content writer.',
    recipientType: 'Recipient type',
    selectType: 'Select type',
    admin: 'Admin',
    recipientAdmin: 'Select admin',
    recipientName: 'Recipient name',
    recipientNamePlaceholder: 'Enter recipient name',
    amount: 'Amount',
    period: 'Period',
    notes: 'Notes (optional)',
    notesPlaceholder: 'Optional notes',
    status: 'Status',
    statusPaid: 'Paid',
    statusPending: 'Pending',
  },
  messages: {
    noPayouts: 'No payouts for this period',
  },
}
