import { PlatformHandler } from './base';
import { PlatformConfig, RegistrationResult } from '../types';

export class EpicGamesHandler extends PlatformHandler {
  name = 'epic_games';
  url = 'https://www.epicgames.com/id/register';

  async register(config: PlatformConfig): Promise<RegistrationResult> {
    try {
      await this.page.goto(this.url);
      await this.page.waitForLoadState('networkidle');

      // Epic Games requires: email, password, first name, last name, DOB, country
      
      // Wait for form to load
      await this.page.waitForSelector('#email', { timeout: 15000 });
      
      // Fill email
      await this.page.fill('#email', config.email);
      
      // Password
      const password = config.password || this.generatePassword();
      await this.page.fill('#password', password);
      
      // First name & Last name
      // Using parent's name for legal purposes
      const firstName = config.additionalFields?.firstName || 'Baby';
      const lastName = config.additionalFields?.lastName || config.username;
      await this.page.fill('#firstName', firstName);
      await this.page.fill('#lastName', lastName);
      
      // Date of birth - use baby's expected date or current date
      const dob = config.dob || new Date().toISOString().split('T')[0];
      // Epic Games DOB format may vary - adjust as needed
      
      // Click continue/submit
      await this.page.click('button[type="submit"]');

      console.log(`Epic Games registration initiated for ${config.username}`);
      console.log('Please check email for verification link');
      
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
