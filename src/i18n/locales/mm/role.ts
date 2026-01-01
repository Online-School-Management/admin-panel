/**
 * Role feature translations (Myanmar)
 */

export const role = {
  // Page titles
  pages: {
    list: 'အခန်းကဏ္ဍများ',
    detail: 'အခန်းကဏ္ဍ အသေးစိတ်',
  },

  // Descriptions
  descriptions: {
    list: 'အခန်းကဏ္ဍများနှင့် ၎င်းတို့၏ သတ်မှတ်ထားသော ခွင့်ပြုချက်များကို ကြည့်ရန်',
    detail: 'ဤအခန်းကဏ္ဍ၏ အသေးစိတ် အချက်အလက်များကို ကြည့်ရန်',
  },

  // Table headers
  table: {
    id: 'ID',
    name: 'အမည်',
    slug: 'Slug',
    description: 'ဖော်ပြချက်',
    status: 'အခြေအနေ',
    permissions: 'ခွင့်ပြုချက်များ',
    createdAt: 'ဖန်တီးထားသောနေ့စွဲ',
    actions: 'လုပ်ဆောင်ချက်များ',
  },

  // Filters
  filters: {
    allStatus: 'အခြေအနေ အားလုံး',
    searchRoles: 'အခန်းကဏ္ဍများ ရှာဖွေရန်...',
    filterByStatus: 'အခြေအနေဖြင့် စစ်ထုတ်ရန်',
  },

  // Messages
  messages: {
    noRoles: 'အခန်းကဏ္ဍများ မရှိပါ',
    noRolesFound: 'သင့်စံနှုန်းနှင့် ကိုက်ညီသော အခန်းကဏ္ဍများ မတွေ့ရှိပါ',
    noPermissions: 'ဤအခန်းကဏ္ဍသို့ ခွင့်ပြုချက်များ သတ်မှတ်ထားခြင်း မရှိပါ',
    allPermissions: 'ဤအခန်းကဏ္ဍသို့ ခွင့်ပြုချက်များ အားလုံး သတ်မှတ်ထားသည်',
    permissionsCount: (count: number) => `ခွင့်ပြုချက် ${count} ခု`,
    showingRoles: (count: number) => `အခန်းကဏ္ဍ ${count} ခု ပြသထားသည်`,
    roleNotFound: 'အခန်းကဏ္ဍ မတွေ့ရှိပါ',
    backToRoles: 'အခန်းကဏ္ဍများသို့ ပြန်သွားရန်',
  },

  // Detail page sections
  detail: {
    permissions: 'ခွင့်ပြုချက်များ',
    module: 'မော်ဂျူး',
    modulePermissions: (module: string) => `${module} မော်ဂျူး`,
  },
}


