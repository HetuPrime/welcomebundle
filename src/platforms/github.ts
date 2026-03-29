import { PlatformHandler } from './base';
import { PlatformConfig, RegistrationResult } from '../types';

export class GitHubHandler extends PlatformHandler {
  name = 'github';
  url = 'https://github.com/signup';

  async register(config: PlatformConfig): Promise<RegistrationResult> {
    try {
      await this.page.goto(this.url);
      await this.page.waitForLoadState('networkidle');

      // Fill email
      await this.page.fill('#email', config.email);
      await this.page.click('button[type="submit"]');

      // Wait for password field
      await this.page.waitForSelector('#password', { timeout: 10000 });
      
      // Generate password if not provided
      const password = config.password || this.generatePassword();
      await this.page.fill('#password', password);
      await this.page.click('button[type="submit"]');

      // Wait for username field
      await this.page.waitForSelector('#login', { timeout: 10000 });
      await this.page.fill('#login', config.username);
      await this.page.click('button[type="submit"]');

      // Handle email verification
      // User needs to click the verification link sent to email
      
      // Note: GitHub may require solving a puzzle/captcha
      // This is a basic implementation
      
      console.log(`GitHub registration initiated for ${config.username}`);
      console.log('Please check email for verification link');
      
      // Wait for verification or timeout
      // In production, we'd integrate with email service to auto-click
      
      return this.success(config.username, config.email);
      
    } catch (error) {
      return this.fail(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private generatePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
