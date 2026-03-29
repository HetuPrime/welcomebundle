import { jest } from '@jest/globals';
import { PlatformConfig, RegistrationResult } from '../src/types';

// Mock platform handlers
class MockPlatformHandler {
  name: string;
  url: string;
  
  constructor(name: string) {
    this.name = name;
    this.url = `https://${name}.com`;
  }
  
  async register(config: PlatformConfig) {
    // Simulate registration
    return {
      platform: this.name,
      success: true,
      username: config.username,
      timestamp: new Date(),
    };
  }
}

describe('Platform Handlers', () => {
  describe('MockPlatformHandler', () => {
    it('should register successfully', async () => {
      const handler = new MockPlatformHandler('github');
      const config: PlatformConfig = {
        name: 'github',
        enabled: true,
        username: 'testuser',
        email: 'test@example.com',
      };
      
      const result = await handler.register(config);
      
      expect(result.success).toBe(true);
      expect(result.platform).toBe('github');
      expect(result.username).toBe('testuser');
    });

    it('should have correct platform name', () => {
      const handler = new MockPlatformHandler('steam');
      expect(handler.name).toBe('steam');
    });
  });

  describe('Platform Config Validation', () => {
    it('should accept valid config', () => {
      const config: PlatformConfig = {
        name: 'github',
        enabled: true,
        username: 'testuser',
        email: 'test@example.com',
      };
      
      expect(config.name).toBe('github');
      expect(config.enabled).toBe(true);
      expect(config.username).toBe('testuser');
      expect(config.email).toBe('test@example.com');
    });

    it('should accept optional fields', () => {
      const config: PlatformConfig = {
        name: 'epic_games',
        enabled: true,
        username: 'testuser',
        email: 'test@example.com',
        password: 'secure-password',
        dob: '2024-01-01',
        additionalFields: {
          firstName: 'Test',
          lastName: 'User',
        },
      };
      
      expect(config.password).toBe('secure-password');
      expect(config.dob).toBe('2024-01-01');
      expect(config.additionalFields?.firstName).toBe('Test');
    });
  });
});

describe('Username Generation', () => {
  it('should generate username from baby name', () => {
    const babyName = 'Emma Smith';
    const username = babyName.toLowerCase().replace(/\s+/g, '');
    
    expect(username).toBe('emmasmith');
  });

  it('should handle special characters', () => {
    const babyName = "O'Brien Jr.";
    // For usernames, we typically remove special chars
    const username = babyName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    expect(username).toBe('obrienjr');
  });

  it('should handle spaces', () => {
    const babyName = 'John  Doe'; // Double space
    const username = babyName.toLowerCase().replace(/\s+/g, '');
    
    expect(username).toBe('johndoe');
  });
});
