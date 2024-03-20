import LastResultHandler from "../handlers/last-result-handler";
import PingPongHandler from "../handlers/pingpong-handler";
import StreakHandler from "../handlers/streak-handler";
import WatcherEventHandler from "../handlers/watcher-event-handler";
import { GameConfig } from "../types";
import RoundBaseGameWatcher from "./round-base-game-watcher";

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

    for (const newGame of newGames) {
      this.addWatcher(newGame);
    }

    for (const removedGame of removedGames) {
      this.removeWatcher(removedGame);
      this.lastResultHandler.remove(removedGame);
    }
  }

  addWatcher(game: GameConfig) {
    if (!this.watchers[game.id]) {
      const watcher = new RoundBaseGameWatcher(game);
      const streakHandler = new StreakHandler();
      const pingpongHandler = new PingPongHandler();

      this.watchers[game.id] = watcher;
      this.watcherEventHandler.attachListeners(watcher);
      this.watcherEventHandler.attachHandler(streakHandler);
      this.watcherEventHandler.attachHandler(pingpongHandler);
    }
  }

  async removeWatcher(gameId: string) {
    await this.watchers[gameId].closeChangeStream();
    delete this.watchers[gameId];
  }

  async removeAllWatchers() {
    await Promise.all(Object.keys(this.watchers).map((key) => this.removeWatcher(key)));
  }
}
