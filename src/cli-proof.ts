#!/usr/bin/env node
/**
 * 数字出生证明 CLI
 * 
 * Usage:
 *   npm run proof -- --name Emma --date "2024-03-29"
 */

import 'dotenv/config';
import { BirthProofGenerator, BirthProofData } from './core/proof';
import { getDigitalFootprint } from './core/api';
import { getZodiacInfo } from './core/zodiac';

interface CliOptions {
  name: string;
  date: Date;
  time?: string;
  location?: string;
  message?: string;
  style?: string;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  
  const options: any = {
    name: process.env.BABY_NAME || 'Baby',
    date: new Date(),
  };

  args.forEach(arg => {
    if (arg.startsWith('--name=')) {
      options.name = arg.split('=')[1];
    } else if (arg.startsWith('--date=')) {
      options.date = new Date(arg.split('=')[1]);
    } else if (arg.startsWith('--time=')) {
      options.time = arg.split('=')[1];
    } else if (arg.startsWith('--location=')) {
      options.location = arg.split('=')[1];
    } else if (arg.startsWith('--message=')) {
      options.message = arg.split('=')[1];
    } else if (arg.startsWith('--style=')) {
      options.style = arg.split('=')[1];
    }
  });

  return options;
}

async function main() {
  const options = parseArgs();
  
  console.log('');
  console.log('══════════════════════════════════════════════════');
  console.log('            🎂 数字出生证明');
  console.log('══════════════════════════════════════════════════');
  console.log('');
  console.log(`   宝宝名字: ${options.name}`);
  console.log(`   出生日期: ${options.date.toLocaleString('zh-CN')}`);
  if (options.time) console.log(`   出生时间: ${options.time}`);
  if (options.location) console.log(`   出生地点: ${options.location}`);
  if (options.message) console.log(`   父母寄语: "${options.message}"`);
  console.log('');
  
  // 获取星座生肖
  const zodiac = getZodiacInfo(options.date);
  console.log(`   ♈ 星座: ${zodiac.sign} ${zodiac.symbol}`);
  console.log(`   🐲 生肖: ${zodiac.chinese}`);
  console.log('');
  
  // 获取数字足迹
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   🌍 获取数字足迹...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const footprint = await getDigitalFootprint({
    date: options.date,
  });
  
  if (footprint.weather) {
    console.log(`   ☀️ 天气: ${footprint.weather.condition} ${footprint.weather.temp}°C ${footprint.weather.wind || ''}`);
  }
  if (footprint.news && footprint.news.length > 0) {
    const newsText = footprint.news[0].title.length > 44 ? footprint.news[0].title.substring(0, 44) + '...' : footprint.news[0].title;
    console.log(`   📰 新闻: ${newsText}`);
  }
  if (footprint.history && footprint.history.length > 0) {
    const historyText = footprint.history[0].text.length > 36 ? footprint.history[0].text.substring(0, 36) + '...' : footprint.history[0].text;
    console.log(`   📜 历史: ${footprint.history[0].year}年 ${historyText}`);
  }
  if (footprint.famous && footprint.famous.length > 0) {
    console.log(`   👤 名人: ${footprint.famous[0].name} (${footprint.famous[0].year})`);
  }
  if (footprint.song) {
    console.log(`   🎵 热歌: ${footprint.song.title} - ${footprint.song.artist}`);
  }
  console.log('');
  
  // 创建证明
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   📜 生成数字出生证明...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const generator = new BirthProofGenerator({
    outputDir: './output/proofs',
    style: options.style as any || 'modern',
  });

  const data: BirthProofData = {
    babyName: options.name,
    birthDate: options.date,
    zodiac,
    weather: footprint.weather,
    news: footprint.news ? footprint.news.map(n => n.title) : undefined,
    history: footprint.history,
    famous: footprint.famous,
    song: footprint.song,
    message: options.message,
  };

  const result = await generator.generate(data);

  console.log('');
  console.log('══════════════════════════════════════════════════');
  console.log('            ✅ 生成完成！');
  console.log('══════════════════════════════════════════════════');
  console.log('');
  console.log(`   📄 文本文件: ${result.file}`);
  console.log(`   🌐 HTML 文件: ${result.html}`);
  console.log('');
}

main().catch(error => {
  console.error('❌ 错误:', error);
  process.exit(1);
});
