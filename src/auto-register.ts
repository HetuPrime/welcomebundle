import 'dotenv/config';
import { chromium, Browser, Page } from 'playwright';
import { loadConfigFromEnv } from './core/config';
import { ImapEmailService, GMAIL_APP_PASSWORD_INSTRUCTIONS } from './core/imap';
import { TempMailService } from './core/tempmail';

export interface AutoRegisterOptions {
  dryRun?: boolean;
  autoVerify?: boolean;
  emailService?: 'imap' | 'tempmail';
}

export class AutoRegister {
  private browser: Browser | null = null;
  private emailService: ImapEmailService | TempMailService | null = null;
  private options: AutoRegisterOptions;

  constructor(options: AutoRegisterOptions = {}) {
    this.options = {
      dryRun: true,
      autoVerify: true,
      emailService: 'tempmail',
      ...options,
    };
  }

  async init(): Promise<void> {
    if (!this.options.dryRun) {
      this.browser = await chromium.launch({
        headless: false,
        slowMo: 100,
      });

      // Initialize email service
      if (this.options.autoVerify) {
        await this.initEmailService();
      }
    }
  }

  async close(): Promise<void> {
    await this.browser?.close();
    if (this.emailService instanceof ImapEmailService) {
      await this.emailService.disconnect();
    }
  }

  private async initEmailService(): Promise<void> {
    const emailProvider = process.env.EMAIL_PROVIDER;
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    if (this.options.emailService === 'imap' && emailProvider && emailUser && emailPassword) {
      console.log('📧 Using IMAP email service...');
      this.emailService = new ImapEmailService({
        provider: emailProvider,
        user: emailUser,
        password: emailPassword,
      });
      await (this.emailService as ImapEmailService).connect();
    } else {
      console.log('📧 Using temp email service (mail.tm)...');
      this.emailService = new TempMailService();
    }
  }

  async register(platform: string): Promise<{ success: boolean; email?: string; error?: string }> {
    console.log(`\n📡 Registering ${platform}...`);

    if (this.options.dryRun) {
      console.log(`  [DRY RUN] Would register on ${platform}`);
      return { success: true };
    }

    // Implementation would go here
    // This is a placeholder for the actual registration logic
    return { success: false, error: 'Not implemented' };
  }

  async waitForVerification(platform: string, timeout = 120000): Promise<{ link?: string; code?: string } | null> {
    if (!this.emailService) {
      console.log('⚠️  No email service available, cannot auto-verify');
      return null;
    }

    const platformDomains: Record<string, string[]> = {
      github: ['github.com', 'noreply@github.com'],
      gitlab: ['gitlab.com', 'noreply@gitlab.com'],
      steam: ['steampowered.com', 'support@steampowered.com'],
      epic_games: ['epicgames.com', 'no-reply@epicgames.com'],
      reddit: ['reddit.com', 'noreply@reddit.com'],
    };

    const domains = platformDomains[platform] || [platform];

    if (this.emailService instanceof ImapEmailService) {
      for (const domain of domains) {
        const result = await this.emailService.waitForVerificationEmail(domain, timeout);
        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  static getGmailSetupInstructions(): string {
    return GMAIL_APP_PASSWORD_INSTRUCTIONS;
  }
}

// CLI usage
async function main() {
  console.log('🎁 WelcomeBundle - 自动注册工具\n');

  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || process.env.DRY_RUN === 'true';
  const autoVerify = !args.includes('--no-verify');

  if (dryRun) {
    console.log('⚠️  DRY RUN 模式 - 不会实际注册账号\n');
  }

  const autoRegister = new AutoRegister({
    dryRun,
    autoVerify,
    emailService: process.env.EMAIL_PROVIDER ? 'imap' : 'tempmail',
  });

  try {
    await autoRegister.init();

    // Load config and get platforms
    const config = loadConfigFromEnv();
    const platforms = config.platforms.filter(p => p.enabled);

    console.log(`📦 将注册 ${platforms.length} 个平台:\n`);
    platforms.forEach(p => {
      console.log(`   • ${p.name}: ${p.username}`);
    });

    if (dryRun) {
      console.log('\n✅ DRY RUN 完成');
      console.log('\n要实际执行，请:');
      console.log('  1. 设置 DRY_RUN=false');
      console.log('  2. 配置邮箱服务 (见下方说明)');
      console.log('  3. 运行: npm run register\n');

      if (!process.env.EMAIL_PROVIDER) {
        console.log('📧 邮箱验证方式:');
        console.log('  方式 1: 临时邮箱 (自动)');
        console.log('    - 无需配置，自动创建临时邮箱');
        console.log('    - 缺点: 某些平台可能不接受临时邮箱');
        console.log('');
        console.log('  方式 2: Gmail/Outlook IMAP (推荐)');
        console.log('    - 需要配置 EMAIL_PROVIDER, EMAIL_USER, EMAIL_PASSWORD');
        console.log('    - Gmail 需要创建 App Password');
        console.log(GmailSetupInstructions());
      }
    } else {
      // Actually register
      for (const platform of platforms) {
        await autoRegister.register(platform.name);
      }
    }

  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  } finally {
    await autoRegister.close();
  }
}

function GmailSetupInstructions(): string {
  return `
Gmail App Password 设置:
  1. 访问 https://myaccount.google.com/apppasswords
  2. 选择 "邮件" 应用
  3. 选择 "其他" 设备，命名为 "WelcomeBundle"
  4. 复制生成的 16 位密码
  5. 在 .env 中设置:
     EMAIL_PROVIDER=gmail
     EMAIL_USER=yourname@gmail.com
     EMAIL_PASSWORD=abcd efgh ijkl mnop
`;
}

export default AutoRegister;
