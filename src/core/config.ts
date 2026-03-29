import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import { BundleConfig, PlatformConfig } from './types';

export function loadConfig(configPath: string): BundleConfig {
  const fileContent = fs.readFileSync(configPath, 'utf-8');
  const rawConfig = yaml.parse(fileContent);
  
  // Replace environment variables
  const processedConfig = replaceEnvVars(rawConfig);
  
  return processedConfig as BundleConfig;
}

export function loadConfigFromEnv(): BundleConfig {
  const platforms: PlatformConfig[] = [];
  
  // Simple config from environment variables
  // For more complex setups, use config file
  const babyName = process.env.BABY_NAME;
  const parentEmail = process.env.PARENT_EMAIL;
  
  if (!babyName || !parentEmail) {
    throw new Error('BABY_NAME and PARENT_EMAIL environment variables are required');
  }

  // Default platforms
  const defaultPlatforms = [
    { name: 'github', username: babyName.toLowerCase().replace(/\s+/g, '') },
    { name: 'steam', username: `${babyName.toLowerCase().replace(/\s+/g, '')}_gaming` },
    { name: 'epic_games', username: babyName.toLowerCase().replace(/\s+/g, '') },
  ];

  for (const p of defaultPlatforms) {
    platforms.push({
      name: p.name,
      enabled: true,
      username: p.username,
      email: parentEmail,
    });
  }

  return { platforms };
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
