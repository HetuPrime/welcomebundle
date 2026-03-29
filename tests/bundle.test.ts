import { jest } from '@jest/globals';
import { WelcomeBundle } from '../src/core/bundle';
import { loadConfigFromEnv } from '../src/core/config';

// Mock playwright
jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn().mockResolvedValue({
      newContext: jest.fn().mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          waitForLoadState: jest.fn(),
          waitForSelector: jest.fn(),
          fill: jest.fn(),
          click: jest.fn(),
          close: jest.fn(),
        }),
        close: jest.fn(),
      }),
      close: jest.fn(),
    }),
  },
}));

describe('WelcomeBundle', () => {
  beforeEach(() => {
    process.env.BABY_NAME = 'Emma';
    process.env.PARENT_EMAIL = 'test@example.com';
    process.env.ENCRYPTION_KEY = 'test-key-32-characters-long!!!!';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSupportedPlatforms', () => {
    it('should return list of supported platforms', () => {
      const platforms = WelcomeBundle.getSupportedPlatforms();
      
      expect(platforms).toContain('github');
      expect(platforms).toContain('steam');
      expect(platforms).toContain('epic_games');
      expect(platforms.length).toBeGreaterThan(0);
    });
  });

  describe('constructor', () => {
    it('should create instance with config', () => {
      const config = loadConfigFromEnv();
      const bundle = new WelcomeBundle(config);
      
      expect(bundle).toBeDefined();
    });
  });

  // Note: Full integration tests would require real browser
  // These are unit tests for core logic

  describe('config loading', () => {
    it('should load platforms from env', () => {
      const config = loadConfigFromEnv();
      
      expect(config.platforms).toBeDefined();
      expect(config.platforms.length).toBeGreaterThan(0);
    });

    it('should set all platforms as enabled by default', () => {
      const config = loadConfigFromEnv();
      
      const enabledCount = config.platforms.filter((p: any) => p.enabled).length;
      expect(enabledCount).toBe(config.platforms.length);
    });
  });
});
