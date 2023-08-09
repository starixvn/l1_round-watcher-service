import LastResultHandler from "../handlers/last-result-handler";
import { GameConfig } from "../types";
import RoundBaseGameWatcher from "./round-base-game-watcher";
import WatcherEventHandler from "./watcher-event-handler";

export default class WatcherManager {
  private readonly watchers: { [key: string]: RoundBaseGameWatcher } = {};
  private readonly watcherEventHandler: WatcherEventHandler;
  private readonly lastResultHandler: LastResultHandler;

  constructor(watcherEventHandler: WatcherEventHandler, lastResultHandler: LastResultHandler) {
    this.watcherEventHandler = watcherEventHandler;
    this.lastResultHandler = lastResultHandler;
  }

  async updateWatchers(games: GameConfig[]) {
    const newGames = games.filter((game) => !this.watchers[game.id]);
    const removedGames = Object.keys(this.watchers).filter((gameId) => !games.find((game) => game.id === +gameId));

    await this.lastResultHandler.getLastResult(newGames);

    newGames.forEach((game) => {
      this.addWatcher(game);
    });
    removedGames.forEach((gameId) => {
      this.removeWatcher(gameId);
      this.lastResultHandler.remove(gameId);
    });
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
