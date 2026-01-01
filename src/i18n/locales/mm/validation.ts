/**
 * Validation messages (Myanmar)
 */

export const validation = {
  required: (field: string) => `${field} လိုအပ်ပါသည်`,
  minLength: (field: string, min: number) => `${field} သည် အနည်းဆုံး ${min} လုံးရှိရမည်`,
  maxLength: (field: string, max: number) => `${field} သည် ${max} လုံးထက်မပိုရပါ`,
  invalidEmail: 'ကျေးဇူးပြု၍ မှန်ကန်သော အီးမေးလ်လိပ်စာထည့်သွင်းပါ',
  passwordMismatch: 'စကားဝှက်များ ကိုက်ညီမှုမရှိပါ',
  passwordConfirmationRequired: 'စကားဝှက်အတည်ပြုရန် လိုအပ်ပါသည်',
}


