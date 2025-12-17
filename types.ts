export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  lang: string;
  timezoneOffset: number; // Simplified relative to UTC
  timezone: {
    id: string; // IANA timezone ID
    name: string; // Display name
    cities?: string[]; // Major cities
  };
}

export interface TimezoneInfo {
  id: string;
  name: string;
  offset: number;
  currentTime: string;
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
  { code: 'HK', name: '香港', flag: '🇭🇰', currency: 'HKD', lang: '繁体中文 (粤语)', timezoneOffset: 8,
    timezone: { id: 'Asia/Hong_Kong', name: '香港时间', cities: ['香港'] } },
  { code: 'TW', name: '台湾', flag: '🇹🇼', currency: 'TWD', lang: '繁体中文', timezoneOffset: 8,
    timezone: { id: 'Asia/Taipei', name: '台北时间', cities: ['台北', '高雄'] } },
  { code: 'MO', name: '澳门', flag: '🇲🇴', currency: 'MOP', lang: '繁体中文/葡萄牙语', timezoneOffset: 8,
    timezone: { id: 'Asia/Macau', name: '澳门时间', cities: ['澳门'] } },
  { code: 'TH', name: '泰国', flag: '🇹🇭', currency: 'THB', lang: '泰语', timezoneOffset: 7,
    timezone: { id: 'Asia/Bangkok', name: '曼谷时间', cities: ['曼谷', '清迈'] } },
  { code: 'MY', name: '马来西亚', flag: '🇲🇾', currency: 'MYR', lang: '马来语/英语', timezoneOffset: 8,
    timezone: { id: 'Asia/Kuala_Lumpur', name: '吉隆坡时间', cities: ['吉隆坡', '槟城'] } },
  { code: 'VN', name: '越南', flag: '🇻🇳', currency: 'VND', lang: '越南语', timezoneOffset: 7,
    timezone: { id: 'Asia/Ho_Chi_Minh', name: '胡志明市时间', cities: ['胡志明市', '河内'] } },
  { code: 'ID', name: '印尼', flag: '🇮🇩', currency: 'IDR', lang: '印尼语', timezoneOffset: 7,
    timezone: { id: 'Asia/Jakarta', name: '雅加达时间', cities: ['雅加达', '巴厘岛'] } },
  { code: 'TR', name: '土耳其', flag: '🇹🇷', currency: 'TRY', lang: '土耳其语', timezoneOffset: 3,
    timezone: { id: 'Europe/Istanbul', name: '伊斯坦布尔时间', cities: ['伊斯坦布尔', '安卡拉'] } },
  { code: 'SA', name: '沙特阿拉伯', flag: '🇸🇦', currency: 'SAR', lang: '阿拉伯语', timezoneOffset: 3,
    timezone: { id: 'Asia/Riyadh', name: '利雅得时间', cities: ['利雅得', '吉达'] } },
  { code: 'JO', name: '约旦', flag: '🇯🇴', currency: 'JOD', lang: '阿拉伯语', timezoneOffset: 3,
    timezone: { id: 'Asia/Amman', name: '安曼时间', cities: ['安曼'] } },
  { code: 'AE', name: '阿联酋', flag: '🇦🇪', currency: 'AED', lang: '阿拉伯语', timezoneOffset: 4,
    timezone: { id: 'Asia/Dubai', name: '迪拜时间', cities: ['迪拜', '阿布扎比'] } },
  { code: 'EG', name: '埃及', flag: '🇪🇬', currency: 'EGP', lang: '阿拉伯语', timezoneOffset: 2,
    timezone: { id: 'Africa/Cairo', name: '开罗时间', cities: ['开罗', '亚历山大'] } },
  { code: 'JP', name: '日本', flag: '🇯🇵', currency: 'JPY', lang: '日语', timezoneOffset: 9,
    timezone: { id: 'Asia/Tokyo', name: '东京时间', cities: ['东京', '大阪'] } },
  { code: 'KR', name: '韩国', flag: '🇰🇷', currency: 'KRW', lang: '韩语', timezoneOffset: 9,
    timezone: { id: 'Asia/Seoul', name: '首尔时间', cities: ['首尔', '釜山'] } },
  { code: 'SG', name: '新加坡', flag: '🇸🇬', currency: 'SGD', lang: '英语/中文', timezoneOffset: 8,
    timezone: { id: 'Asia/Singapore', name: '新加坡时间', cities: ['新加坡'] } },
];

// Additional common timezones for business
export const COMMON_TIMEZONES: TimezoneInfo[] = [
  { id: 'UTC', name: '协调世界时', offset: 0, currentTime: '' },
  { id: 'America/New_York', name: '纽约时间 (EST/EDT)', offset: -5, currentTime: '' },
  { id: 'America/Los_Angeles', name: '洛杉矶时间 (PST/PDT)', offset: -8, currentTime: '' },
  { id: 'Europe/London', name: '伦敦时间 (GMT/BST)', offset: 0, currentTime: '' },
  { id: 'Europe/Paris', name: '巴黎时间 (CET/CEST)', offset: 1, currentTime: '' },
  { id: 'Asia/Tokyo', name: '东京时间 (JST)', offset: 9, currentTime: '' },
  { id: 'Asia/Shanghai', name: '北京时间 (CST)', offset: 8, currentTime: '' },
  { id: 'Asia/Singapore', name: '新加坡时间 (SGT)', offset: 8, currentTime: '' },
  { id: 'Australia/Sydney', name: '悉尼时间 (AEDT/AEST)', offset: 11, currentTime: '' },
];
