import { jest } from '@jest/globals';
import { encrypt, decrypt } from '../src/core/crypto';

describe('Crypto', () => {
  const testKey = 'test-encryption-key-32-characters!';

  describe('encrypt', () => {
    it('should encrypt a string', () => {
      const plaintext = 'my-secret-password';
      const encrypted = encrypt(plaintext, testKey);
      
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(plaintext);
      expect(encrypted).toContain(':'); // Should have IV:authTag:ciphertext format
    });

    it('should produce different ciphertext for same input', () => {
      const plaintext = 'my-secret-password';
      const encrypted1 = encrypt(plaintext, testKey);
      const encrypted2 = encrypt(plaintext, testKey);
      
      expect(encrypted1).not.toBe(encrypted2); // Different due to random IV
    });
  });

  describe('decrypt', () => {
    it('should decrypt an encrypted string', () => {
      const plaintext = 'my-secret-password';
      const encrypted = encrypt(plaintext, testKey);
      const decrypted = decrypt(encrypted, testKey);
      
      expect(decrypted).toBe(plaintext);
    });

    it('should throw error for invalid format', () => {
      expect(() => decrypt('invalid-format', testKey)).toThrow();
    });

    it('should throw error for wrong key', () => {
      const plaintext = 'my-secret-password';
      const encrypted = encrypt(plaintext, testKey);
      
      expect(() => decrypt(encrypted, 'wrong-key-32-characters-long!')).toThrow();
    });
  });

  describe('round-trip', () => {
    it('should handle various data types', () => {
      const testCases = [
        'simple string',
        'string with numbers 12345',
        '特殊字符 !@#$%^&*()',
        '{"json": "data", "number": 42}',
        'a'.repeat(1000), // long string
      ];

      testCases.forEach(data => {
        const encrypted = encrypt(data, testKey);
        const decrypted = decrypt(encrypted, testKey);
        expect(decrypted).toBe(data);
      });
    });
  });
});
