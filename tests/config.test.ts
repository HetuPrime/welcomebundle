import { jest } from '@jest/globals';
import { loadConfigFromEnv, replaceEnvVars } from '../src/core/config';

// Mock environment variables
const originalEnv = process.env;

describe('Config', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
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
      process.env.BABY_NAME = 'Emma';
      process.env.PARENT_EMAIL = 'test@example.com';
      
      const config = loadConfigFromEnv();
      
      expect(config.platforms).toBeDefined();
      expect(config.platforms.length).toBeGreaterThan(0);
      
      // Check default platforms
      const platformNames = config.platforms.map((p: any) => p.name);
      expect(platformNames).toContain('github');
      expect(platformNames).toContain('steam');
      expect(platformNames).toContain('epic_games');
    });

    it('should generate usernames from BABY_NAME', () => {
      process.env.BABY_NAME = 'Emma Smith';
      process.env.PARENT_EMAIL = 'test@example.com';
      
      const config = loadConfigFromEnv();
      
      config.platforms.forEach((platform: any) => {
        expect(platform.username).toBeDefined();
        expect(platform.username).not.toContain(' '); // Spaces should be removed
        expect(platform.email).toBe('test@example.com');
      });
    });

    it('should enable all platforms by default', () => {
      process.env.BABY_NAME = 'Emma';
      process.env.PARENT_EMAIL = 'test@example.com';
      
      const config = loadConfigFromEnv();
      
      config.platforms.forEach((platform: any) => {
        expect(platform.enabled).toBe(true);
      });
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
});
