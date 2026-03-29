/**
 * 外部数据 API 集成
 * 获取天气、新闻、历史事件、热歌等数据
 */

// ============== 天气 API ==============

export interface WeatherData {
  condition: string; // 天气状况
  temp: number;       // 温度
  wind?: string;      // 风力
  city?: string;      // 城市
}

export async function getWeather(lat: number, lon: number, date: Date, apiKey?: string): Promise<WeatherData> {
  const key = apiKey || process.env.OPENWEATHER_API_KEY;
  
  if (!key) {
    return getDefaultWeather(date);
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=zh_cn`;
    const response = await fetch(url);
    const data = await response.json() as any;

    return {
      condition: data.weather[0]?.description || '晴',
      temp: Math.round(data.main?.temp || 20),
      wind: data.wind?.speed ? getWindDescription(data.wind.speed) : '微风',
      city: data.name,
    };
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return getDefaultWeather(date);
  }
}

function getWindDescription(speed: number): string {
  if (!speed) return '微风';
  if (speed < 3) return '微风';
  if (speed < 10) return '轻风';
  if (speed < 20) return '中风';
  return '大风';
}

function getDefaultWeather(date: Date): WeatherData {
  const month = date.getMonth() + 1;
  
  if (month >= 3 && month <= 5) {
    return { condition: '春暖花开', temp: 18, wind: '微风' };
  } else if (month >= 6 && month <= 8) {
    return { condition: '晴朗', temp: 28, wind: '微风' };
  } else if (month >= 9 && month <= 11) {
    return { condition: '秋高气爽', temp: 20, wind: '轻风' };
  } else {
    return { condition: '冬日暖阳', temp: 5, wind: '微风' };
  }
}

// ============== 新闻 API ==============

export interface NewsItem {
  title: string;
  source?: string;
  url?: string;
}

export async function getNews(date: Date, apiKey?: string): Promise<NewsItem[]> {
  const key = apiKey || process.env.NEWS_API_KEY;
  
  if (!key) {
    return getDefaultNews(date);
  }

  try {
    const dateStr = date.toISOString().split('T')[0];
    const url = `https://newsapi.org/v2/everything?from=${dateStr}&to=${dateStr}&q=birth OR baby OR hope OR success&sortBy=relevancy&apiKey=${key}`;
    const response = await fetch(url);
    const data = await response.json() as any;

    if (data.articles && data.articles.length > 0) {
      const articles: NewsItem[] = data.articles.map((a: any) => ({
        title: a.title,
        source: a.source?.name,
        url: a.url,
      }));
      
      return articles;
    }
    
    return getDefaultNews(date);
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return getDefaultNews(date);
  }
}

function getDefaultNews(date: Date): NewsItem[] {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return [
    {
      title: `${year}年${month}月${day}日，世界迎来了一个新生命`,
      source: 'WelcomeBundle',
    },
    {
      title: '每一天都是新的开始，充满无限可能',
      source: 'WelcomeBundle',
    },
  ];
}

// ============== 历史事件 API ==============

export interface HistoryEvent {
  year: number;
  text: string;
}

export async function getHistoryEvents(month: number, day: number): Promise<HistoryEvent[]> {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
    const response = await fetch(url);
    const data = await response.json() as any;

    if (data.events && data.events.length > 0) {
      return data.events.slice(0, 10).map((e: any) => ({
        year: e.year,
        text: e.text || e.pages?.[0]?.extract || '',
      }));
    }

    return getDefaultHistoryEvents(month, day);
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return getDefaultHistoryEvents(month, day);
  }
}

function getDefaultHistoryEvents(month: number, day: number): HistoryEvent[] {
  return [
    { year: 1969, text: '阿波罗11号成功登月，人类首次踏上月球' },
    { year: 1945, text: '第二次世界大战结束，世界迎来和平' },
    { year: 1990, text: '哈勃望远镜发射成功，开启太空探索新时代' },
  ];
}

// ============== 同日名人 API ==============

export interface FamousPerson {
  name: string;
  year: number;
}

export async function getFamousBirthdays(month: number, day: number): Promise<FamousPerson[]> {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${month}/${day}`;
    const response = await fetch(url);
    const data = await response.json() as any;

    if (data.births && data.births.length > 0) {
      return data.births.slice(0, 10).map((b: any) => ({
        name: b.pages?.[0]?.title || 'Unknown',
        year: b.year,
      }));
    }

    return getDefaultFamousPeople();
  } catch (error) {
    console.error('Failed to fetch famous birthdays:', error);
    return getDefaultFamousPeople();
  }
}

function getDefaultFamousPeople(): FamousPerson[] {
  return [
    { name: 'Albert Einstein', year: 1879 },
    { name: 'Marie Curie', year: 1867 },
    { name: 'Leonardo da Vinci', year: 1452 },
  ];
}

// ============== 热门歌曲 API（简化版）=============

export interface SongData {
  title: string;
  artist: string;
}

export async function getTopSong(date: Date, accessToken?: string): Promise<SongData> {
  const token = accessToken || process.env.SPOTIFY_ACCESS_TOKEN;
  
  if (!token) {
    return getDefaultSong(date);
  }

  try {
    const url = 'https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks?limit=1';
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json() as any;

    if (data.items && data.items.length > 0) {
      const track = data.items[0].track;
      return {
        title: track.name,
        artist: track.artists[0].name,
      };
    }

    return getDefaultSong(date);
  } catch (error) {
    console.error('Failed to fetch top song:', error);
    return getDefaultSong(date);
  }
}

function getDefaultSong(date: Date): SongData {
  const year = date.getFullYear();
  const songs: Record<number, SongData> = {
    2024: { title: 'Flowers', artist: 'Miley Cyrus' },
    2023: { title: 'Anti-Hero', artist: 'Taylor Swift' },
    2022: { title: 'As It Was', artist: 'Harry Styles' },
    2021: { title: 'Drivers License', artist: 'Olivia Rodrigo' },
    2020: { title: 'Blinding Lights', artist: 'The Weeknd' },
    2019: { title: 'Bad Guy', artist: 'Billie Eilish' },
    2018: { title: 'God\'s Plan', artist: 'Brockhampton' },
  };

  return songs[year] || { title: '你的第一首歌', artist: 'WelcomeBundle' };
}

// ============== 总数据 ==============

export interface DigitalFootprint {
  weather?: WeatherData;
  news?: NewsItem[];
  history?: HistoryEvent[];
  famous?: FamousPerson[];
  song?: SongData;
}

export async function getDigitalFootprint(options: {
  date: Date;
  lat?: number;
  lon?: number;
  weatherApiKey?: string;
  newsApiKey?: string;
  spotifyToken?: string;
} = { date: new Date() }): Promise<DigitalFootprint> {
  const { date, lat, lon, weatherApiKey, newsApiKey, spotifyToken } = options;
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const [weather, news, history, famous, song] = await Promise.all([
    lat && lon ? getWeather(lat, lon, date, weatherApiKey) : Promise.resolve(undefined),
    getNews(date, newsApiKey),
    getHistoryEvents(month, day),
    getFamousBirthdays(month, day),
    getTopSong(date, spotifyToken),
  ]);

  return {
    weather,
    news,
    history,
    famous,
    song,
  };
}
