export { PlatformHandler } from './base';
export { GitHubHandler } from './github';
export { GitLabHandler } from './gitlab';
export { EpicGamesHandler } from './epic-games';
export { SteamHandler } from './steam';
export { RedditHandler } from './reddit';
export { NintendoHandler } from './nintendo';
export { BattleNetHandler } from './battlenet';
export { MediumHandler } from './medium';

import { PlatformHandler } from './base';
import { GitHubHandler } from './github';
import { GitLabHandler } from './gitlab';
import { EpicGamesHandler } from './epic-games';
import { SteamHandler } from './steam';
import { RedditHandler } from './reddit';
import { NintendoHandler } from './nintendo';
import { BattleNetHandler } from './battlenet';
import { MediumHandler } from './medium';
import { PlatformName } from '../types';

const handlers: Record<string, new () => PlatformHandler> = {
  github: GitHubHandler,
  gitlab: GitLabHandler,
  epic_games: EpicGamesHandler,
  steam: SteamHandler,
  reddit: RedditHandler,
  nintendo: NintendoHandler,
  battlenet: BattleNetHandler,
  medium: MediumHandler,
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
