#!/usr/bin/env node
/**
 * 时间胶囊 CLI
 * 
 * Usage:
 *   npm run capsule -- create --name Emma
 *   npm run capsule -- add-letter --id capsule_xxx --file letter.txt
 *   npm run capsule -- unlock --id capsule_xxx
 */

import 'dotenv/config';
import { TimeCapsule } from './core/capsule';
import * as fs from 'fs';

const encryptionKey = process.env.ENCRYPTION_KEY;
if (!encryptionKey) {
  console.error('❌ 请设置 ENCRYPTION_KEY 环境变量');
  console.error('   运行: openssl rand -base64 32');
  process.exit(1);
}

const capsule = new TimeCapsule(encryptionKey);

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'create': {
      const nameArg = args.find(a => a.startsWith('--name='));
      const yearsArg = args.find(a => a.startsWith('--years='));
      
      const babyName = nameArg ? nameArg.split('=')[1] : process.env.BABY_NAME || 'Baby';
      const years = yearsArg ? parseInt(yearsArg.split('=')[1]) : 18;

      const result = await capsule.create({
        babyName,
        unlockYears: years,
      });

      console.log('\n💌 时间胶囊创建成功!');
      console.log(`   ID: ${result.id}`);
      console.log(`   解锁日期: ${result.unlockAt.toLocaleDateString('zh-CN')}`);
      break;
    }

    case 'add-letter': {
      const idArg = args.find(a => a.startsWith('--id='));
      const fileArg = args.find(a => a.startsWith('--file='));
      const descArg = args.find(a => a.startsWith('--desc='));

      if (!idArg || !fileArg) {
        console.error('❌ 缺少参数');
        console.error('   用法: npm run capsule -- add-letter --id=capsule_xxx --file=letter.txt');
        process.exit(1);
      }

      const id = idArg.split('=')[1];
      const filePath = fileArg.split('=')[1];
      const desc = descArg ? descArg.split('=')[1] : undefined;

      const letter = fs.readFileSync(filePath, 'utf-8');
      await capsule.addLetter(id, letter, desc);
      break;
    }

    case 'add-media': {
      const idArg = args.find(a => a.startsWith('--id='));
      const fileArg = args.find(a => a.startsWith('--file='));
      const typeArg = args.find(a => a.startsWith('--type='));

      if (!idArg || !fileArg || !typeArg) {
        console.error('❌ 缺少参数');
        console.error('   用法: npm run capsule -- add-media --id=capsule_xxx --file=video.mp4 --type=video');
        process.exit(1);
      }

      const id = idArg.split('=')[1];
      const filePath = fileArg.split('=')[1];
      const type = typeArg.split('=')[1] as 'video' | 'image' | 'audio';

      await capsule.addMedia(id, filePath, type);
      break;
    }

    case 'unlock': {
      const idArg = args.find(a => a.startsWith('--id='));

      if (!idArg) {
        console.error('❌ 缺少参数');
        console.error('   用法: npm run capsule -- unlock --id=capsule_xxx');
        process.exit(1);
      }

      const id = idArg.split('=')[1];
      const result = await capsule.unlock(id);

      if (result) {
        console.log('\n📦 时间胶囊内容:');
        result.contents.forEach((content, i) => {
          console.log(`   ${i + 1}. ${content.type}: ${content.description || '无描述'}`);
        });
      }
      break;
    }

    case 'list': {
      const capsules = await capsule.listCapsules();
      console.log('\n📦 时间胶囊列表:');
      capsules.forEach(c => {
        const unlocked = new Date() >= c.unlockAt ? '✅ 已解锁' : '🔒 未解锁';
        console.log(`   ${c.id} - ${c.babyName} - ${c.unlockAt.toLocaleDateString('zh-CN')} - ${c.contentCount} 个内容 - ${unlocked}`);
      });
      break;
    }

    default:
      console.log('💌 时间胶囊 CLI\n');
      console.log('用法:');
      console.log('  npm run capsule -- create --name=Emma --years=18');
      console.log('  npm run capsule -- add-letter --id=capsule_xxx --file=letter.txt');
      console.log('  npm run capsule -- add-media --id=capsule_xxx --file=video.mp4 --type=video');
      console.log('  npm run capsule -- unlock --id=capsule_xxx');
      console.log('  npm run capsule -- list');
      break;
  }
}

main().catch(console.error);
