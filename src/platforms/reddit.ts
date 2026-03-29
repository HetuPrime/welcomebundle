import { PlatformHandler } from './base';
import { PlatformConfig, RegistrationResult } from '../types';

export class RedditHandler extends PlatformHandler {
  name = 'reddit';
  url = 'https://www.reddit.com/register/';

  async register(config: PlatformConfig): Promise<RegistrationResult> {
    try {
      await this.page.goto(this.url);
      await this.page.waitForLoadState('networkidle');

      // Reddit registration flow
      await this.page.waitForSelector('#regEmail', { timeout: 15000 });
      await this.page.fill('#regEmail', config.email);
      
      // Click continue
      await this.page.click('button[type="submit"]');
      
      // Wait for username and password fields
      await this.page.waitForSelector('#regUsername', { timeout: 10000 });
      await this.page.fill('#regUsername', config.username);
      
      const password = config.password || this.generatePassword();
      await this.page.fill('#regPassword', password);
      
      // Click signup
      await this.page.click('button[type="submit"]');

      console.log(`Reddit registration initiated for ${config.username}`);
      
      return this.success(config.username, config.email);
      
    } catch (error) {
      return this.fail(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private generatePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    return Array.from({ length: 16 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }
}
