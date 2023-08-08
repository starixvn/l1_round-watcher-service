import LastResultHandler from "../handlers/last-result-handler";
import RoundBaseGameWatcher, { registerRoundEvent } from "./round-base-game-watcher";
import WatcherEventHandler from "./watcher-event-handler";

const watcher: { [key: string]: RoundBaseGameWatcher } = {};

const addWatcher = (game: string, lastResultHandler: LastResultHandler) => {
  if (!watcher[game]) {
    const changeStream = registerRoundEvent(game, lastResultHandler);

    watcher[game] = changeStream;
  }
};

const removeWatcher = async (game: string) => {
  await watcher[game].closeChangeStream();
  delete watcher[game];
};

const removeAll = () => {
  Object.keys(watcher).forEach((key) => removeWatcher[key]);
};

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

export { addWatcher, removeAll, removeWatcher };

