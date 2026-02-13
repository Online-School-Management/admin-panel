/**
 * Teacher feature translations (Myanmar)
 */

export const teacher = {
  // Page titles
  pages: {
    list: 'ဆရာများ',
    detail: 'ဆရာ အသေးစိတ်',
    create: 'ဆရာ ထည့်ရန်',
    edit: 'ဆရာ ပြင်ဆင်ရန်',
  },

  // Descriptions
  descriptions: {
    list: 'ဆရာများအားလုံးနှင့် ၎င်းတို့၏ အချက်အလက်များကို စီမံခန့်ခွဲရန်',
    detail: 'ဤဆရာ၏ အသေးစိတ်အချက်အလက်များကို ကြည့်ရန်',
    create: 'စနစ်သို့ ဆရာအသစ် ထည့်ရန်',
    edit: 'ဆရာ အချက်အလက်များကို အပ်ဒိတ်လုပ်ရန်',
  },

  // Form labels
  form: {
    fullName: 'အမည် အပြည့်အစုံ',
    department: 'ဌာန',
    subject: 'ဘာသာရပ်',
    employmentType: 'အလုပ်ခန့်အပ်မှု အမျိုးအစား',
    commissionType: 'လစာ အမျိုးအစား',
    commissionRate: 'ကော်မရှင် ရာခိုင်နှုန်း (%)',
    monthlySalaryAmount: 'လစဉ် လစာ ပမာဏ (MMK)',
    perSessionAmount: 'တစ်ခေါက် ပမာဏ (MMK)',
    bankAccount: 'ဘဏ်အကောင့်',
    enterBankAccount: 'ဘဏ်အကောင့် အချက်အလက် ထည့်ရန်',
    status: 'အခြေအနေ',
    password: 'စကားဝှက်',
    confirmPassword: 'စကားဝှက် အတည်ပြုရန်',
    selectDepartment: 'ဌာနကို ရွေးချယ်ရန် (ရွေးချယ်ရမည်)',
    selectSubject: 'ဘာသာရပ်ကို ရွေးချယ်ရန် (ရွေးချယ်ရမည်)',
    selectEmploymentType: 'အလုပ်ခန့်အပ်မှု အမျိုးအစားကို ရွေးချယ်ရန်',
    selectCommissionType: 'လစာ အမျိုးအစားကို ရွေးချယ်ရန်',
    selectStatus: 'အခြေအနေကို ရွေးချယ်ရန်',
    leavePasswordBlank: 'လက်ရှိကို ထိန်းသိမ်းရန် လွတ်ထားရန်',
    enterFullName: 'အမည် အပြည့်အစုံ ထည့်ရန်',
    enterPassword: 'စကားဝှက် ထည့်ရန်',
    confirmPasswordPlaceholder: 'စကားဝှက် အတည်ပြုရန်',
    enterCommissionRate: 'ကော်မရှင် ရာခိုင်နှုန်း ထည့်ရန် (0-99)',
    enterMonthlySalaryAmount: 'လစဉ် လစာ ပမာဏ ထည့်ရန်',
    enterPerSessionAmount: 'တစ်ခေါက် ပမာဏ ထည့်ရန်',
    commissionRateHint: 'ကျောင်းသား၏ လစဉ်ငွေပေးချေမှု၏ ရာခိုင်နှုန်း',
    monthlySalaryHint: 'Session အရေအတွက်မပါဘဲ လစဉ် ပုံသေ လစာ',
    perSessionHint: 'သင်ကြားသည့် session တစ်ခုစီအတွက် ပုံသေ ပမာဏ',
    noSubject: 'ဘာသာရပ် မရှိ',
  },

  // Commission types
  commissionType: {
    monthly_percent: 'လစဉ် % ငွေပေးချေမှု',
    monthly_salary: 'ပုံသေ လစဉ် လစာ',
    per_session: 'တစ်ခေါက် ပုံသေ',
  },

  // Table headers
  table: {
    no: 'နံပါတ်',
    teacherId: 'ဆရာ ID',
    name: 'အမည်',
    email: 'အီးမေးလ်',
    department: 'ဌာန',
    subject: 'ဘာသာရပ်',
    employmentType: 'အလုပ်ခန့်အပ်မှု အမျိုးအစား',
    status: 'အခြေအနေ',
    created: 'ဖန်တီးထားသည်',
    actions: 'လုပ်ဆောင်ချက်များ',
  },

  // Filters
  filters: {
    allStatus: 'အခြေအနေ အားလုံး',
    allDepartments: 'ဌာန အားလုံး',
    allEmploymentTypes: 'အလုပ်ခန့်အပ်မှု အမျိုးအစား အားလုံး',
    searchTeachers: 'ဆရာများကို ရှာဖွေရန်...',
    filterByStatus: 'အခြေအနေဖြင့် စစ်ထုတ်ရန်',
    filterByDepartment: 'ဌာနဖြင့် စစ်ထုတ်ရန်',
    filterByEmploymentType: 'အလုပ်ခန့်အပ်မှု အမျိုးအစားဖြင့် စစ်ထုတ်ရန်',
  },

  // Messages
  messages: {
    noTeachers: 'ဆရာ မရှိပါ',
    noTeachersFound: 'သင့်စံနှုန်းများနှင့် ကိုက်ညီသော ဆရာ မတွေ့ရှိပါ',
    creating: 'ဖန်တီးနေသည်...',
    updating: 'အပ်ဒိတ်လုပ်နေသည်...',
    teacherNotFound: 'ဆရာ မတွေ့ရှိပါ',
    backToTeachers: 'ဆရာများသို့ ပြန်သွားရန်',
  },

  // Employment types
  employmentType: {
    'full-time': 'အချိန်ပြည့်',
    'part-time': 'အချိန်ပိုင်း',
    contract: 'စာချုပ်',
  },

  // Detail page sections
  detail: {
    basicInformation: 'အခြေခံ အချက်အလက်များ',
    additionalInformation: 'ထပ်ဆောင်း အချက်အလက်များ',
    status: 'အခြေအနေ',
    notes: 'မှတ်ချက်များ',
    teacherId: 'ဆရာ ID',
    fullName: 'အမည် အပြည့်အစုံ',
    department: 'ဌာန',
    subject: 'ဘာသာရပ်',
    employmentType: 'အလုပ်ခန့်အပ်မှု အမျိုးအစား',
    commissionType: 'လစာ အမျိုးအစား',
    commissionRate: 'ကော်မရှင် ရာခိုင်နှုန်း (%)',
    monthlySalaryAmount: 'လစဉ် လစာ ပမာဏ',
    perSessionAmount: 'တစ်ခေါက် ပမာဏ',
    bankAccount: 'ဘဏ်အကောင့်',
    hireDate: 'အလုပ်ခန့်သည့်ရက်စွဲ',
    userStatus: 'အသုံးပြုသူ အခြေအနေ',
    teacherStatus: 'ဆရာ အခြေအနေ',
    timestamps: 'အချိန်မှတ်တမ်းများ',
    created: 'ဖန်တီးထားသည်',
    updated: 'အပ်ဒိတ်လုပ်ထားသည်',
    errorLoading: 'ဆရာ ဖွင့်ရာတွင် အမှားအယွင်း',
  },

  // Delete dialog
  delete: {
    title: 'သေချာပါသလား။',
    description: 'ဤလုပ်ဆောင်ချက်ကို ပြန်ဖျက်၍မရပါ။ ၎င်းသည် ဆရာ',
    andAllData: 'နှင့် ဆက်စပ်ဒေတာအားလုံးကို အပြီးအပိုင် ဖျက်ပစ်ပါမည်။',
    cancel: 'ဖျက်သိမ်းရန်',
    delete: 'ဖျက်ရန်',
    deleting: 'ဖျက်နေသည်...',
  },

  // Form actions
  actions: {
    create: 'ဆရာ ထည့်ရန်',
    update: 'အပ်ဒိတ်လုပ်ရန်',
    cancel: 'ဖျက်သိမ်းရန်',
    back: 'ပြန်သွားရန်',
    view: 'ကြည့်ရန်',
    edit: 'ပြင်ဆင်ရန်',
    delete: 'ဖျက်ရန်',
    clear: 'ရှင်းလင်းရန်',
  },
}

