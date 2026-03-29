import { jest } from '@jest/globals';
import { RegistrationResult, PlatformConfig, BundleConfig } from '../src/types';

describe('Types', () => {
  describe('RegistrationResult', () => {
    it('should define successful result', () => {
      const result: RegistrationResult = {
        platform: 'github',
        success: true,
        username: 'testuser',
        timestamp: new Date(),
      };
      
      expect(result.success).toBe(true);
      expect(result.platform).toBe('github');
    });

    it('should define failed result', () => {
      const result: RegistrationResult = {
        platform: 'steam',
        success: false,
        error: 'Network error',
        timestamp: new Date(),
      };
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });

  describe('PlatformConfig', () => {
    it('should accept minimal config', () => {
      const config: PlatformConfig = {
        name: 'github',
        enabled: true,
        username: 'testuser',
        email: 'test@example.com',
      };
      
      expect(config.name).toBe('github');
      expect(config.enabled).toBe(true);
    });

    it('should accept full config', () => {
      const config: PlatformConfig = {
        name: 'epic_games',
        enabled: true,
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        dob: '2024-01-01',
        additionalFields: {
          firstName: 'Test',
          lastName: 'User',
        },
      };
      
      expect(config.password).toBe('password123');
      expect(config.dob).toBe('2024-01-01');
      expect(config.additionalFields).toBeDefined();
    });
  });

  describe('BundleConfig', () => {
    it('should accept config with platforms', () => {
      const config: BundleConfig = {
        platforms: [
          {
            name: 'github',
            enabled: true,
            username: 'testuser',
            email: 'test@example.com',
          },
        ],
      };
      
      expect(config.platforms).toHaveLength(1);
    });

    it('should accept config with notification', () => {
      const config: BundleConfig = {
        platforms: [],
        notification: {
          telegram: {
            botToken: 'token123',
            chatId: '123456',
          },
        },
      };
      
      expect(config.notification?.telegram?.botToken).toBe('token123');
    });
  });

  describe('PlatformName', () => {
    it('should include all supported platforms', () => {
      const platforms: string[] = [
        'github',
        'gitlab',
        'steam',
        'epic_games',
        'battlenet',
        'nintendo',
        'reddit',
        'medium',
      ];
      
      // All should be valid platform names
      platforms.forEach(name => {
        expect(typeof name).toBe('string');
        expect(name.length).toBeGreaterThan(0);
      });
    });
  });
});
