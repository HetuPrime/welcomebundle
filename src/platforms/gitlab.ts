import { PlatformHandler } from './base';
import { PlatformConfig, RegistrationResult } from '../types';

export class GitLabHandler extends PlatformHandler {
  name = 'gitlab';
  url = 'https://gitlab.com/users/sign_up';

  async register(config: PlatformConfig): Promise<RegistrationResult> {
    try {
      await this.page.goto(this.url);
      await this.page.waitForLoadState('networkidle');

      // GitLab registration
      await this.page.waitForSelector('#new_user', { timeout: 15000 });
      
      // First name and last name
      const firstName = config.additionalFields?.firstName || config.username;
      const lastName = config.additionalFields?.lastName || '';
      
      await this.page.fill('#user_first_name', firstName);
      await this.page.fill('#user_last_name', lastName);
      
      // Username
      await this.page.fill('#user_username', config.username);
      
      // Email
      await this.page.fill('#user_email', config.email);
      
      // Password
      const password = config.password || this.generatePassword();
      await this.page.fill('#user_password', password);
      
      // Click register
      await this.page.click('button[type="submit"]');

      console.log(`GitLab registration initiated for ${config.username}`);
      console.log('Please check email for verification link from GitLab');
      
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
