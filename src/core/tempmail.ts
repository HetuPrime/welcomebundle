/**
 * TempMail Service
 * 
 * Integrates with temporary email services to automatically receive verification codes.
 * Supports multiple providers for redundancy.
 */

export interface EmailMessage {
  from: string;
  subject: string;
  body: string;
  html?: string;
  receivedAt: Date;
}

export interface TempMailProvider {
  name: string;
  createEmail(): Promise<{ email: string; inboxId: string }>;
  waitForEmail(inboxId: string, timeout?: number): Promise<EmailMessage | null>;
  getInbox(inboxId: string): Promise<EmailMessage[]>;
}

/**
 * Mail.tm Provider
 * Free temporary email service with API
 */
export class MailTmProvider implements TempMailProvider {
  name = 'mail.tm';
  private baseUrl = 'https://api.mail.tm';

  async createEmail(): Promise<{ email: string; inboxId: string }> {
    // Get available domains
    const domainsRes = await fetch(`${this.baseUrl}/domains`);
    const domainsData = await domainsRes.json() as any;
    const domain = domainsData['hydra:member'][0]?.domain;

    if (!domain) {
      throw new Error('No available domain from mail.tm');
    }

    // Generate random username
    const username = `baby_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const email = `${username}@${domain}`;
    const password = this.generatePassword();

    // Create account
    const createRes = await fetch(`${this.baseUrl}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: email, password }),
    });

    if (!createRes.ok) {
      throw new Error(`Failed to create email: ${createRes.statusText}`);
    }

    const accountData = await createRes.json() as any;
    const accountId = accountData.id;

    // Get token for inbox access
    const tokenRes = await fetch(`${this.baseUrl}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: email, password }),
    });

    const tokenData = await tokenRes.json() as any;
    
    // Store token for later use
    (this as any)[`token_${accountId}`] = tokenData.token;

    return { email, inboxId: accountId };
  }

  async waitForEmail(inboxId: string, timeout = 60000): Promise<EmailMessage | null> {
    const token = (this as any)[`token_${inboxId}`];
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const messages = await this.getInbox(inboxId);
      if (messages.length > 0) {
        return messages[0];
      }
      await this.delay(3000); // Check every 3 seconds
    }

    return null;
  }

  async getInbox(inboxId: string): Promise<EmailMessage[]> {
    const token = (this as any)[`token_${inboxId}`];
    
    const res = await fetch(`${this.baseUrl}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json() as any;
    const messages = data['hydra:member'] || [];

    return messages.map((msg: any) => ({
      from: msg.from?.address || 'unknown',
      subject: msg.subject,
      body: msg.intro || '',
      html: msg.html?.[0] || '',
      receivedAt: new Date(msg.createdAt),
    }));
  }

  private generatePassword(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * TempMail Service
 * Manages temporary email for verification
 */
export class TempMailService {
  private provider: TempMailProvider;
  private activeInboxes: Map<string, { email: string; inboxId: string }> = new Map();

  constructor(provider?: TempMailProvider) {
    this.provider = provider || new MailTmProvider();
  }

  /**
   * Create a new temporary email
   */
  async createTempEmail(platform: string): Promise<string> {
    const { email, inboxId } = await this.provider.createEmail();
    this.activeInboxes.set(platform, { email, inboxId });
    console.log(`📧 Created temp email for ${platform}: ${email}`);
    return email;
  }

  /**
   * Wait for verification email and extract verification link/code
   */
  async waitForVerificationEmail(
    platform: string,
    timeout = 120000
  ): Promise<{ link?: string; code?: string; email: EmailMessage } | null> {
    const inbox = this.activeInboxes.get(platform);
    if (!inbox) {
      throw new Error(`No active inbox for platform: ${platform}`);
    }

    console.log(`📬 Waiting for verification email from ${platform}...`);
    const email = await this.provider.waitForEmail(inbox.inboxId, timeout);

    if (!email) {
      console.log(`⏱️ Timeout waiting for email from ${platform}`);
      return null;
    }

    console.log(`✅ Received email: ${email.subject}`);

    // Extract verification link
    const linkMatch = email.html?.match(/href=["']([^"']*(?:verify|confirm|activate|click)[^"']*)["']/i);
    const link = linkMatch?.[1];

    // Extract verification code (6 digits or alphanumeric)
    const codeMatch = email.body.match(/(?:code|验证码| código)[:\s]*([A-Z0-9]{4,8})/i);
    const code = codeMatch?.[1];

    return { link, code, email };
  }

  /**
   * Get all active temp emails
   */
  getActiveEmails(): Map<string, { email: string; inboxId: string }> {
    return this.activeInboxes;
  }
}
