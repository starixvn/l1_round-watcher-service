import RoundBaseGameWatcher from "./round-base-game-watcher";
import WatcherEventHandler from "./watcher-event-handler";

export default class WatcherManager {
  private readonly watchers: { [key: string]: RoundBaseGameWatcher } = {};
  private readonly watcherEventHandler: WatcherEventHandler;

  constructor(watcherEventHandler: WatcherEventHandler) {
    this.watcherEventHandler = watcherEventHandler;
  }

  addWatcher(game: string) {
    if (!this.watchers[game]) {
      const watcher = new RoundBaseGameWatcher(game);

      this.watchers[game] = watcher;
      this.watcherEventHandler.attachListeners(watcher);
    }
  }

  async removeWatcher(game: string) {
    await this.watchers[game].closeChangeStream();
    delete this.watchers[game];
  }

  async removeAllWatchers() {
    await Promise.all(Object.keys(this.watchers).map((key) => this.removeWatcher[key]));
  }
}
