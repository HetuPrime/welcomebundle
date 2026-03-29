import { jest } from '@jest/globals';
import { loadConfigFromEnv, replaceEnvVars, getAllPlatforms } from '../src/core/config';

// Mock environment variables
const originalEnv = process.env;

describe('Config', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    // Set required env vars
    process.env.BABY_NAME = 'Emma';
    process.env.PARENT_EMAIL = 'test@example.com';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('loadConfigFromEnv', () => {
    it('should throw error when BABY_NAME is missing', () => {
      delete process.env.BABY_NAME;
      process.env.PARENT_EMAIL = 'test@example.com';
      
      expect(() => loadConfigFromEnv()).toThrow('BABY_NAME and PARENT_EMAIL environment variables are required');
    });

    it('should throw error when PARENT_EMAIL is missing', () => {
      process.env.BABY_NAME = 'Emma';
      delete process.env.PARENT_EMAIL;
      
      expect(() => loadConfigFromEnv()).toThrow('BABY_NAME and PARENT_EMAIL environment variables are required');
    });

    it('should load config with default platforms', () => {
      const config = loadConfigFromEnv();
      
      expect(config.platforms).toBeDefined();
      expect(config.platforms.length).toBe(3); // Default: github, steam, epic_games
      
      const platformNames = config.platforms.map((p: any) => p.name);
      expect(platformNames).toContain('github');
      expect(platformNames).toContain('steam');
      expect(platformNames).toContain('epic_games');
    });

    it('should generate usernames from BABY_NAME', () => {
      process.env.BABY_NAME = 'Emma Smith';
      
      const config = loadConfigFromEnv();
      
      config.platforms.forEach((platform: any) => {
        expect(platform.username).toBeDefined();
        expect(platform.username).not.toContain(' '); // Spaces should be removed
        expect(platform.email).toBe('test@example.com');
      });
    });

    it('should enable all platforms by default', () => {
      const config = loadConfigFromEnv();
      
      config.platforms.forEach((platform: any) => {
        expect(platform.enabled).toBe(true);
      });
    });

    it('should respect ENABLED_PLATFORMS env var', () => {
      process.env.ENABLED_PLATFORMS = 'github,reddit,medium';
      
      const config = loadConfigFromEnv();
      
      expect(config.platforms.length).toBe(3);
      const platformNames = config.platforms.map((p: any) => p.name);
      expect(platformNames).toContain('github');
      expect(platformNames).toContain('reddit');
      expect(platformNames).toContain('medium');
    });

    it('should respect DISABLED_PLATFORMS env var', () => {
      process.env.DISABLED_PLATFORMS = 'steam,epic_games';
      
      const config = loadConfigFromEnv();
      
      // All platforms (8) minus disabled (2) = 6
      expect(config.platforms.length).toBe(6);
      const platformNames = config.platforms.map((p: any) => p.name);
      expect(platformNames).not.toContain('steam');
      expect(platformNames).not.toContain('epic_games');
      expect(platformNames).toContain('github');
      expect(platformNames).toContain('gitlab');
      expect(platformNames).toContain('reddit');
    });

    it('should give ENABLED_PLATFORMS priority over DISABLED_PLATFORMS', () => {
      process.env.ENABLED_PLATFORMS = 'github,reddit';
      process.env.DISABLED_PLATFORMS = 'github'; // This should be ignored
      
      const config = loadConfigFromEnv();
      
      expect(config.platforms.length).toBe(2);
      const platformNames = config.platforms.map((p: any) => p.name);
      expect(platformNames).toContain('github'); // Still enabled
      expect(platformNames).toContain('reddit');
    });

    it('should handle ENABLED_PLATFORMS with spaces', () => {
      process.env.ENABLED_PLATFORMS = 'github, reddit , medium ';
      
      const config = loadConfigFromEnv();
      
      expect(config.platforms.length).toBe(3);
    });

    it('should ignore unknown platforms in ENABLED_PLATFORMS', () => {
      process.env.ENABLED_PLATFORMS = 'github,unknown_platform,steam';
      
      const config = loadConfigFromEnv();
      
      expect(config.platforms.length).toBe(2);
      const platformNames = config.platforms.map((p: any) => p.name);
      expect(platformNames).toContain('github');
      expect(platformNames).toContain('steam');
    });

    it('should throw error when no platforms are enabled', () => {
      process.env.ENABLED_PLATFORMS = 'unknown_platform';
      
      expect(() => loadConfigFromEnv()).toThrow('No platforms enabled');
    });

    it('should append _gaming to steam username', () => {
      process.env.BABY_NAME = 'Emma';
      process.env.ENABLED_PLATFORMS = 'steam';
      
      const config = loadConfigFromEnv();
      
      expect(config.platforms[0].username).toBe('emma_gaming');
    });

    it('should add LAST_NAME to additionalFields if set', () => {
      process.env.LAST_NAME = 'Smith';
      process.env.ENABLED_PLATFORMS = 'epic_games';
      
      const config = loadConfigFromEnv();
      
      expect(config.platforms[0].additionalFields?.lastName).toBe('Smith');
    });

    it('should add BABY_DOB if set', () => {
      process.env.BABY_DOB = '2024-06-01';
      process.env.ENABLED_PLATFORMS = 'epic_games';
      
      const config = loadConfigFromEnv();
      
      expect(config.platforms[0].dob).toBe('2024-06-01');
    });
  });

  describe('replaceEnvVars', () => {
    it('should replace environment variables in string', () => {
      process.env.TEST_VAR = 'test-value';
      
      const result = replaceEnvVars('${TEST_VAR}');
      
      expect(result).toBe('test-value');
    });

    it('should replace multiple env vars', () => {
      process.env.VAR1 = 'value1';
      process.env.VAR2 = 'value2';
      
      const result = replaceEnvVars('${VAR1}-${VAR2}');
      
      expect(result).toBe('value1-value2');
    });

    it('should handle missing env vars', () => {
      const result = replaceEnvVars('${NONEXISTENT_VAR}');
      
      expect(result).toBe('');
    });

    it('should handle objects recursively', () => {
      process.env.NAME = 'Emma';
      
      const input = {
        user: '${NAME}',
        nested: {
          value: '${NAME}-nested',
        },
      };
      
      const result = replaceEnvVars(input) as any;
      
      expect(result.user).toBe('Emma');
      expect(result.nested.value).toBe('Emma-nested');
    });

    it('should handle arrays', () => {
      process.env.ITEM = 'test';
      
      const input = ['${ITEM}', 'static', '${ITEM}-suffix'];
      const result = replaceEnvVars(input) as string[];
      
      expect(result[0]).toBe('test');
      expect(result[1]).toBe('static');
      expect(result[2]).toBe('test-suffix');
    });
  });

  describe('getAllPlatforms', () => {
    it('should return all supported platforms', () => {
      const platforms = getAllPlatforms();
      
      expect(platforms).toContain('github');
      expect(platforms).toContain('gitlab');
      expect(platforms).toContain('steam');
      expect(platforms).toContain('epic_games');
      expect(platforms).toContain('battlenet');
      expect(platforms).toContain('nintendo');
      expect(platforms).toContain('reddit');
      expect(platforms).toContain('medium');
      expect(platforms.length).toBe(8);
    });
  });
});
