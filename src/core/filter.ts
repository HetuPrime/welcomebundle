/**
 * 过滤工具 - 简化版，避免循环导入
 */

// 负面关键词黑名单
const NEGATIVE_KEYWORDS = [
  'death', 'kill', 'murder', 'shoot', 'attack', 'violence', 'war', 'terror',
  'earthquake', 'flood', 'fire', 'disaster', 'accident', 'crash', 'collapse',
  'covid', 'virus', 'pandemic', 'disease', 'outbreak', 'infection',
  'crime', 'arrest', 'fraud', 'scandal', 'theft', 'robbery',
  'sad', 'tragic', 'worst', 'crisis', 'fail', 'lose',
];

// 正面关键词
const POSITIVE_KEYWORDS = [
  'birth', 'baby', 'born', 'life', 'new',
  'achievement', 'award', 'record', 'first', 'breakthrough', 'success', 'win', 'celebrate',
  'hope', 'love', 'dream', 'future', 'inspire',
  'discovery', 'launch', 'innovation', 'science', 'space', 'technology',
  'art', 'music', 'film', 'book', 'culture', 'festival',
];

export interface NewsItem {
  title: string;
  source?: string;
  url?: string;
  publishedAt?: Date;
}

/**
 * 检查是否包含负面关键词
 */
function hasNegativeKeywords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return NEGATIVE_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

/**
 * 计算正面分数
 */
function calculatePositiveScore(text: string): number {
  const lowerText = text.toLowerCase();
  let score = 0;
  
  POSITIVE_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword.toLowerCase())) {
      score += 1;
    }
  });
  
  return score;
}

/**
 * 过滤新闻 - 只保留正面内容
 */
export function filterNews(articles: NewsItem[], maxCount: number = 3): NewsItem[] {
  return articles
    // 过滤负面新闻
    .filter(article => !hasNegativeKeywords(article.title))
    // 计算正面分数
    .map(article => ({
      ...article,
      score: calculatePositiveScore(article.title),
    }))
    // 按分数排序
    .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
    // 取前N条
    .slice(0, maxCount);
}

/**
 * 如果没有正向新闻，使用默认内容
 */
export function getDefaultNews(birthDate: Date): NewsItem[] {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  return [
    {
      title: `${year}年${month}月${day}日，世界迎来了一个新生命`,
      source: 'WelcomeBundle',
      score: 10,
    },
    {
      title: '每一天都是新的开始，充满无限可能',
      source: 'WelcomeBundle',
      score: 5,
    },
    {
      title: '愿你在爱的包围中成长',
      source: 'WelcomeBundle',
      score: 5,
    },
  ];
}
