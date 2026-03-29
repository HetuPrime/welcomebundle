export { PlatformHandler } from './base';
export { GitHubHandler } from './github';
export { EpicGamesHandler } from './epic-games';
export { SteamHandler } from './steam';

import { PlatformHandler } from './base';
import { GitHubHandler } from './github';
import { EpicGamesHandler } from './epic-games';
import { SteamHandler } from './steam';
import { PlatformName } from '../types';

const handlers: Record<string, new () => PlatformHandler> = {
  github: GitHubHandler,
  epic_games: EpicGamesHandler,
  steam: SteamHandler,
};

export function getHandler(platformName: PlatformName): PlatformHandler | null {
  const HandlerClass = handlers[platformName];
  if (!HandlerClass) {
    return null;
  }
  return new HandlerClass();
}

export function getSupportedPlatforms(): PlatformName[] {
  return Object.keys(handlers) as PlatformName[];
}
