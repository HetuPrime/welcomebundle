import { PlatformHandler } from './base';
import { PlatformConfig, RegistrationResult } from '../types';

export class MediumHandler extends PlatformHandler {
  name = 'medium';
  url = 'https://medium.com/m/signin';

  async register(config: PlatformConfig): Promise<RegistrationResult> {
    try {
      await this.page.goto(this.url);
      await this.page.waitForLoadState('networkidle');

      // Medium uses email-based authentication
      // Click "Sign up with email" if present
      const emailButton = await this.page.$('text=Sign up with email');
      if (emailButton) {
        await emailButton.click();
      }

      // Wait for email input
      await this.page.waitForSelector('input[type="email"]', { timeout: 15000 });
      await this.page.fill('input[type="email"]', config.email);
      
      // Click continue
      await this.page.click('button[type="submit"]');

      console.log(`Medium registration initiated for ${config.email}`);
      console.log('Please check email for magic link from Medium');
      
      // Medium sends a magic link instead of password
      // User needs to click the link in email
      
      return this.success(config.username || config.email.split('@')[0], config.email);
      
    } catch (error) {
      return this.fail(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
