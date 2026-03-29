/**
 * 时间胶囊
 * 加密封存父母的信、视频，设定解锁日期
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { encrypt, decrypt } from './crypto';

export interface CapsuleContent {
  type: 'letter' | 'video' | 'image' | 'audio';
  content: string | Buffer;
  createdAt: Date;
  description?: string;
}

export interface Capsule {
  id: string;
  babyName: string;
  createdAt: Date;
  unlockAt: Date;
  contents: CapsuleContent[];
  metadata: {
    weather?: string;
    news?: string[];
    bitcoinPrice?: number;
  };
}

export interface CapsuleConfig {
  babyName: string;
  unlockYears?: number; // Default: 18 years
  unlockDate?: Date;
}

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;

export class TimeCapsule {
  private dataDir: string;
  private encryptionKey: string;

  constructor(encryptionKey: string, dataDir?: string) {
    this.encryptionKey = encryptionKey;
    this.dataDir = dataDir || path.join(process.cwd(), 'output', 'capsules');
    
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  /**
   * 创建时间胶囊
   */
  async create(config: CapsuleConfig): Promise<Capsule> {
    const id = this.generateId();
    const unlockAt = config.unlockDate || new Date(
      Date.now() + (config.unlockYears || 18) * 365 * 24 * 60 * 60 * 1000
    );

    const capsule: Capsule = {
      id,
      babyName: config.babyName,
      createdAt: new Date(),
      unlockAt,
      contents: [],
      metadata: {},
    };

    // Save capsule metadata
    await this.saveCapsule(capsule);

    console.log(`💌 时间胶囊已创建`);
    console.log(`   ID: ${id}`);
    console.log(`   解锁日期: ${unlockAt.toLocaleDateString('zh-CN')}`);

    return capsule;
  }

  /**
   * 添加信件
   */
  async addLetter(capsuleId: string, letter: string, description?: string): Promise<void> {
    const capsule = await this.loadCapsule(capsuleId);
    
    capsule.contents.push({
      type: 'letter',
      content: letter,
      createdAt: new Date(),
      description,
    });

    await this.saveCapsule(capsule);
    console.log(`✅ 信件已添加到胶囊 ${capsuleId}`);
  }

  /**
   * 添加媒体文件（视频/图片/音频）
   */
  async addMedia(capsuleId: string, filePath: string, type: 'video' | 'image' | 'audio', description?: string): Promise<void> {
    const capsule = await this.loadCapsule(capsuleId);
    
    // Read and encrypt file
    const fileContent = fs.readFileSync(filePath);
    const encrypted = this.encryptBuffer(fileContent);

    // Save encrypted file
    const encryptedPath = path.join(this.dataDir, `${capsuleId}_${Date.now()}.enc`);
    fs.writeFileSync(encryptedPath, encrypted);

    capsule.contents.push({
      type,
      content: encryptedPath, // Store path instead of content
      createdAt: new Date(),
      description,
    });

    await this.saveCapsule(capsule);
    console.log(`✅ ${type} 已添加到胶囊 ${capsuleId}`);
  }

  /**
   * 添加元数据（天气、新闻等）
   */
  async addMetadata(capsuleId: string, metadata: Partial<Capsule['metadata']>): Promise<void> {
    const capsule = await this.loadCapsule(capsuleId);
    capsule.metadata = { ...capsule.metadata, ...metadata };
    await this.saveCapsule(capsule);
  }

  /**
   * 检查是否可以解锁
   */
  canUnlock(capsuleId: string): boolean {
    const metadataPath = path.join(this.dataDir, `${capsuleId}.json`);
    if (!fs.existsSync(metadataPath)) {
      return false;
    }

    const capsule = JSON.parse(fs.readFileSync(metadataPath, 'utf-8')) as Capsule;
    return new Date() >= new Date(capsule.unlockAt);
  }

  /**
   * 解锁时间胶囊
   */
  async unlock(capsuleId: string): Promise<Capsule | null> {
    if (!this.canUnlock(capsuleId)) {
      const capsule = await this.loadCapsule(capsuleId);
      console.log(`🔒 时间胶囊尚未解锁`);
      console.log(`   解锁日期: ${capsule.unlockAt.toLocaleDateString('zh-CN')}`);
      return null;
    }

    const capsule = await this.loadCapsule(capsuleId);
    console.log(`🎉 时间胶囊已解锁！`);
    console.log(`   创建于: ${capsule.createdAt.toLocaleDateString('zh-CN')}`);
    console.log(`   内容数量: ${capsule.contents.length}`);

    // Decrypt content
    for (const content of capsule.contents) {
      if (typeof content.content === 'string' && content.content.endsWith('.enc')) {
        const encrypted = fs.readFileSync(content.content);
        content.content = this.decryptBuffer(encrypted);
      }
    }

    return capsule;
  }

  /**
   * 获取所有胶囊
   */
  async listCapsules(): Promise<Array<{ id: string; babyName: string; unlockAt: Date; contentCount: number }>> {
    const files = fs.readdirSync(this.dataDir).filter(f => f.endsWith('.json'));
    
    return files.map(file => {
      const capsule = JSON.parse(fs.readFileSync(path.join(this.dataDir, file), 'utf-8')) as Capsule;
      return {
        id: capsule.id,
        babyName: capsule.babyName,
        unlockAt: new Date(capsule.unlockAt),
        contentCount: capsule.contents.length,
      };
    });
  }

  private async saveCapsule(capsule: Capsule): Promise<void> {
    const metadataPath = path.join(this.dataDir, `${capsule.id}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(capsule, null, 2));
  }

  private async loadCapsule(capsuleId: string): Promise<Capsule> {
    const metadataPath = path.join(this.dataDir, `${capsuleId}.json`);
    return JSON.parse(fs.readFileSync(metadataPath, 'utf-8')) as Capsule;
  }

  private generateId(): string {
    return `capsule_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  }

  private encryptBuffer(buffer: Buffer): Buffer {
    const key = crypto.createHash('sha256').update(this.encryptionKey).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const authTag = cipher.getAuthTag();
    
    return Buffer.concat([iv, authTag, encrypted]);
  }

  private decryptBuffer(buffer: Buffer): Buffer {
    const key = crypto.createHash('sha256').update(this.encryptionKey).digest();
    
    const iv = buffer.subarray(0, 16);
    const authTag = buffer.subarray(16, 32);
    const encrypted = buffer.subarray(32);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  }
}
