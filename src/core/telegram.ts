import TelegramBot from 'node-telegram-bot-api';
import { WelcomeBundle } from './bundle';
import { loadConfigFromEnv } from './config';

export interface TelegramOptions {
  botToken: string;
  chatId: string;
  encryptionKey: string;
}

export class TelegramTrigger {
  private bot: TelegramBot;
  private chatId: string;
  private encryptionKey: string;
  private isRunning: boolean = false;

  constructor(options: TelegramOptions) {
    this.bot = new TelegramBot(options.botToken, { polling: true });
    this.chatId = options.chatId;
    this.encryptionKey = options.encryptionKey;
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Start command
    this.bot.onText(/\/start/, async (msg) => {
      if (msg.chat.id.toString() !== this.chatId) {
        return;
      }

      const config = loadConfigFromEnv();
      const platforms = config.platforms.filter(p => p.enabled);

      await this.bot.sendMessage(
        msg.chat.id,
        `🎁 *WelcomeBundle Bot*\n\n` +
        `预配置的平台 (${platforms.length}个):\n` +
        platforms.map(p => `• ${p.name}: \`${p.username}\``).join('\n') +
        `\n\n命令:\n` +
        `/register - 开始注册\n` +
        `/status - 查看状态\n` +
        `/help - 帮助信息`,
        { parse_mode: 'Markdown' }
      );
    });

    // Register command
    this.bot.onText(/\/register/, async (msg) => {
      if (msg.chat.id.toString() !== this.chatId) {
        return;
      }

      if (this.isRunning) {
        await this.bot.sendMessage(msg.chat.id, '⏳ 注册正在进行中...');
        return;
      }

      this.isRunning = true;

      await this.bot.sendMessage(
        msg.chat.id,
        `🚀 *开始注册账号*\n\n正在启动浏览器...`,
        { parse_mode: 'Markdown' }
      );

      try {
        const config = loadConfigFromEnv();
        const bundle = new WelcomeBundle(config);
        
        await bundle.init();
        
        // Progress updates
        const platforms = config.platforms.filter(p => p.enabled);
        for (let i = 0; i < platforms.length; i++) {
          await this.bot.sendMessage(
            msg.chat.id,
            `📡 [${i + 1}/${platforms.length}] 正在注册 *${platforms[i].name}*...`,
            { parse_mode: 'Markdown' }
          );
        }

        const results = await bundle.registerAll();
        await bundle.close();

        // Send summary
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);

        let summary = `🎁 *注册完成!*\n\n`;
        summary += `✅ 成功: ${successful.length}\n`;
        if (successful.length > 0) {
          summary += successful.map(r => `   • ${r.platform}: \`${r.username}\``).join('\n');
        }
        
        if (failed.length > 0) {
          summary += `\n\n❌ 失败: ${failed.length}\n`;
          summary += failed.map(r => `   • ${r.platform}: ${r.error}`).join('\n');
        }

        await this.bot.sendMessage(msg.chat.id, summary, { parse_mode: 'Markdown' });

      } catch (error) {
        await this.bot.sendMessage(
          msg.chat.id,
          `❌ 错误: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      } finally {
        this.isRunning = false;
      }
    });

    // Status command
    this.bot.onText(/\/status/, async (msg) => {
      if (msg.chat.id.toString() !== this.chatId) {
        return;
      }

      await this.bot.sendMessage(
        msg.chat.id,
        this.isRunning 
          ? '⏳ 正在注册中...' 
          : '✅ 待机中，等待 /register 命令'
      );
    });

    // Help command
    this.bot.onText(/\/help/, async (msg) => {
      if (msg.chat.id.toString() !== this.chatId) {
        return;
      }

      await this.bot.sendMessage(
        msg.chat.id,
        `🎁 *WelcomeBundle 帮助*\n\n` +
        `这个机器人用于在孩子出生时自动注册账号。\n\n` +
        `命令:\n` +
        `/start - 显示配置信息\n` +
        `/register - 开始注册所有账号\n` +
        `/status - 查看当前状态\n` +
        `/help - 显示此帮助\n\n` +
        `使用方法:\n` +
        `1. 在 .env 中配置宝宝名字和父母邮箱\n` +
        `2. 孩子出生时发送 /register\n` +
        `3. 查看邮箱并点击验证链接\n` +
        `4. 完成！`,
        { parse_mode: 'Markdown' }
      );
    });

    // Unknown message handler
    this.bot.on('message', async (msg) => {
      if (msg.chat.id.toString() !== this.chatId) {
        return;
      }

      if (!msg.text?.startsWith('/')) {
        await this.bot.sendMessage(
          msg.chat.id,
          '使用 /help 查看可用命令'
        );
      }
    });

    console.log('🤖 Telegram bot is running...');
  }

  stop(): void {
    this.bot.stopPolling();
  }
}
