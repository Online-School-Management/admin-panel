/**
 * Student feature translations (English)
 */

export const student = {
  // Page titles
  pages: {
    list: 'Students',
    detail: 'Student Details',
    create: 'Create Student',
    edit: 'Edit Student',
  },

  // Descriptions
  descriptions: {
    list: 'Manage all students and their information',
    detail: 'View detailed information about this student',
    create: 'Add a new student to the system',
    edit: 'Update student information',
  },

  // Form labels
  form: {
    name: 'Full Name',
    email: 'Email',
    phone: 'Phone (Optional)',
    dateOfBirth: 'Date of Birth (Optional)',
    gender: 'Gender',
    address: 'Address',
    guardianPhone: 'Guardian Phone',
    age: 'Age',
    status: 'Status',
    password: 'Password',
    passwordConfirmation: 'Confirm Password',
    selectGender: 'Select gender',
    selectStatus: 'Select status',
    leavePasswordBlank: 'Leave blank to keep current',
    enterName: 'Enter full name',
    enterEmail: 'Enter email address',
    enterPhone: 'Enter phone number  (Optional)',
    enterAddress: 'Enter address',
    enterGuardianPhone: 'Enter guardian phone number',
    enterAge: 'Enter age',
    enterPassword: 'Enter password',
    enterPasswordConfirmation: 'Confirm password',
    education: 'Education',
    enterEducation: 'e.g. Grade 10, High School',
    schoolType: 'School',
    selectSchoolType: 'Select school type',
    schoolGovernment: 'Government',
    schoolInternational: 'International',
    schoolPrivate: 'Private',
    schoolOther: 'Other',
    schoolOtherSpecify: 'Specify school (Other)',
    enterSchoolOther: 'Enter school name',
    class: 'Class',
    enterClass: 'e.g. Grade 10-A',
    facebookLink: 'Facebook (name or link)',
    enterFacebookLink: 'e.g. Phyo Zaw or https://facebook.com/...',
  },

  schoolType: {
    government: 'Government',
    international: 'International',
    private: 'Private',
    other: 'Other',
  },

  // Table headers
  table: {
    no: 'No',
    studentId: 'Student ID',
    name: 'Name',
    email: 'Email',
    guardianPhone: 'Guardian Phone',
    age: 'Age',
    status: 'Status',
    socialAccount: 'Social Account (Facebook)',
    actions: 'Actions',
  },

  // Filters
  filters: {
    allStatus: 'All Status',
    searchStudents: 'Search students...',
    filterByStatus: 'Filter by status',
  },

  // Messages
  messages: {
    noStudents: 'No students available',
    noStudentsFound: 'No students found matching your criteria',
    creating: 'Creating...',
    updating: 'Updating...',
    studentNotFound: 'Student not found',
    backToStudents: 'Back to Students',
    restoring: 'Restoring...',
    forceDeleting: 'Deleting...',
  },

  // Detail page sections
  detail: {
    basicInformation: 'Basic Information',
    additionalInformation: 'Additional Information',
    status: 'Status',
    studentId: 'Student ID',
    fullName: 'Full Name',
    guardianPhone: 'Guardian Phone',
    age: 'Age',
    education: 'Education',
    school: 'School',
    class: 'Class',
    facebookLink: 'Facebook',
    userStatus: 'User Status',
    studentStatus: 'Student Status',
    timestamps: 'Timestamps',
    created: 'Created',
    updated: 'Updated',
    errorLoading: 'Error loading student',
  },

  // Delete dialog
  delete: {
    title: 'Are you sure?',
    description: 'This action cannot be undone. This will permanently delete the student',
    andAllData: 'and all associated data.',
    cancel: 'Cancel',
    delete: 'Delete',
    deleting: 'Deleting...',
  },

  // Dialogs
  dialogs: {
    restoreTitle: 'Restore Student',
    restoreMessage: 'Are you sure you want to restore "{{name}}"? This will restore the student and their user account.',
    forceDeleteTitle: 'Permanently Delete Student',
    forceDeleteMessage: 'Are you sure you want to permanently delete "{{name}}"? This action cannot be undone and will permanently remove the student, their user account, and all related data (enrollments, payments, etc.).',
  },

  // Form actions
  actions: {
    create: 'Create Student',
    update: 'Update Student',
    cancel: 'Cancel',
    back: 'Back',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    clear: 'Clear',
    restore: 'Restore',
    forceDelete: 'Permanent Delete',
  },

  tabs: {
    active: 'Active Students',
    trashed: 'Deleted Students',
  },
}



