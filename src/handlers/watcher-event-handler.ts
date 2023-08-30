import appConfigs from "../app-configs";
import authenticationHelper from "../helpers/authentication-helper";
import { GameRound } from "../models/game-rounds";
import RoundBaseGameWatcher, { WatcherEvent } from "../watchers/round-base-game-watcher";
import LastResultHandler from "./last-result-handler";

export default class WatcherEventHandler {
  private readonly lastResultHandler: LastResultHandler;
  constructor(lastResultHandler: LastResultHandler) {
    this.lastResultHandler = lastResultHandler;

    this.handleNewRoundEvent = this.handleNewRoundEvent.bind(this);
  }

  attachListeners(watcher: RoundBaseGameWatcher) {
    watcher.on(WatcherEvent.NEWROUND, this.handleNewRoundEvent);
  }

  async handleNewRoundEvent(newRound: { [key: string]: GameRound }) {
    const { notificationApiSettings } = appConfigs;

    this.lastResultHandler.update(newRound);
    console.log(newRound);
    await authenticationHelper.post(`${notificationApiSettings.url}/roundTimer`, newRound);
  }
}
