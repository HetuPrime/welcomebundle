/**
 * IMAP Email Service
 * 
 * Connects to user's email inbox via IMAP to retrieve verification emails.
 * Supports Gmail, Outlook, and custom IMAP servers.
 */

import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

export interface ImapConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
}

export interface EmailMessage {
  from: string;
  subject: string;
  body: string;
  html?: string;
  receivedAt: Date;
}

export interface VerificationEmail {
  link?: string;
  code?: string;
  from: string;
  subject: string;
}

const IMAP_PROVIDERS: Record<string, ImapConfig> = {
  gmail: {
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    user: '', // Will be set by user
    password: '', // App password
  },
  outlook: {
    host: 'outlook.office365.com',
    port: 993,
    secure: true,
    user: '',
    password: '',
  },
  yahoo: {
    host: 'imap.mail.yahoo.com',
    port: 993,
    secure: true,
    user: '',
    password: '',
  },
};

export class ImapEmailService {
  private config: ImapConfig;
  private client: ImapFlow | null = null;

  constructor(config: ImapConfig | { provider: string; user: string; password: string }) {
    if ('provider' in config) {
      const providerConfig = IMAP_PROVIDERS[config.provider];
      if (!providerConfig) {
        throw new Error(`Unknown provider: ${config.provider}. Use 'gmail', 'outlook', 'yahoo', or provide full IMAP config.`);
      }
      this.config = {
        ...providerConfig,
        user: config.user,
        password: config.password,
      };
    } else {
      this.config = config;
    }
  }

  /**
   * Connect to IMAP server
   */
  async connect(): Promise<void> {
    this.client = new ImapFlow({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.user,
        pass: this.config.password,
      },
      logger: false,
    });

    await this.client.connect();
    console.log(`📧 Connected to ${this.config.host}`);
  }

  /**
   * Disconnect from IMAP server
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.logout();
      this.client = null;
    }
  }

  /**
   * Wait for verification email from a specific sender
   */
  async waitForVerificationEmail(
    fromDomain: string,
    timeout = 120000,
    pollInterval = 5000
  ): Promise<VerificationEmail | null> {
    if (!this.client) {
      throw new Error('Not connected. Call connect() first.');
    }

    const startTime = Date.now();
    console.log(`📬 Waiting for verification email from ${fromDomain}...`);

    while (Date.now() - startTime < timeout) {
      try {
        const email = await this.findLatestEmail(fromDomain);
        if (email) {
          const verification = this.extractVerification(email);
          if (verification.link || verification.code) {
            return verification;
          }
        }
      } catch (error) {
        console.error('Error checking email:', error);
      }

      await this.delay(pollInterval);
    }

    console.log(`⏱️ Timeout waiting for email from ${fromDomain}`);
    return null;
  }

  /**
   * Find the latest email from a domain
   */
  private async findLatestEmail(fromDomain: string): Promise<EmailMessage | null> {
    if (!this.client) return null;

    await this.client.mailboxOpen('INBOX');

    const messages = [];
    for await (const message of this.client.fetch('1:*', { envelope: true, source: true })) {
      const from = message.envelope?.from?.[0]?.address || '';
      if (from.toLowerCase().includes(fromDomain.toLowerCase())) {
        const parsed = await simpleParser(message.source);
        messages.push({
          from,
          subject: message.envelope?.subject || '',
          body: parsed.text || '',
          html: parsed.html || undefined,
          receivedAt: message.envelope?.date || new Date(),
        });
      }
    }

    // Return the most recent
    if (messages.length > 0) {
      return messages.sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime())[0];
    }

    return null;
  }

  /**
   * Extract verification link/code from email
   */
  private extractVerification(email: EmailMessage): VerificationEmail {
    let link: string | undefined;
    let code: string | undefined;

    // Extract verification link
    const linkPatterns = [
      /href=["']([^"']*(?:verify|confirm|activate|click|validate)[^"']*)["']/gi,
      /(https?:\/\/[^\s<>"']*(?:verify|confirm|activate|click|validate)[^\s<>"']*)/gi,
    ];

    for (const pattern of linkPatterns) {
      const matches = email.html?.match(pattern) || email.body.match(pattern);
      if (matches && matches.length > 0) {
        // Clean up the link
        link = matches[0]
          .replace(/href=["']/gi, '')
          .replace(/["']$/g, '')
          .replace(/&amp;/g, '&');
        break;
      }
    }

    // Extract verification code (6-8 digits or alphanumeric)
    const codePatterns = [
      /(?:code|验证码|código|code)[:\s：]*([A-Z0-9]{4,8})/i,
      /\b([A-Z0-9]{6})\b/g,
    ];

    for (const pattern of codePatterns) {
      const match = email.body.match(pattern) || email.html?.match(pattern);
      if (match && match[1]) {
        code = match[1];
        break;
      }
    }

    return {
      link,
      code,
      from: email.from,
      subject: email.subject,
    };
  }

  /**
   * Auto-click verification link
   */
  async autoVerify(link: string): Promise<boolean> {
    try {
      console.log(`🔗 Auto-clicking verification link...`);
      const response = await fetch(link, {
        method: 'GET',
        redirect: 'follow',
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to auto-verify:', error);
      return false;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Gmail App Password Setup Helper
 */
export const GMAIL_APP_PASSWORD_INSTRUCTIONS = `
To use Gmail IMAP, you need to create an App Password:

1. Go to https://myaccount.google.com/apppasswords
2. Sign in to your Google Account
3. Select "Mail" for the app
4. Select "Other" for the device and name it "WelcomeBundle"
5. Google will generate a 16-character password
6. Use this password (not your regular Gmail password) in the config

Example:
  EMAIL_PROVIDER=gmail
  EMAIL_USER=yourname@gmail.com
  EMAIL_PASSWORD=abcd efgh ijkl mnop  (the app password)
`;
