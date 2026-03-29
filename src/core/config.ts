import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import { BundleConfig, PlatformConfig, PlatformName } from '../types';

// All supported platforms with their default configurations
const DEFAULT_PLATFORMS: Record<string, Omit<PlatformConfig, 'enabled'>> = {
  github: {
    name: 'github',
    username: '', // Will be set from BABY_NAME
    email: '', // Will be set from PARENT_EMAIL
  },
  gitlab: {
    name: 'gitlab',
    username: '',
    email: '',
  },
  steam: {
    name: 'steam',
    username: '', // Will be appended with _gaming
    email: '',
  },
  epic_games: {
    name: 'epic_games',
    username: '',
    email: '',
    dob: '', // Will be set from BABY_DOB
    additionalFields: {
      firstName: 'Baby',
      lastName: '', // Will be set from LAST_NAME
    },
  },
  battlenet: {
    name: 'battlenet',
    username: '',
    email: '',
    dob: '',
    additionalFields: {
      firstName: 'Baby',
      lastName: '',
    },
  },
  nintendo: {
    name: 'nintendo',
    username: '',
    email: '',
    dob: '',
  },
  reddit: {
    name: 'reddit',
    username: '',
    email: '',
  },
  medium: {
    name: 'medium',
    username: '',
    email: '',
  },
};

export function loadConfig(configPath: string): BundleConfig {
  const fileContent = fs.readFileSync(configPath, 'utf-8');
  const rawConfig = yaml.parse(fileContent);
  
  // Replace environment variables
  const processedConfig = replaceEnvVars(rawConfig);
  
  return processedConfig as BundleConfig;
}

export function loadConfigFromEnv(): BundleConfig {
  const platforms: PlatformConfig[] = [];
  
  const babyName = process.env.BABY_NAME;
  const parentEmail = process.env.PARENT_EMAIL;
  
  if (!babyName || !parentEmail) {
    throw new Error('BABY_NAME and PARENT_EMAIL environment variables are required');
  }

  const lastName = process.env.LAST_NAME || '';
  const babyDob = process.env.BABY_DOB || '';
  const usernameBase = babyName.toLowerCase().replace(/\s+/g, '');

  // Determine which platforms to enable
  const enabledPlatforms = getEnabledPlatforms();

  // Create platform configs
  for (const platformKey of enabledPlatforms) {
    const defaultConfig = DEFAULT_PLATFORMS[platformKey];
    if (!defaultConfig) {
      console.warn(`Warning: Unknown platform "${platformKey}", skipping`);
      continue;
    }

    const config: PlatformConfig = {
      ...defaultConfig,
      enabled: true,
      username: platformKey === 'steam' ? `${usernameBase}_gaming` : usernameBase,
      email: parentEmail,
    };

    // Add DOB if available
    if (babyDob && config.dob !== undefined) {
      config.dob = babyDob;
    }

    // Add last name if available
    if (lastName && config.additionalFields?.lastName !== undefined) {
      config.additionalFields.lastName = lastName;
    }

    platforms.push(config);
  }

  if (platforms.length === 0) {
    throw new Error('No platforms enabled. Set ENABLED_PLATFORMS or disable DISABLED_PLATFORMS');
  }

  return { platforms };
}

/**
 * Get list of enabled platforms based on environment variables
 * 
 * Priority:
 * 1. If ENABLED_PLATFORMS is set, use that list
 * 2. If DISABLED_PLATFORMS is set, exclude those from all platforms
 * 3. Default: github, steam, epic_games
 */
function getEnabledPlatforms(): string[] {
  const allPlatforms = Object.keys(DEFAULT_PLATFORMS);

  // If ENABLED_PLATFORMS is set, use that
  if (process.env.ENABLED_PLATFORMS) {
    const enabled = process.env.ENABLED_PLATFORMS
      .split(',')
      .map(p => p.trim().toLowerCase())
      .filter(p => allPlatforms.includes(p));
    
    return enabled;
  }

  // If DISABLED_PLATFORMS is set, exclude those
  if (process.env.DISABLED_PLATFORMS) {
    const disabled = process.env.DISABLED_PLATFORMS
      .split(',')
      .map(p => p.trim().toLowerCase());
    
    return allPlatforms.filter(p => !disabled.includes(p));
  }

  // Default: github, steam, epic_games
  return ['github', 'steam', 'epic_games'];
}

export function replaceEnvVars(obj: any): any {
  if (typeof obj === 'string') {
    // Replace ${VAR_NAME} with process.env.VAR_NAME
    return obj.replace(/\$\{([^}]+)\}/g, (_, varName) => {
      const value = process.env[varName];
      if (!value) {
        console.warn(`Warning: Environment variable ${varName} is not set`);
        return '';
      }
      return value;
    });
  }
  
  if (Array.isArray(obj)) {
    return obj.map(replaceEnvVars);
  }
  
  if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replaceEnvVars(value);
    }
    return result;
  }
  
  return obj;
}

/**
 * Get all supported platform names
 */
export function getAllPlatforms(): string[] {
  return Object.keys(DEFAULT_PLATFORMS);
}
