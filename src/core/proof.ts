/**
 * 数字出生证明生成器
 * 支持文本（ASCII）和 HTML 格式
 */

import * as fs from 'fs';
import * as path from 'path';

export interface BirthProofData {
  babyName: string;
  birthDate: Date;
  platforms: Array<{
    name: string;
    username: string;
    registeredAt: Date;
  }>;
  weather?: {
    temp: number;
    description: string;
  };
  news?: string[];
  topSong?: {
    name: string;
    artist: string;
  };
  bitcoinPrice?: number;
}

export interface BirthProofOptions {
  outputDir?: string;
  format?: 'text' | 'html' | 'markdown';
}

export class BirthProofGenerator {
  private outputDir: string;
  private format: 'text' | 'html' | 'markdown';

  constructor(options: BirthProofOptions = {}) {
    this.outputDir = options.outputDir || path.join(process.cwd(), 'output', 'proofs');
    this.format = options.format || 'text';
    
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
    
    // Save to file
    const filename = `birth-proof-${data.babyName.toLowerCase()}-${Date.now()}.txt`;
    const filePath = path.join(this.outputDir, filename);
    fs.writeFileSync(filePath, text);

    console.log(`📜 数字出生证明已生成: ${filePath}`);

    return { text, html, file: filePath };
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
    lines.push(`║${' '.repeat(48)}║`);
    lines.push(`║  注册时间: ${data.birthDate.toLocaleString('zh-CN').padEnd(34)}║`);
    lines.push(`║${' '.repeat(48)}║`);
    lines.push(`╠${innerBorder}╣`);
    lines.push(`║${this.center('🎫 数字身份', 48)}║`);
    lines.push(`╠${innerBorder}╣`);
    
    data.platforms.forEach(p => {
      const line = `  ✓ ${this.padRight(p.name, 12)} @${p.username}`;
      lines.push(`║${line.padEnd(48)}║`);
    });
    
    lines.push(`║${' '.repeat(48)}║`);
    lines.push(`╠${innerBorder}╣`);
    lines.push(`║${this.center('🌍 数字足迹', 48)}║`);
    lines.push(`╠${innerBorder}╣`);

    if (data.weather) {
      const line = `  ☀️ 天气: ${data.weather.description} ${data.weather.temp}°C`;
      lines.push(`║${line.padEnd(48)}║`);
    }

    if (data.news && data.news.length > 0) {
      const newsText = data.news[0].length > 36 ? data.news[0].substring(0, 36) + '...' : data.news[0];
      lines.push(`║  📰 新闻: ${newsText.padEnd(38)}║`);
    }

    if (data.topSong) {
      const songText = `${data.topSong.name} - ${data.topSong.artist}`;
      const truncated = songText.length > 36 ? songText.substring(0, 36) + '...' : songText;
      lines.push(`║  🎵 热歌: ${truncated.padEnd(38)}║`);
    }

    if (data.bitcoinPrice) {
      lines.push(`║  💰 BTC: $${data.bitcoinPrice.toLocaleString().padEnd(37)}║`);
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
    const platformsHtml = data.platforms.map(p => `
      <div class="platform">
        <span class="check">✓</span>
        <span class="name">${p.name}</span>
        <span class="username">@${p.username}</span>
      </div>
    `).join('');

    const weatherHtml = data.weather 
      ? `<div class="info-item">☀️ 天气: ${data.weather.description} ${data.weather.temp}°C</div>` 
      : '';

    const newsHtml = data.news && data.news.length > 0
      ? `<div class="info-item">📰 新闻: ${data.news[0]}</div>`
      : '';

    const songHtml = data.topSong
      ? `<div class="info-item">🎵 热歌: ${data.topSong.name} - ${data.topSong.artist}</div>`
      : '';

    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${data.babyName} 的数字出生证明</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #f0f4f8; padding: 40px; }
    .certificate { 
      max-width: 600px; margin: 0 auto; background: white; 
      border-radius: 20px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header { text-align: center; margin-bottom: 30px; }
    .emoji { font-size: 48px; }
    .title { font-size: 28px; font-weight: bold; color: #2d3748; margin-top: 10px; }
    .subtitle { color: #718096; font-size: 14px; }
    .time { color: #a0aec0; font-size: 14px; margin: 20px 0; text-align: center; }
    .section-title { 
      text-align: center; color: #718096; font-size: 14px; 
      border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; 
      padding: 10px; margin: 20px 0;
    }
    .platform { display: flex; align-items: center; padding: 10px 0; }
    .check { color: #48bb78; font-size: 20px; margin-right: 10px; }
    .name { font-weight: bold; color: #2d3748; width: 120px; }
    .username { color: #718096; }
    .info-item { padding: 8px 0; color: #4a5568; }
    .footer { text-align: center; margin-top: 30px; color: #a0aec0; }
    .footer .heart { color: #e53e3e; }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="emoji">🎂</div>
      <div class="title">${data.babyName} 的数字出生证明</div>
      <div class="subtitle">Digital Birth Certificate</div>
    </div>
    
    <div class="time">注册时间: ${data.birthDate.toLocaleString('zh-CN')}</div>
    
    <div class="section-title">🎫 数字身份</div>
    ${platformsHtml}
    
    <div class="section-title">🌍 数字足迹</div>
    ${weatherHtml}
    ${newsHtml}
    ${songHtml}
    
    <div class="footer">
      created with <span class="heart">❤️</span><br>
      welcomebundle.dev
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  private center(text: string, width: number): string {
    const pad = width - text.length;
    const left = Math.floor(pad / 2);
    const right = pad - left;
    return ' '.repeat(left) + text + ' '.repeat(right);
  }

  private padRight(text: string, width: number): string {
    return text.padEnd(width, ' ');
  }
}
