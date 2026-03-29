import { PlatformHandler } from './base';
import { PlatformConfig, RegistrationResult } from '../types';

export class BattleNetHandler extends PlatformHandler {
  name = 'battlenet';
  url = 'https://account.battle.net/creation/flow/creation';

  async register(config: PlatformConfig): Promise<RegistrationResult> {
    try {
      await this.page.goto(this.url);
      await this.page.waitForLoadState('networkidle');

      // Battle.net registration flow
      // They require: first name, last name, DOB, email, password, country
      
      // Wait for form to load
      await this.page.waitForSelector('input[name="firstName"]', { timeout: 15000 });
      
      // First and last name (use parent's name for legal purposes)
      const firstName = config.additionalFields?.firstName || 'Baby';
      const lastName = config.additionalFields?.lastName || config.username;
      await this.page.fill('input[name="firstName"]', firstName);
      await this.page.fill('input[name="lastName"]', lastName);
      
      // Email
      await this.page.fill('input[name="email"]', config.email);
      
      // Password
      const password = config.password || this.generatePassword();
      await this.page.fill('input[name="password"]', password);
      
      // Date of birth - use parent's DOB for legal purposes
      const dob = config.dob || '1990-01-01';
      // Battle.net uses separate fields for month, day, year
      // Adjust selector as needed
      
      // Country selection might be needed
      // await this.page.selectOption('select[name="country"]', 'US');
      
      // Click continue/submit
      await this.page.click('button[type="submit"]');

      console.log(`Battle.net registration initiated for ${config.email}`);
      console.log('Please check email for verification link from Blizzard');
      
      // Note: Battle.net may show CAPTCHA
      // This is a basic implementation
      
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
