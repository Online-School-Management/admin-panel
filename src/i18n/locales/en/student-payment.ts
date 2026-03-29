/**
 * Student Payment feature translations (English)
 */

export const studentPayment = {
  // Page titles
  pages: {
    list: 'Student Payments',
    detail: 'Payment Details',
    edit: 'Edit Payment',
  },

  // Descriptions
  descriptions: {
    list: 'Manage all student payments and their status',
    detail: 'View detailed information about this payment',
    edit: 'Update payment information',
  },

  // Form labels
  form: {
    title: 'Update Payment',
    status: 'Status',
    amountPaid: 'Amount Paid',
    paymentDate: 'Payment Date',
    paymentMethod: 'Payment Method',
    receivedBy: 'Received By',
    notes: 'Notes',
    selectStatus: 'Select status',
    selectPaymentMethod: 'Select payment method',
    selectAdmin: 'Select admin',
    noAdmin: 'No admin',
    enterAmount: 'Enter amount',
    originalAmountHelp: 'Full price before discount (for display and reporting).',
    discountType: 'Discount type',
    selectDiscountType: 'Select discount type',
    enterNotes: 'Enter notes (optional)',
  },

  // Table headers
  table: {
    no: 'No',
    student: 'Student',
    course: 'Course',
    monthNumber: 'Month',
    amount: 'Amount',
    dueDate: 'Paid For Month',
    paymentDate: 'Paid At',
    paymentMethod: 'Payment Method',
    status: 'Status',
    actions: 'Actions',
  },

  // Filters
  filters: {
    allStatus: 'All Status',
    searchPayments: 'Search student name...',
    filterByStatus: 'Filter by status',
    filterByCourse: 'Filter by course',
    allCourses: 'All Courses',
  },

  // Messages
  messages: {
    noPayments: 'No payments available',
    noPaymentsFound: 'No payments found matching your criteria',
    noPaymentsForMonth: 'No payments found for this month',
    updating: 'Updating...',
    deleting: 'Deleting...',
    markingAsPaid: 'Marking as paid...',
    paymentNotFound: 'Payment not found',
    backToPayments: 'Back to Payments',
  },

  // Payment methods
  paymentMethod: {
    kbz_pay: 'KBZ Pay',
    aya_pay: 'AYA Pay',
    kbz_mobile_banking: 'KBZ Mobile Banking',
    wave_money: 'Wave Money',
  },

  // Detail sections
  detail: {
    paymentInformation: 'Payment Information',
    enrollmentInformation: 'Enrollment Information',
    monthNumber: 'Month Number',
    amount: 'Amount',
    originalAmount: 'Original amount',
    coursePrice: 'Course price',
    dueDate: 'Due Date',
    paymentDate: 'Payment Date',
    paidAt: 'Paid At',
    paymentMethod: 'Payment Method',
    receivedBy: 'Received By',
    student: 'Student',
    course: 'Course',
    notes: 'Notes',
    status: 'Status',
    timestamps: 'Timestamps',
    created: 'Created',
    updated: 'Updated',
    errorLoading: 'Error loading payment',
    free: 'Free',
    thisMonthFree: 'This month is free (no charge)',
    discount: 'Discount',
    discountPercentage: '{{value}}% off',
    discountFixedAmount: '{{value}} off',
    noDiscount: 'No discount',
  },

  // Actions
  actions: {
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    update: 'Update Payment',
    cancel: 'Cancel',
    clear: 'Clear Filters',
    markAsPaid: 'Mark as Paid',
    confirm: 'Confirm',
  },

  // Dialog
  dialog: {
    deleteTitle: 'Delete Payment',
    deleteDescription: 'Are you sure you want to delete payment #{id}? This action cannot be undone.',
    markAsPaidTitle: 'Mark Payment as Paid',
    markAsPaidDescription: 'Are you sure you want to mark the payment for',
    markAsPaidDescriptionEnd: 'as paid?',
    markAsPaidDescriptionDefault: 'Are you sure you want to mark this payment as paid?',
    paymentDateForFeeMonth: 'Payment date (fee month {{month}})',
    paymentDateBulk: 'Payment date (applies to all selected months)',
    paymentDateFallback: 'Payment date',
    paymentDateHint: 'Leave as today or select the actual payment date.',
    prePayment: 'Pre Payment',
    prePaymentTitle: 'Pre Payment - Select Months',
    prePaymentDescription: 'Select pending months to mark as paid at once.',
    selectedMonths: 'Selected: {{count}} month(s)',
    totalAmount: 'Total Amount',
    noMorePendingMonths: 'No more pending months for this enrollment.',
    confirmBulk: 'Confirm ({{count}} months)',
    backToSingle: 'Back',
  },

  // Helper text
  monthNumber: 'Month {{number}}',
}


