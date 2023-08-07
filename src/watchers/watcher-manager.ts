import appConfigs from "../app-configs";
import LastResultHandler from "../handlers/last-result-handler";
import authenticationHelper from "../helpers/authentication-helper";
import { GameRound } from "../models/game-rounds";
import RoundBaseGameWatcher, { WatcherEvent, registerRoundEvent } from "./game-round-watcher-handler";

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
  private watchers: { [key: string]: RoundBaseGameWatcher } = {};
  private readonly lastResultHandler: LastResultHandler;

  constructor(lastResultHandler: LastResultHandler) {
    this.lastResultHandler = lastResultHandler;
  }

  attachListeners(game: string) {
    this.watchers[game].on(WatcherEvent.NEWROUND, async (newRound) => await this.handleNewRoundEvent(newRound));
    this.watchers[game].on(WatcherEvent.CLOSE, this.handleCloseEvent);
  }

  async handleNewRoundEvent(newRound: GameRound) {
    try {
      const { notificationApiSettings } = appConfigs;
      // it is a subcriber
      this.lastResultHandler.update(newRound);

      // then it is another subcriber
      await authenticationHelper.post(`${notificationApiSettings.url}/miniCounter`, newRound);
      // another subscriber
      // subscriber.onReceived(....)
    } catch (exception) {
      //TODO: log
    }
  }

  handleCloseEvent() {}

  addWatcher(game: string) {
    if (!this.watchers[game]) {
      const watcher = new RoundBaseGameWatcher(game);

      this.watchers[game] = watcher;
      this.attachListeners(game);
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

