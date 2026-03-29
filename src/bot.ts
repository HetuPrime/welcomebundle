import 'dotenv/config';
import { TelegramTrigger } from './core/telegram';

async function main() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const encryptionKey = process.env.ENCRYPTION_KEY;

  if (!botToken || !chatId) {
    console.error('❌ 缺少必要的环境变量:');
    console.error('   TELEGRAM_BOT_TOKEN - Telegram Bot Token');
    console.error('   TELEGRAM_CHAT_ID - 你的 Chat ID');
    console.error('\n获取方式:');
    console.error('1. 在 Telegram 中找到 @BotFather');
    console.error('2. 发送 /newbot 创建机器人');
    console.error('3. 获取 Bot Token');
    console.error('4. 发消息给你的 Bot');
    console.error('5. 访问 https://api.telegram.org/bot<TOKEN>/getUpdates 获取 Chat ID');
    process.exit(1);
  }

  if (!encryptionKey) {
    console.error('❌ 请设置 ENCRYPTION_KEY 环境变量');
    console.error('运行: openssl rand -base64 32');
    process.exit(1);
  }

  console.log('🎁 WelcomeBundle Telegram Bot\n');
  console.log('📱 发送 /start 到你的 Bot 开始使用\n');

  const bot = new TelegramTrigger({
    botToken,
    chatId,
    encryptionKey,
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 正在停止...');
    bot.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    bot.stop();
    process.exit(0);
  });
}

main().catch(console.error);
