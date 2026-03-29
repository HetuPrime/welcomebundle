// Jest setup file
import { jest } from '@jest/globals';

// Set test environment variables
process.env.BABY_NAME = 'TestBaby';
process.env.PARENT_EMAIL = 'test@example.com';
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-characters!';

// Mock console.log for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Increase timeout for slow tests
jest.setTimeout(30000);
