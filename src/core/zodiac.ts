/**
 * 星座和生肖计算
 */

// 星座数据
const ZODIAC_SIGNS = [
  { name: '摩羯座', symbol: '♑', start: [1, 1], end: [1, 19] },
  { name: '水瓶座', symbol: '♒', start: [1, 20], end: [2, 18] },
  { name: '双鱼座', symbol: '♓', start: [2, 19], end: [3, 20] },
  { name: '白羊座', symbol: '♈', start: [3, 21], end: [4, 19] },
  { name: '金牛座', symbol: '♉', start: [4, 20], end: [5, 20] },
  { name: '双子座', symbol: '♊', start: [5, 21], end: [6, 21] },
  { name: '巨蟹座', symbol: '♋', start: [6, 22], end: [7, 22] },
  { name: '狮子座', symbol: '♌', start: [7, 23], end: [8, 22] },
  { name: '处女座', symbol: '♍', start: [8, 23], end: [9, 22] },
  { name: '天秤座', symbol: '♎', start: [9, 23], end: [10, 23] },
  { name: '天蝎座', symbol: '♏', start: [10, 24], end: [11, 22] },
  { name: '射手座', symbol: '♐', start: [11, 23], end: [12, 21] },
  { name: '摩羯座', symbol: '♑', start: [12, 22], end: [12, 31] },
];

// 生肖数据
const CHINESE_ZODIACS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

// 生肖对应年份（参考年份）
const ZODIAC_YEARS: Record<string, number> = {
  '鼠': 2020, '牛': 2021, '虎': 2022, '兔': 2023, '龙': 2024,
  '蛇': 2025, '马': 2026, '羊': 2027, '猴': 2028, '鸡': 2029,
  '狗': 2030, '猪': 2031,
};

export interface ZodiacInfo {
  sign: string;       // 星座名称
  symbol: string;     // 星座符号
  chinese: string;    // 生肖
  element: string;    // 五行元素
}

/**
 * 获取星座
 */
export function getZodiac(month: number, day: number): { name: string; symbol: string } {
  for (const sign of ZODIAC_SIGNS) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (month === startMonth && day >= startDay) {
      return { name: sign.name, symbol: sign.symbol };
    }
    if (month === endMonth && day <= endDay) {
      return { name: sign.name, symbol: sign.symbol };
    }
  }
  
  // Default to Capricorn if not found
  return { name: '摩羯座', symbol: '♑' };
}

/**
 * 获取生肖
 */
export function getChineseZodiac(year: number): string {
  const index = (year - 4) % 12;
  return CHINESE_ZODIACS[index >= 0 ? index : index + 12];
}

/**
 * 获取五行元素（简化版）
 */
export function getElement(year: number): string {
  const elements = ['金', '木', '水', '火', '土'];
  const index = Math.floor((year - 4) / 2) % 5;
  return elements[index >= 0 ? index : index + 5];
}

/**
 * 获取完整星座信息
 */
export function getZodiacInfo(date: Date): ZodiacInfo {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  const zodiac = getZodiac(month, day);
  const chinese = getChineseZodiac(year);
  const element = getElement(year);

  return {
    sign: zodiac.name,
    symbol: zodiac.symbol,
    chinese: chinese,
    element: element,
  };
}

/**
 * 获取星座运势（娱乐用途）
 */
export function getZodiacFortune(sign: string): string {
  const fortunes: Record<string, string[]> = {
    '白羊座': ['充满活力', '勇于冒险', '热情直率'],
    '金牛座': ['稳重可靠', '耐心十足', '热爱美好'],
    '双子座': ['机智灵活', '好奇心强', '善于沟通'],
    '巨蟹座': ['温柔体贴', '重视家庭', '感情丰富'],
    '狮子座': ['自信大方', '领导力强', '慷慨热情'],
    '处女座': ['细心认真', '追求完美', '善于分析'],
    '天秤座': ['优雅和谐', '公平公正', '善于社交'],
    '天蝎座': ['洞察力强', '意志坚定', '感情专一'],
    '射手座': ['乐观开朗', '热爱自由', '追求真理'],
    '摩羯座': ['踏实稳重', '责任感强', '有远大抱负'],
    '水瓶座': ['独立创新', '思想前卫', '友善博爱'],
    '双鱼座': ['浪漫敏感', '富有同情心', '想象力丰富'],
  };

  const traits = fortunes[sign] || ['独一无二'];
  return traits.join('、');
}
