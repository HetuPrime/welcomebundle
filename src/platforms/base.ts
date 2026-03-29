import { Page, Browser, BrowserContext } from 'playwright';
import { PlatformConfig, RegistrationResult } from '../types';

export abstract class PlatformHandler {
  abstract name: string;
  abstract url: string;
  
  protected page!: Page;
  protected context!: BrowserContext;
  
  async setup(browser: Browser): Promise<void> {
    this.context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
    });
    this.page = await this.context.newPage();
  }
  
  async cleanup(): Promise<void> {
    await this.page?.close();
    await this.context?.close();
  }
  
  abstract register(config: PlatformConfig): Promise<RegistrationResult>;
  
  protected async waitForEmail(email: string, timeout = 60000): Promise<string> {
    // To be implemented with email service integration
    throw new Error('Email waiting not implemented yet');
  }
  
  protected success(username: string, email: string): RegistrationResult {
    return {
      platform: this.name,
      success: true,
      username,
      timestamp: new Date(),
      credentials: { username, email },
    };
  }
  
  protected fail(error: string): RegistrationResult {
    return {
      platform: this.name,
      success: false,
      error,
      timestamp: new Date(),
    };
  }
}
