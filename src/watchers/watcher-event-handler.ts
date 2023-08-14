import appConfigs from "../app-configs";
import LastResultHandler from "../handlers/last-result-handler";
import authenticationHelper from "../helpers/authentication-helper";
import { GameRound } from "../models/game-rounds";
import RoundBaseGameWatcher, { WatcherEvent } from "./round-base-game-watcher";

export default class WatcherEventHandler {
  private readonly lastResultHandler: LastResultHandler;
  constructor(lastResultHandler: LastResultHandler) {
    this.lastResultHandler = lastResultHandler;

    this.handleNewRoundEvent = this.handleNewRoundEvent.bind(this);
    this.handleCloseEvent = this.handleCloseEvent.bind(this);
  }

  attachListeners(watcher: RoundBaseGameWatcher) {
    watcher.on(WatcherEvent.NEWROUND, this.handleNewRoundEvent);
    watcher.on(WatcherEvent.CLOSE, this.handleCloseEvent);
  }

  async handleNewRoundEvent(newRound: { [key: string]: GameRound }) {
    const { notificationApiSettings } = appConfigs;
    
    this.lastResultHandler.update(newRound);
      await authenticationHelper.post(`${notificationApiSettings.url}/roundTimer`, newRound);
  }

  handleCloseEvent() {}
}
