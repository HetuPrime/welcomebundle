#!/usr/bin/env node
/**
 * 数字出生证明 CLI
 * 
 * Usage:
 *   npm run proof -- --name Emma --date "2024-03-29"
 */

import 'dotenv/config';
import { BirthProofGenerator, BirthProofData } from './core/proof';
import { getDigitalFootprint } from './core/external';

async function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  const nameArg = args.find(a => a.startsWith('--name='));
  const dateArg = args.find(a => a.startsWith('--date='));
  
  const babyName = nameArg ? nameArg.split('=')[1] : process.env.BABY_NAME || 'Baby';
  const birthDate = dateArg ? new Date(dateArg.split('=')[1]) : new Date();

  console.log('📜 生成数字出生证明...\n');
  console.log(`   宝宝名字: ${babyName}`);
  console.log(`   注册时间: ${birthDate.toLocaleString('zh-CN')}\n`);

  // Create proof generator
  const generator = new BirthProofGenerator({
    outputDir: './output/proofs',
    style: 'modern',
  });

  // Get digital footprint (optional)
  console.log('🌍 获取数字足迹...');
  const footprint = await getDigitalFootprint();

  // Create proof data
  const data: BirthProofData = {
    babyName,
    birthDate,
    platforms: [
      { name: 'GitHub', username: babyName.toLowerCase(), registeredAt: birthDate },
      { name: 'Steam', username: `${babyName.toLowerCase()}_gaming`, registeredAt: birthDate },
      { name: 'Reddit', username: babyName.toLowerCase(), registeredAt: birthDate },
    ],
    weather: footprint.weather || undefined,
    news: footprint.news.slice(0, 3).map(n => n.title),
    topSong: footprint.topSong || undefined,
  };

  // Generate proof
  const result = await generator.generate(data);

  console.log('\n✅ 数字出生证明已生成!');
  console.log(`   PNG: ${result.png}`);
  
  if (footprint.bitcoin) {
    console.log(`\n💰 今日比特币价格: $${footprint.bitcoin.price.toLocaleString()}`);
  }
}

main().catch(console.error);
