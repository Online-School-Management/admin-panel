/**
 * Student feature translations (Myanmar)
 */

export const student = {
  // Page titles
  pages: {
    list: 'ကျောင်းသားများ',
    detail: 'ကျောင်းသား အသေးစိတ်',
    create: 'ကျောင်းသား ထည့်ရန်',
    edit: 'ကျောင်းသား ပြင်ဆင်ရန်',
  },

  // Descriptions
  descriptions: {
    list: 'ကျောင်းသားများအားလုံးနှင့် ၎င်းတို့၏ အချက်အလက်များကို စီမံခန့်ခွဲရန်',
    detail: 'ဤကျောင်းသား၏ အသေးစိတ်အချက်အလက်များကို ကြည့်ရန်',
    create: 'စနစ်သို့ ကျောင်းသားအသစ် ထည့်ရန်',
    edit: 'ကျောင်းသား အချက်အလက်များကို အပ်ဒိတ်လုပ်ရန်',
  },

  // Form labels
  form: {
    name: 'အမည် အပြည့်အစုံ',
    email: 'အီးမေးလ်',
    phone: 'ဖုန်း (မဖြည့်လည်းရသည်)',
    dateOfBirth: 'မွေးနေ့',
    gender: 'လိင်',
    address: 'လိပ်စာ',
    guardianPhone: 'မိဘ/အုပ်ထိန်းသူ ဖုန်း',
    age: 'အသက်',
    status: 'အခြေအနေ',
    password: 'စကားဝှက်',
    passwordConfirmation: 'စကားဝှက် အတည်ပြုရန်',
    selectGender: 'လိင်ကို ရွေးချယ်ရန် (ရွေးချယ်ရမည်)',
    selectStatus: 'အခြေအနေကို ရွေးချယ်ရန်',
    leavePasswordBlank: 'လက်ရှိကို ထိန်းသိမ်းရန် လွတ်ထားရန်',
    enterName: 'အမည် အပြည့်အစုံ ထည့်ရန်',
    enterEmail: 'အီးမေးလ် လိပ်စာ ထည့်ရန်',
    enterPhone: 'ဖုန်းနံပါတ် ထည့်ရန် (မဖြည့်လည်းရသည်)',
    enterAddress: 'လိပ်စာ ထည့်ရန်',
    enterGuardianPhone: 'မိဘ/အုပ်ထိန်းသူ ဖုန်းနံပါတ် ထည့်ရန်',
    enterAge: 'အသက် ထည့်ရန်',
    enterPassword: 'စကားဝှက် ထည့်ရန်',
    enterPasswordConfirmation: 'စကားဝှက် အတည်ပြုရန်',
  },

  // Table headers
  table: {
    no: 'နံပါတ်',
    studentId: 'ကျောင်းသား ID',
    name: 'အမည်',
    email: 'အီးမေးလ်',
    guardianPhone: 'မိဘ/အုပ်ထိန်းသူ ဖုန်း',
    age: 'အသက်',
    status: 'အခြေအနေ',
    created: 'ဖန်တီးထားသည်',
    actions: 'လုပ်ဆောင်ချက်များ',
  },

  // Filters
  filters: {
    allStatus: 'အခြေအနေ အားလုံး',
    searchStudents: 'ကျောင်းသားများကို ရှာဖွေရန်...',
    filterByStatus: 'အခြေအနေဖြင့် စစ်ထုတ်ရန်',
  },

  // Messages
  messages: {
    noStudents: 'ကျောင်းသား မရှိပါ',
    noStudentsFound: 'သင့်စံနှုန်းများနှင့် ကိုက်ညီသော ကျောင်းသား မတွေ့ရှိပါ',
    creating: 'ဖန်တီးနေသည်...',
    updating: 'အပ်ဒိတ်လုပ်နေသည်...',
    studentNotFound: 'ကျောင်းသား မတွေ့ရှိပါ',
    backToStudents: 'ကျောင်းသားများသို့ ပြန်သွားရန်',
  },

  // Detail page sections
  detail: {
    basicInformation: 'အခြေခံ အချက်အလက်များ',
    additionalInformation: 'ထပ်ဆောင်း အချက်အလက်များ',
    status: 'အခြေအနေ',
    studentId: 'ကျောင်းသား ID',
    fullName: 'အမည် အပြည့်အစုံ',
    guardianPhone: 'မိဘ/အုပ်ထိန်းသူ ဖုန်း',
    age: 'အသက်',
    userStatus: 'အသုံးပြုသူ အခြေအနေ',
    studentStatus: 'ကျောင်းသား အခြေအနေ',
    timestamps: 'အချိန်မှတ်တမ်းများ',
    created: 'ဖန်တီးထားသည်',
    updated: 'အပ်ဒိတ်လုပ်ထားသည်',
    errorLoading: 'ကျောင်းသား ဖွင့်ရာတွင် အမှားအယွင်း',
  },

  // Delete dialog
  delete: {
    title: 'သေချာပါသလား။',
    description: 'ဤလုပ်ဆောင်ချက်ကို ပြန်ဖျက်၍မရပါ။ ၎င်းသည် ကျောင်းသား',
    andAllData: 'နှင့် ဆက်စပ်ဒေတာအားလုံးကို အပြီးအပိုင် ဖျက်ပစ်ပါမည်။',
    cancel: 'ဖျက်သိမ်းရန်',
    delete: 'ဖျက်ရန်',
    deleting: 'ဖျက်နေသည်...',
  },

  // Form actions
  actions: {
    create: 'ကျောင်းသား ထည့်ရန်',
    update: 'အပ်ဒိတ်လုပ်ရန်',
    cancel: 'ဖျက်သိမ်းရန်',
    back: 'ပြန်သွားရန်',
    view: 'ကြည့်ရန်',
    edit: 'ပြင်ဆင်ရန်',
    delete: 'ဖျက်ရန်',
    clear: 'ရှင်းလင်းရန်',
  },
}



