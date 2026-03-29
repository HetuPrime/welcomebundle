import { chromium, Browser } from 'playwright';
import { BundleConfig, PlatformConfig, RegistrationResult } from './types';
import { getHandler, getSupportedPlatforms } from './platforms';

export class WelcomeBundle {
  private browser: Browser | null = null;
  private config: BundleConfig;
  private results: RegistrationResult[] = [];

  constructor(config: BundleConfig) {
    this.config = config;
  }

  async init(): Promise<void> {
    this.browser = await chromium.launch({
      headless: false, // Set to true in production after testing
      slowMo: 100, // Slow down for visibility during development
    });
  }

  async close(): Promise<void> {
    await this.browser?.close();
  }

  async registerAll(): Promise<RegistrationResult[]> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call init() first.');
    }

    const enabledPlatforms = this.config.platforms.filter(p => p.enabled);
    
    console.log(`\n🎁 WelcomeBundle - Starting registration for ${enabledPlatforms.length} platforms\n`);

    for (const platformConfig of enabledPlatforms) {
      console.log(`\n📡 Registering ${platformConfig.name}...`);
      
      const handler = getHandler(platformConfig.name as any);
      if (!handler) {
        console.log(`❌ Platform ${platformConfig.name} is not supported yet.`);
        this.results.push({
          platform: platformConfig.name,
          success: false,
          error: 'Platform not supported',
          timestamp: new Date(),
        });
        continue;
      }

      try {
        await handler.setup(this.browser);
        const result = await handler.register(platformConfig);
        this.results.push(result);
        
        if (result.success) {
          console.log(`✅ ${platformConfig.name} registered successfully!`);
        } else {
          console.log(`❌ ${platformConfig.name} failed: ${result.error}`);
        }
        
        await handler.cleanup();
        
        // Wait a bit between registrations to avoid rate limiting
        await this.delay(2000);
        
      } catch (error) {
        console.log(`❌ ${platformConfig.name} error:`, error);
        this.results.push({
          platform: platformConfig.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date(),
        });
      }
    }

    this.printSummary();
    return this.results;
  }

  private printSummary(): void {
    console.log('\n' + '='.repeat(50));
    console.log('🎁 WelcomeBundle Registration Summary');
    console.log('='.repeat(50));
    
    const successful = this.results.filter(r => r.success);
    const failed = this.results.filter(r => !r.success);
    
    console.log(`\n✅ Successful: ${successful.length}`);
    successful.forEach(r => console.log(`   - ${r.platform}: ${r.username}`));
    
    console.log(`\n❌ Failed: ${failed.length}`);
    failed.forEach(r => console.log(`   - ${r.platform}: ${r.error}`));
    
    console.log('\n' + '='.repeat(50));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static getSupportedPlatforms() {
    return getSupportedPlatforms();
  }
}
