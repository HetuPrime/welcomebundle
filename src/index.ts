import 'dotenv/config';
import { WelcomeBundle } from './core/bundle';
import { loadConfigFromEnv } from './core/config';

async function main() {
  console.log('🎁 WelcomeBundle - Digital Birth Gift for Your Baby\n');
  
  // Show supported platforms
  const supported = WelcomeBundle.getSupportedPlatforms();
  console.log('📋 Supported platforms:', supported.join(', '));
  
  // Load config
  const config = loadConfigFromEnv();
  console.log(`\n📦 Will register ${config.platforms.filter(p => p.enabled).length} platforms:\n`);
  config.platforms.filter(p => p.enabled).forEach(p => {
    console.log(`   - ${p.name}: ${p.username}`);
  });
  
  console.log('\n🚀 Starting registration...\n');
  
  // Create bundle instance
  const bundle = new WelcomeBundle(config);
  
  try {
    await bundle.init();
    const results = await bundle.registerAll();
    
    // TODO: Save results to encrypted storage
    // TODO: Send notification if configured
    
    const successCount = results.filter(r => r.success).length;
    console.log(`\n🎉 Completed! ${successCount}/${results.length} platforms registered.\n`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await bundle.close();
  }
}

main().catch(console.error);
