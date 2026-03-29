export interface PlatformConfig {
  name: string;
  enabled: boolean;
  username: string;
  email: string;
  password?: string;
  dob?: string; // Date of birth for platforms that require it
  additionalFields?: Record<string, string>;
}

export interface RegistrationResult {
  platform: string;
  success: boolean;
  username?: string;
  error?: string;
  timestamp: Date;
  credentials?: {
    username: string;
    email: string;
    // Password is stored encrypted, not returned
  };
}

export interface BundleConfig {
  platforms: PlatformConfig[];
  webhook?: {
    enabled: boolean;
    url?: string;
  };
  notification?: {
    telegram?: {
      botToken: string;
      chatId: string;
    };
  };
}

export type PlatformName = 
  | 'github'
  | 'gitlab'
  | 'steam'
  | 'epic_games'
  | 'battlenet'
  | 'nintendo'
  | 'reddit'
  | 'medium'
  | 'discord'
  | 'playstation'
  | 'xbox';
