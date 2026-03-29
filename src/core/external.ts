/**
 * 外部数据 API 集成
 * 获取天气、新闻、热歌等数据，用于丰富出生证明
 */

import fetch from 'node-fetch';

export interface WeatherData {
  temp: number;
  description: string;
  city?: string;
}

export interface NewsItem {
  title: string;
  url?: string;
}

export interface SongData {
  name: string;
  artist: string;
}

export interface CryptoPrice {
  name: string;
  price: number;
  change24h: number;
}

/**
 * 天气 API (OpenWeatherMap)
 */
export async function getWeather(lat: number, lon: number, apiKey?: string): Promise<WeatherData | null> {
  const key = apiKey || process.env.OPENWEATHER_API_KEY;
  if (!key) {
    console.log('⚠️  OpenWeatherMap API key not set, skipping weather data');
    return null;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=zh_cn`;
    const response = await fetch(url);
    const data = await response.json() as any;

    return {
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      city: data.name,
    };
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return null;
  }
}

/**
 * 新闻 API (NewsAPI)
 */
export async function getTopNews(apiKey?: string, country = 'cn'): Promise<NewsItem[]> {
  const key = apiKey || process.env.NEWS_API_KEY;
  if (!key) {
    console.log('⚠️  News API key not set, skipping news data');
    return [];
  }

  try {
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${key}&pageSize=3`;
    const response = await fetch(url);
    const data = await response.json() as any;

    return (data.articles || []).map((article: any) => ({
      title: article.title,
      url: article.url,
    }));
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
}

/**
 * 比特币价格 (CoinGecko - 免费，无需 API key)
 */
export async function getBitcoinPrice(): Promise<CryptoPrice | null> {
  try {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true';
    const response = await fetch(url);
    const data = await response.json() as any;

    return {
      name: 'Bitcoin',
      price: data.bitcoin.usd,
      change24h: data.bitcoin.usd_24h_change,
    };
  } catch (error) {
    console.error('Failed to fetch Bitcoin price:', error);
    return null;
  }
}

/**
 * 热门歌曲 (需要 Spotify API)
 */
export async function getTopSong(accessToken?: string): Promise<SongData | null> {
  const token = accessToken || process.env.SPOTIFY_ACCESS_TOKEN;
  if (!token) {
    console.log('⚠️  Spotify access token not set, skipping top song data');
    return null;
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
        name: track.name,
        artist: track.artists[0].name,
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch top song:', error);
    return null;
  }
}

/**
 * 获取当天的数字足迹
 */
export async function getDigitalFootprint(options: {
  weatherApiKey?: string;
  newsApiKey?: string;
  spotifyToken?: string;
  lat?: number;
  lon?: number;
} = {}): Promise<{
  weather: WeatherData | null;
  news: NewsItem[];
  bitcoin: CryptoPrice | null;
  topSong: SongData | null;
}> {
  const [weather, news, bitcoin, topSong] = await Promise.all([
    options.lat && options.lon 
      ? getWeather(options.lat, options.lon, options.weatherApiKey)
      : Promise.resolve(null),
    getTopNews(options.newsApiKey),
    getBitcoinPrice(),
    getTopSong(options.spotifyToken),
  ]);

  return {
    weather,
    news,
    bitcoin,
    topSong,
  };
}
