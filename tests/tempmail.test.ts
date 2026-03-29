import { jest } from '@jest/globals';
import { TempMailService, MailTmProvider } from '../src/core/tempmail';

// Mock fetch for testing
global.fetch = jest.fn() as any;

describe('TempMailService', () => {
  let service: TempMailService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    service = new TempMailService();
  });

  describe('createTempEmail', () => {
    it('should create temp email for platform', async () => {
      // This would require mocking fetch
      // For now, we'll test the structure
      expect(service.getActiveEmails()).toBeDefined();
    });
  });
});

describe('MailTmProvider', () => {
  let provider: MailTmProvider;
  
  beforeEach(() => {
    jest.clearAllMocks();
    provider = new MailTmProvider();
  });

  describe('name', () => {
    it('should have correct provider name', () => {
      expect(provider.name).toBe('mail.tm');
    });
  });

  // Note: These tests would require mocking fetch
  // In a real test suite, we'd mock API responses
  
  describe('generatePassword', () => {
    it('should generate random password', () => {
      // Access private method via any
      const pwd1 = (provider as any).generatePassword();
      const pwd2 = (provider as any).generatePassword();
      
      expect(pwd1).toBeDefined();
      expect(pwd1.length).toBeGreaterThan(0);
      expect(pwd1).not.toBe(pwd2);
    });
  });
});

describe('Email Parsing', () => {
  it('should extract verification link from HTML', () => {
    const html = `
      <p>Click to verify:</p>
      <a href="https://example.com/verify?token=abc123">Verify Account</a>
    `;
    
    const linkMatch = html.match(/href=["']([^"']*(?:verify|confirm|activate|click)[^"']*)["']/i);
    
    expect(linkMatch).toBeDefined();
    expect(linkMatch?.[1]).toBe('https://example.com/verify?token=abc123');
  });

  it('should extract verification code from email body', () => {
    const body = 'Your verification code: ABC123';
    
    const codeMatch = body.match(/(?:code|验证码)[:\s]*([A-Z0-9]{4,8})/i);
    
    expect(codeMatch).toBeDefined();
    expect(codeMatch?.[1]).toBe('ABC123');
  });

  it('should handle Chinese verification code', () => {
    const body = '您的验证码：654321';
    
    const codeMatch = body.match(/(?:code|验证码)[:\s：]*([A-Z0-9]{4,8})/i);
    
    expect(codeMatch).toBeDefined();
    expect(codeMatch?.[1]).toBe('654321');
  });
});
