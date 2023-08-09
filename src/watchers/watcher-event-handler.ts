import appConfigs from "../app-configs";
import LastResultHandler from "../handlers/last-result-handler";
import authenticationHelper from "../helpers/authentication-helper";
import { GameRound } from "../models/game-rounds";
import RoundBaseGameWatcher, { WatcherEvent } from "./round-base-game-watcher";

export default class WatcherEventHandler {
  private readonly lastResultHandler: LastResultHandler;
  constructor(lastResultHandler: LastResultHandler) {
    this.lastResultHandler = lastResultHandler;
  }

  attachListeners(watcher: RoundBaseGameWatcher) {
    watcher.on(WatcherEvent.NEWROUND, async (newRound) => await this.handleNewRoundEvent(newRound));
    watcher.on(WatcherEvent.CLOSE, this.handleCloseEvent);
  }

  async handleNewRoundEvent(newRound: { [key: string]: GameRound }) {
    try {
      const { notificationApiSettings } = appConfigs;
      // it is a subcriber
      this.lastResultHandler.update(newRound);

      // then it is another subcriber
      await authenticationHelper.post(`${notificationApiSettings.url}/roundTimer`, newRound);
      // another subscriber
      // subscriber.onReceived(....)
    } catch (exception) {
      //TODO: log
    }
  }

  handleCloseEvent() {}
}
