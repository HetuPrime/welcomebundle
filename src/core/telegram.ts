import TelegramBot from 'node-telegram-bot-api';
import { WelcomeBundle } from './core/bundle';
import { loadConfigFromEnv } from './core/config';
import { BirthProofGenerator, BirthProofData } from './core/proof';
import { TimeCapsule } from './core/capsule';
import { getDigitalFootprint } from './core/external';
import * as fs from 'fs';

export interface TelegramOptions {
  botToken: string;
  chatId: string;
  encryptionKey: string;
}

interface SessionData {
  step: 'idle' | 'waiting_name' | 'registering' | 'done';
  babyName?: string;
  platforms?: any[];
  birthDate?: Date;
}

export class TelegramTrigger {
  private bot: TelegramBot;
  private chatId: string;
  private encryptionKey: string;
  private isRunning: boolean = false;
  private sessions: Map<number, SessionData> = new Map();
  private proofGenerator: BirthProofGenerator;
  private capsuleService: TimeCapsule;

  constructor(options: TelegramOptions) {
    this.bot = new TelegramBot(options.botToken, { polling: true });
    this.chatId = options.chatId;
    this.encryptionKey = options.encryptionKey;
    this.proofGenerator = new BirthProofGenerator({ style: 'modern' });
    this.capsuleService = new TimeCapsule(options.encryptionKey);
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Start command
    this.bot.onText(/\/start/, async (msg) => {
      if (msg.chat.id.toString() !== this.chatId) return;
      
      this.sessions.set(msg.chat.id, { step: 'idle' });

      await this.bot.sendMessage(
        msg.chat.id,
        `👋 欢迎来到 WelcomeBundle！\n\n` +
        `这是一份数字出生礼包，为孩子创建数字身份、封存时间胶囊。\n\n` +
        `命令:\n` +
        `/register - 开始创建数字身份\n` +
        `/proof - 生成数字出生证明\n` +
        `/capsule - 时间胶囊功能\n` +
        `/help - 帮助信息`,
      );
    });

    // Register command
    this.bot.onText(/\/register/, async (msg) => {
      if (msg.chat.id.toString() !== this.chatId) return;

      this.sessions.set(msg.chat.id, { step: 'waiting_name' });

      await this.bot.sendMessage(
        msg.chat.id,
        `👋 请告诉我宝宝的名字:`,
      );
    });

    // Proof command
    this.bot.onText(/\/proof/, async (msg) => {
      if (msg.chat.id.toString() !== this.chatId) return;

      const session = this.sessions.get(msg.chat.id);
      if (!session?.babyName) {
        await this.bot.sendMessage(msg.chat.id, '请先运行 /register 创建数字身份');
        return;
      }

      await this.generateAndSendProof(msg.chat.id, session);
    });

    // Capsule commands
    this.bot.onText(/\/capsule/, async (msg) => {
      if (msg.chat.id.toString() !== this.chatId) return;

      await this.bot.sendMessage(
        msg.chat.id,
        `💌 时间胶囊\n\n` +
        `命令:\n` +
        `/capsule_create - 创建时间胶囊\n` +
        `/capsule_list - 查看所有胶囊\n` +
        `/capsule_add - 添加信件\n` +
        `/capsule_unlock - 解锁胶囊`,
      );
    });

    this.bot.onText(/\/capsule_create/, async (msg) => {
      if (msg.chat.id.toString() !== this.chatId) return;

      const session = this.sessions.get(msg.chat.id);
      if (!session?.babyName) {
        await this.bot.sendMessage(msg.chat.id, '请先运行 /register 创建数字身份');
        return;
      }

      const capsule = await this.capsuleService.create({
        babyName: session.babyName,
        unlockYears: 18,
      });

      await this.bot.sendMessage(
        msg.chat.id,
        `✅ 时间胶囊已创建！\n\n` +
        `ID: ${capsule.id}\n` +
        `解锁日期: ${capsule.unlockAt.toLocaleDateString('zh-CN')}\n\n` +
        `使用 /capsule_add 添加信件或媒体文件`,
      );
    });

    this.bot.onText(/\/capsule_list/, async (msg) => {
      if (msg.chat.id.toString() !== this.chatId) return;

      const capsules = await this.capsuleService.listCapsules();
      
      if (capsules.length === 0) {
        await this.bot.sendMessage(msg.chat.id, '暂无时间胶囊');
        return;
      }

      let text = '📦 时间胶囊列表:\n\n';
      capsules.forEach((c, i) => {
        const unlocked = new Date() >= c.unlockAt ? '✅ 已解锁' : '🔒 未解锁';
        text += `${i + 1}. ${c.babyName}\n`;
        text += `   解锁: ${c.unlockAt.toLocaleDateString('zh-CN')}\n`;
        text += `   内容: ${c.contentCount} 个\n`;
        text += `   状态: ${unlocked}\n\n`;
      });

      await this.bot.sendMessage(msg.chat.id, text);
    });

    // Handle text messages
    this.bot.on('message', async (msg) => {
      if (msg.chat.id.toString() !== this.chatId) return;
      if (!msg.text || msg.text.startsWith('/')) return;

      const session = this.sessions.get(msg.chat.id);
      if (!session) return;

      if (session.step === 'waiting_name') {
        session.babyName = msg.text!;
        session.step = 'registering';
        session.birthDate = new Date();

        await this.bot.sendMessage(
          msg.chat.id,
          `🎉 ${msg.text}！多美的名字！\n` +
          `正在为 ${msg.text} 准备数字出生礼包...\n\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `🎫 创建数字身份...\n` +
          `━━━━━━━━━━━━━━━━━━━━`,
        );

        // Perform registration
        await this.performRegistration(msg.chat.id, session);
      }
    });

    console.log('🤖 Telegram bot is running...');
  }

  private async performRegistration(chatId: number, session: SessionData): Promise<void> {
    if (this.isRunning) {
      await this.bot.sendMessage(chatId, '⏳ 正在处理中...');
      return;
    }

    this.isRunning = true;

    try {
      const config = loadConfigFromEnv();
      const bundle = new WelcomeBundle(config);
      
      await bundle.init();
      
      const platforms = config.platforms.filter(p => p.enabled);
      session.platforms = [];

      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];
        
        await this.bot.sendMessage(
          chatId,
          `✨ ${this.getPlatformDisplayName(platform.name)}\n` +
          `   注册中...`,
        );

        // Simulate registration (in real code, call bundle.registerAll())
        session.platforms.push({
          name: platform.name,
          username: platform.username,
          registeredAt: new Date(),
        });

        await this.bot.sendMessage(
          chatId,
          `✨ ${this.getPlatformDisplayName(platform.name)}\n` +
          `   ✓ 用户名: @${platform.username}\n` +
          `   ✓ 注册时间: ${new Date().toLocaleString('zh-CN')}\n` +
          `   🎊 ${session.babyName} 的第一个${this.getPlatformType(platform.name)}身份！`,
        );
      }

      await bundle.close();

      // Generate proof
      await this.bot.sendMessage(
        chatId,
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `🎁 ${session.babyName} 的数字出生礼包完成！\n\n` +
        `📊 查看出生证明: /proof\n` +
        `💌 封存时间胶囊: /capsule_create\n` +
        `━━━━━━━━━━━━━━━━━━━━`,
      );

      session.step = 'done';

    } catch (error) {
      await this.bot.sendMessage(
        chatId,
        `❌ 错误: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      this.isRunning = false;
    }
  }

  private async generateAndSendProof(chatId: number, session: SessionData): Promise<void> {
    await this.bot.sendMessage(chatId, '📜 正在生成数字出生证明...');

    try {
      // Get digital footprint
      const footprint = await getDigitalFootprint();

      const data: BirthProofData = {
        babyName: session.babyName!,
        birthDate: session.birthDate!,
        platforms: session.platforms || [],
        weather: footprint.weather || undefined,
        news: footprint.news.slice(0, 3).map(n => n.title),
        topSong: footprint.topSong || undefined,
      };

      const result = await this.proofGenerator.generate(data);

      // Send the image
      await this.bot.sendPhoto(chatId, result.png, {
        caption: `🎂 ${session.babyName} 的数字出生证明\n\n创建于 ${session.birthDate?.toLocaleString('zh-CN')}`,
      });

    } catch (error) {
      await this.bot.sendMessage(
        chatId,
        `❌ 生成证明失败: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private getPlatformDisplayName(name: string): string {
    const names: Record<string, string> = {
      github: 'GitHub',
      gitlab: 'GitLab',
      steam: 'Steam',
      epic_games: 'Epic Games',
      battlenet: 'Battle.net',
      nintendo: 'Nintendo',
      reddit: 'Reddit',
      medium: 'Medium',
    };
    return names[name] || name;
  }

  private getPlatformType(name: string): string {
    const types: Record<string, string> = {
      github: '开发者',
      gitlab: '开发者',
      steam: '游戏',
      epic_games: '游戏',
      battlenet: '游戏',
      nintendo: '游戏',
      reddit: '社区',
      medium: '博客',
    };
    return types[name] || '平台';
  }

  stop(): void {
    this.bot.stopPolling();
  }
}
