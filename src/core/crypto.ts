import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;

export function encrypt(text: string, secretKey: string): string {
  const key = deriveKey(secretKey);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string, secretKey: string): string {
  const key = deriveKey(secretKey);
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
  
  if (!ivHex || !authTagHex || !encrypted) {
    throw new Error('Invalid encrypted text format');
  }
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

function deriveKey(secretKey: string): Buffer {
  return crypto.createHash('sha256').update(secretKey).digest();
}

export function saveCredentials(platform: string, credentials: any, secretKey: string): void {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const encrypted = encrypt(JSON.stringify(credentials), secretKey);
  const filePath = path.join(dataDir, `${platform}.enc`);
  
  fs.writeFileSync(filePath, encrypted, 'utf8');
}

export function loadCredentials(platform: string, secretKey: string): any {
  const filePath = path.join(process.cwd(), 'data', `${platform}.enc`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const encrypted = fs.readFileSync(filePath, 'utf8');
  const decrypted = decrypt(encrypted, secretKey);
  
  return JSON.parse(decrypted);
}
