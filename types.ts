export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  lang: string;
  timezoneOffset: number; // Simplified relative to UTC
}

export interface CalendarEvent {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  title: string;
  type: 'holiday' | 'bank_holiday' | 'personal' | 'meeting';
  description?: string;
}

export interface HolidayData {
  date: string;
  name: string;
  isBankHoliday: boolean;
}

export interface AssistantResponse {
  content: string;
  translation?: string;
}

export const SUPPORTED_COUNTRIES: Country[] = [
  { code: 'HK', name: '香港', flag: '🇭🇰', currency: 'HKD', lang: '繁体中文 (粤语)', timezoneOffset: 8 },
  { code: 'TW', name: '台湾', flag: '🇹🇼', currency: 'TWD', lang: '繁体中文', timezoneOffset: 8 },
  { code: 'MO', name: '澳门', flag: '🇲🇴', currency: 'MOP', lang: '繁体中文/葡萄牙语', timezoneOffset: 8 },
  { code: 'TH', name: '泰国', flag: '🇹🇭', currency: 'THB', lang: '泰语', timezoneOffset: 7 },
  { code: 'MY', name: '马来西亚', flag: '🇲🇾', currency: 'MYR', lang: '马来语/英语', timezoneOffset: 8 },
  { code: 'VN', name: '越南', flag: '🇻🇳', currency: 'VND', lang: '越南语', timezoneOffset: 7 },
  { code: 'ID', name: '印尼', flag: '🇮🇩', currency: 'IDR', lang: '印尼语', timezoneOffset: 7 },
  { code: 'TR', name: '土耳其', flag: '🇹🇷', currency: 'TRY', lang: '土耳其语', timezoneOffset: 3 },
  { code: 'SA', name: '沙特阿拉伯', flag: '🇸🇦', currency: 'SAR', lang: '阿拉伯语', timezoneOffset: 3 },
  { code: 'JO', name: '约旦', flag: '🇯🇴', currency: 'JOD', lang: '阿拉伯语', timezoneOffset: 3 },
  { code: 'AE', name: '阿联酋', flag: '🇦🇪', currency: 'AED', lang: '阿拉伯语', timezoneOffset: 4 },
  { code: 'EG', name: '埃及', flag: '🇪🇬', currency: 'EGP', lang: '阿拉伯语', timezoneOffset: 2 },
];
