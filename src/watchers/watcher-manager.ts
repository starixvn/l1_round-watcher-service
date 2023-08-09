import { GameConfig } from "../types";
import RoundBaseGameWatcher from "./round-base-game-watcher";
import WatcherEventHandler from "./watcher-event-handler";

export default class WatcherManager {
  private readonly watchers: { [key: string]: RoundBaseGameWatcher } = {};
  private readonly watcherEventHandler: WatcherEventHandler;

  constructor(watcherEventHandler: WatcherEventHandler) {
    this.watcherEventHandler = watcherEventHandler;
  }

  addWatcher(game: GameConfig) {
    if (!this.watchers[game.id]) {
      const watcher = new RoundBaseGameWatcher(game);

      this.watchers[game.id] = watcher;
      this.watcherEventHandler.attachListeners(watcher);
    }
  }

  async removeWatcher(gameId: string) {
    await this.watchers[gameId].closeChangeStream();
    delete this.watchers[gameId];
  }

  async removeAllWatchers() {
    await Promise.all(Object.keys(this.watchers).map((key) => this.removeWatcher[key]));
  }
}
