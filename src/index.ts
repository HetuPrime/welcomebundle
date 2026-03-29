import 'dotenv/config';
import { WelcomeBundle } from './core/bundle';
import { loadConfigFromEnv } from './core/config';

async function main() {
  console.log('🎁 WelcomeBundle - 数字诞生礼包\n');
  
  // 检查环境变量
  const babyName = process.env.BABY_NAME;
  const parentEmail = process.env.PARENT_EMAIL;
  const encryptionKey = process.env.ENCRYPTION_KEY;

  if (!babyName || !parentEmail) {
    console.error('❌ 请设置环境变量:');
    console.error('   BABY_NAME - 宝宝名字');
    console.error('   PARENT_EMAIL - 父母邮箱');
    process.exit(1);
  }

  if (!encryptionKey) {
    console.error('❌ 请设置 ENCRYPTION_KEY:');
    console.error('   运行: openssl rand -base64 32');
    process.exit(1);
  }
  
  // 显示支持的平台
  const supported = WelcomeBundle.getSupportedPlatforms();
  console.log('📋 支持的平台:', supported.join(', '));
  
  // 加载配置
  const config = loadConfigFromEnv();
  const enabledPlatforms = config.platforms.filter(p => p.enabled);
  
  console.log(`\n📦 将注册 ${enabledPlatforms.length} 个平台:\n`);
  enabledPlatforms.forEach(p => {
    console.log(`   • ${p.name}: ${p.username}`);
  });
  
  console.log('\n🚀 开始注册...\n');
  
  // 创建 bundle 实例
  const bundle = new WelcomeBundle(config);
  
  try {
    await bundle.init();
    const results = await bundle.registerAll();
    
    const successCount = results.filter(r => r.success).length;
    console.log(`\n🎉 完成! ${successCount}/${results.length} 个平台注册成功\n`);
    
  } catch (error) {
    console.error('❌ 错误:', error);
  } finally {
    await bundle.close();
  }
}

main().catch(console.error);
