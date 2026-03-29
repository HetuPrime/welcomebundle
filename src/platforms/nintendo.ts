import { PlatformHandler } from './base';
import { PlatformConfig, RegistrationResult } from '../types';

export class NintendoHandler extends PlatformHandler {
  name = 'nintendo';
  url = 'https://accounts.nintendo.com/register';

  async register(config: PlatformConfig): Promise<RegistrationResult> {
    try {
      await this.page.goto(this.url);
      await this.page.waitForLoadState('networkidle');

      // Nintendo Account registration
      // Nickname
      await this.page.waitForSelector('input[name="nickname"]', { timeout: 15000 });
      await this.page.fill('input[name="nickname"]', config.username);
      
      // Email
      await this.page.fill('input[name="email"]', config.email);
      
      // Password
      const password = config.password || this.generatePassword();
      await this.page.fill('input[name="password"]', password);
      await this.page.fill('input[name="confirmPassword"]', password);
      
      // Date of birth (required for Nintendo)
      const dob = config.dob || '1990-01-01'; // Use parent's DOB
      await this.page.fill('input[name="birthday"]', dob);
      
      // Country/region might need selection
      // await this.page.selectOption('select[name="country"]', 'US');
      
      // Click create account
      await this.page.click('button[type="submit"]');

      console.log(`Nintendo registration initiated for ${config.username}`);
      console.log('Please check email for verification link from Nintendo');
      
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
