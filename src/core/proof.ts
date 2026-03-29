/**
 * 数字出生证明生成器
 * 生成精美的文本和 HTML 格式的出生证明
 */

import * as fs from 'fs';
import * as path from 'path';
import { ZodiacInfo } from './zodiac';
import { WeatherData, NewsItem, HistoryEvent, FamousPerson, SongData } from './api';

export interface BirthProofData {
  babyName: string;
  birthDate: Date;
  birthTime?: string;
  location?: string;
  zodiac: ZodiacInfo;
  weather?: WeatherData;
  news?: string[];
  history?: HistoryEvent[];
  famous?: FamousPerson[];
  song?: SongData;
  bitcoinPrice?: number;
  message?: string;
}

export interface BirthProofOptions {
  outputDir?: string;
  format?: 'text' | 'html' | 'both';
  style?: 'modern' | 'vintage' | 'cute' | 'dark';
}

export class BirthProofGenerator {
  private outputDir: string;
  private style: 'modern' | 'vintage' | 'cute' | 'dark';

  constructor(options: BirthProofOptions = {}) {
    this.outputDir = options.outputDir || path.join(process.cwd(), 'output', 'proofs');
    this.style = options.style || 'modern';
    
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * 生成数字出生证明
   */
  async generate(data: BirthProofData): Promise<{ text: string; html: string; file: string }> {
    const text = this.generateText(data);
    const html = this.generateHtml(data);
    
    // Save to files
    const timestamp = Date.now();
    const baseName = `birth-proof-${data.babyName.toLowerCase()}-${timestamp}`;
    
    const textPath = path.join(this.outputDir, `${baseName}.txt`);
    const htmlPath = path.join(this.outputDir, `${baseName}.html`);
    
    fs.writeFileSync(textPath, text);
    fs.writeFileSync(htmlPath, html);

    console.log(`📜 数字出生证明已生成:`);
    console.log(`   📄 文本: ${textPath}`);
    console.log(`   🌐 HTML: ${htmlPath}`);

    return { text, html, file: textPath };
  }

  /**
   * 生成文本格式
   */
  private generateText(data: BirthProofData): string {
    const lines: string[] = [];
    const border = '═'.repeat(50);
    const innerBorder = '─'.repeat(48);

    lines.push(`╔${border}╗`);
    lines.push(`║${this.center('🎂 数字出生证明', 48)}║`);
    lines.push(`║${this.center('Digital Birth Certificate', 48)}║`);
    lines.push(`╠${border}╣`);
    lines.push(`║${' '.repeat(48)}║`);
    lines.push(`║${this.center(`🎉 ${data.babyName}`, 48)}║`);
    lines.push(`║${this.center('数字世界的第一天', 48)}║`);
    lines.push(`║${' '.repeat(48)}║`);
    
    // 日期时间
    const dateStr = data.birthDate.toLocaleDateString('zh-CN');
    const timeStr = data.birthTime || '';
    const locationStr = data.location ? ` 📍${data.location}` : '';
    lines.push(`║${this.center(`${dateStr} ${timeStr}${locationStr}`, 48)}║`);
    
    // 星座生肖
    lines.push(`║${this.center(`${data.zodiac.symbol} ${data.zodiac.sign}  🐲 ${data.zodiac.chinese}年`, 48)}║`);
    lines.push(`║${' '.repeat(48)}║`);
    
    // 天气
    if (data.weather) {
      lines.push(`╠${innerBorder}╣`);
      lines.push(`║${this.center('☀️ 这一天的天气', 48)}║`);
      lines.push(`╠${innerBorder}╣`);
      const weatherStr = `${data.weather.condition} ${data.weather.temp}°C ${data.weather.wind || ''}`;
      lines.push(`║${this.center(weatherStr, 48)}║`);
    }
    
    // 新闻
    if (data.news && data.news.length > 0) {
      lines.push(`║${' '.repeat(48)}║`);
      lines.push(`╠${innerBorder}╣`);
      lines.push(`║${this.center('📰 这一天，世界在发生', 48)}║`);
      lines.push(`╠${innerBorder}╣`);
      data.news.slice(0, 3).forEach(news => {
        const truncated = news.length > 44 ? news.substring(0, 44) + '...' : news;
        lines.push(`║${this.center(`• ${truncated}`, 48)}║`);
      });
    }
    
    // 历史事件
    if (data.history && data.history.length > 0) {
      lines.push(`║${' '.repeat(48)}║`);
      lines.push(`╠${innerBorder}╣`);
      lines.push(`║${this.center('📜 历史上的今天', 48)}║`);
      lines.push(`╠${innerBorder}╣`);
      data.history.slice(0, 3).forEach(event => {
        const truncated = event.text.length > 40 ? event.text.substring(0, 40) + '...' : event.text;
        lines.push(`║${this.center(`• ${event.year}年 ${truncated}`, 48)}║`);
      });
    }
    
    // 同日名人
    if (data.famous && data.famous.length > 0) {
      lines.push(`║${' '.repeat(48)}║`);
      lines.push(`╠${innerBorder}╣`);
      lines.push(`║${this.center('👤 这一天出生的名人', 48)}║`);
      lines.push(`╠${innerBorder}╣`);
      data.famous.slice(0, 3).forEach(person => {
        lines.push(`║${this.center(`• ${person.name} (${person.year})`, 48)}║`);
      });
    }
    
    // 热歌
    if (data.song) {
      lines.push(`║${' '.repeat(48)}║`);
      lines.push(`╠${innerBorder}╣`);
      lines.push(`║${this.center('🎵 那一天，世界在听', 48)}║`);
      lines.push(`╠${innerBorder}╣`);
      lines.push(`║${this.center(`${data.song.title} - ${data.song.artist}`, 48)}║`);
    }
    
    // 父母寄语
    if (data.message) {
      lines.push(`║${' '.repeat(48)}║`);
      lines.push(`╠${innerBorder}╣`);
      lines.push(`║${this.center('💬 父母寄语', 48)}║`);
      lines.push(`╠${innerBorder}╣`);
      lines.push(`║${this.center(`"${data.message}"`, 48)}║`);
      lines.push(`║${this.center('— 爸爸妈妈', 48)}║`);
    }
    
    // 比特币价格
    if (data.bitcoinPrice) {
      lines.push(`║${' '.repeat(48)}║`);
      lines.push(`║${this.center(`💰 当日 BTC: $${data.bitcoinPrice.toLocaleString()}`, 48)}║`);
    }
    
    lines.push(`║${' '.repeat(48)}║`);
    lines.push(`╠${border}╣`);
    lines.push(`║${this.center('created with ❤️', 48)}║`);
    lines.push(`║${this.center('welcomebundle.dev', 48)}║`);
    lines.push(`╚${border}╝`);

    return lines.join('\n');
  }

  /**
   * 生成 HTML 格式
   */
  private generateHtml(data: BirthProofData): string {
    const weatherHtml = data.weather 
      ? `<div class="info-block">
           <div class="info-title">☀️ 这一天的天气</div>
           <div class="info-content">${data.weather.condition} ${data.weather.temp}°C ${data.weather.wind || ''}</div>
         </div>` 
      : '';

    const newsHtml = data.news && data.news.length > 0
      ? `<div class="info-block">
           <div class="info-title">📰 这一天，世界在发生</div>
           <div class="info-list">
             ${data.news.map(n => `<div class="info-item">• ${n}</div>`).join('')}
           </div>
         </div>`
      : '';

    const historyHtml = data.history && data.history.length > 0
      ? `<div class="info-block">
           <div class="info-title">📜 历史上的今天</div>
           <div class="info-list">
             ${data.history.map(h => `<div class="info-item">• ${h.year}年 ${h.text}</div>`).join('')}
           </div>
         </div>`
      : '';

    const famousHtml = data.famous && data.famous.length > 0
      ? `<div class="info-block">
           <div class="info-title">👤 这一天出生的名人</div>
           <div class="info-list">
             ${data.famous.map(f => `<div class="info-item">• ${f.name} (${f.year})</div>`).join('')}
           </div>
         </div>`
      : '';

    const songHtml = data.song
      ? `<div class="info-block">
           <div class="info-title">🎵 那一天，世界在听</div>
           <div class="info-content">${data.song.title} - ${data.song.artist}</div>
         </div>`
      : '';

    const messageHtml = data.message
      ? `<div class="message-block">
           <div class="message-title">💬 父母寄语</div>
           <div class="message-text">"${data.message}"</div>
           <div class="message-sign">— 爸爸妈妈</div>
         </div>`
      : '';

    const bitcoinHtml = data.bitcoinPrice
      ? `<div class="info-item">💰 当日 BTC: $${data.bitcoinPrice.toLocaleString()}</div>`
      : '';

    // 根据风格选择 CSS
    const styleCss = this.getStyleCss();

    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.babyName} 的数字出生证明</title>
  <style>
    ${styleCss}
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="emoji">🎂</div>
      <div class="title">${data.babyName}</div>
      <div class="subtitle">数字世界的第一天</div>
    </div>
    
    <div class="meta">
      <div class="date">${data.birthDate.toLocaleDateString('zh-CN')} ${data.birthTime || ''}</div>
      <div class="zodiac">${data.zodiac.symbol} ${data.zodiac.sign}  🐲 ${data.zodiac.chinese}年 ${data.location ? ` 📍 ${data.location}` : ''}</div>
    </div>
    
    <div class="content">
      ${weatherHtml}
      ${newsHtml}
      ${historyHtml}
      ${famousHtml}
      ${songHtml}
      ${bitcoinHtml}
    </div>
    
    ${messageHtml}
    
    <div class="footer">
      <div class="heart">created with ❤️</div>
      <div class="url">welcomebundle.dev</div>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  private getStyleCss(): string {
    const styles: Record<string, string> = {
      modern: `
        body { font-family: 'Segoe UI', -apple-system, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; margin: 0; }
        .certificate { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
        .header { text-align: center; margin-bottom: 30px; }
        .emoji { font-size: 48px; }
        .title { font-size: 36px; font-weight: bold; color: #2d3748; margin-top: 10px; }
        .subtitle { color: #718096; font-size: 16px; margin-top: 5px; }
        .meta { text-align: center; color: #a0aec0; margin-bottom: 30px; }
        .date { font-size: 18px; margin-bottom: 5px; }
        .zodiac { font-size: 14px; }
        .info-block { margin: 20px 0; }
        .info-title { font-weight: bold; color: #4a5568; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        .info-content { color: #2d3748; font-size: 16px; }
        .info-list { color: #4a5568; line-height: 1.8; }
        .info-item { padding: 5px 0; }
        .message-block { margin: 30px 0; padding: 20px; background: #f7fafc; border-radius: 10px; text-align: center; }
        .message-title { font-weight: bold; color: #4a5568; margin-bottom: 10px; }
        .message-text { font-size: 18px; color: #2d3748; font-style: italic; }
        .message-sign { color: #718096; margin-top: 10px; }
        .footer { text-align: center; margin-top: 40px; color: #a0aec0; }
        .heart { margin-bottom: 5px; }
      `,
      vintage: `
        body { font-family: 'Georgia', serif; background: #f5f0e8; min-height: 100vh; padding: 20px; margin: 0; }
        .certificate { max-width: 600px; margin: 0 auto; background: #fff9f0; border: 4px double #8b7355; padding: 40px; box-shadow: 0 0 20px rgba(0,0,0,0.1); position: relative; }
        .certificate::before { content: ''; position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; border: 1px solid #d4c5b0; pointer-events: none; }
        .header { text-align: center; margin-bottom: 30px; }
        .emoji { font-size: 48px; }
        .title { font-size: 36px; font-weight: bold; color: #4a3c2a; margin-top: 10px; font-family: 'Playfair Display', Georgia, serif; }
        .subtitle { color: #8b7355; font-size: 14px; margin-top: 5px; letter-spacing: 2px; }
        .meta { text-align: center; color: #8b7355; margin-bottom: 30px; font-style: italic; }
        .info-block { margin: 20px 0; border-bottom: 1px solid #d4c5b0; padding-bottom: 15px; }
        .info-title { font-weight: bold; color: #4a3c2a; margin-bottom: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; }
        .info-content { color: #4a3c2a; font-size: 16px; }
        .info-list { color: #4a3c2a; line-height: 1.8; }
        .info-item { padding: 5px 0; }
        .message-block { margin: 30px 0; padding: 20px; background: #f5f0e8; text-align: center; }
        .message-title { font-weight: bold; color: #4a3c2a; margin-bottom: 10px; }
        .message-text { font-size: 18px; color: #4a3c2a; font-style: italic; }
        .message-sign { color: #8b7355; margin-top: 10px; }
        .footer { text-align: center; margin-top: 40px; color: #8b7355; font-size: 12px; }
      `,
      cute: `
        body { font-family: 'Quicksand', 'Segoe UI', sans-serif; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); min-height: 100vh; padding: 20px; margin: 0; }
        .certificate { max-width: 600px; margin: 0 auto; background: white; border-radius: 30px; padding: 40px; box-shadow: 0 10px 30px rgba(255,182,159,0.3); }
        .header { text-align: center; margin-bottom: 30px; }
        .emoji { font-size: 56px; }
        .title { font-size: 32px; font-weight: bold; color: #e57373; margin-top: 10px; }
        .subtitle { color: #ffab91; font-size: 14px; margin-top: 5px; }
        .meta { text-align: center; color: #ffab91; margin-bottom: 30px; }
        .info-block { margin: 20px 0; padding: 15px; background: #fff5f5; border-radius: 15px; }
        .info-title { font-weight: bold; color: #e57373; margin-bottom: 10px; font-size: 13px; }
        .info-content { color: #5d4037; font-size: 15px; }
        .info-list { color: #5d4037; line-height: 1.8; }
        .info-item { padding: 5px 0; }
        .message-block { margin: 30px 0; padding: 20px; background: #fce4ec; border-radius: 15px; text-align: center; }
        .message-title { font-weight: bold; color: #e57373; margin-bottom: 10px; }
        .message-text { font-size: 16px; color: #5d4037; }
        .message-sign { color: #ffab91; margin-top: 10px; }
        .footer { text-align: center; margin-top: 40px; color: #ffab91; }
      `,
      dark: `
        body { font-family: 'SF Pro', -apple-system, sans-serif; background: #1a1a2e; min-height: 100vh; padding: 20px; margin: 0; }
        .certificate { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%); border: 1px solid #d4af37; padding: 40px; box-shadow: 0 0 40px rgba(212,175,55,0.2); }
        .header { text-align: center; margin-bottom: 30px; }
        .emoji { font-size: 48px; }
        .title { font-size: 36px; font-weight: bold; color: #d4af37; margin-top: 10px; }
        .subtitle { color: #8b8b8b; font-size: 14px; margin-top: 5px; letter-spacing: 2px; }
        .meta { text-align: center; color: #8b8b8b; margin-bottom: 30px; }
        .info-block { margin: 20px 0; border-left: 2px solid #d4af37; padding-left: 15px; }
        .info-title { font-weight: bold; color: #d4af37; margin-bottom: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; }
        .info-content { color: #e0e0e0; font-size: 16px; }
        .info-list { color: #e0e0e0; line-height: 1.8; }
        .info-item { padding: 5px 0; }
        .message-block { margin: 30px 0; padding: 20px; background: rgba(212,175,55,0.1); text-align: center; }
        .message-title { font-weight: bold; color: #d4af37; margin-bottom: 10px; }
        .message-text { font-size: 18px; color: #e0e0e0; font-style: italic; }
        .message-sign { color: #8b8b8b; margin-top: 10px; }
        .footer { text-align: center; margin-top: 40px; color: #8b8b8b; }
      `,
    };

    return styles[this.style] || styles.modern;
  }

  private center(text: string, width: number): string {
    // 处理中文字符宽度
    const charWidth = (char: string) => {
      return char.charCodeAt(0) > 127 ? 2 : 1;
    };
    
    let currentWidth = 0;
    for (const char of text) {
      currentWidth += charWidth(char);
    }
    
    const pad = width - currentWidth;
    const left = Math.floor(pad / 2);
    const right = pad - left;
    
    return ' '.repeat(left) + text + ' '.repeat(right);
  }
}
