import appConfigs from "../app-configs";
import authenticationHelper from "../helpers/authentication-helper";
import { GameRound } from "../models/game-rounds";
import RoundBaseGameWatcher, { WatcherEvent } from "../watchers/round-base-game-watcher";
import LastResultHandler from "./last-result-handler";
import { ResultHandler } from "./streak-handler";

export default class WatcherEventHandler {
  private readonly lastResultHandler: LastResultHandler;

  private readonly resultHandlers: ResultHandler[] = [];

  constructor(lastResultHandler: LastResultHandler) {
    this.lastResultHandler = lastResultHandler;

    this.handleNewRoundEvent = this.handleNewRoundEvent.bind(this);
  }

  attachListeners(watcher: RoundBaseGameWatcher) {
    watcher.on(WatcherEvent.NEWROUND, this.handleNewRoundEvent);
  }

  attachHandler(handler: ResultHandler) {
    this.resultHandlers.push(handler);
  }

  async handleNewRoundEvent(newRound: { [key: string]: GameRound }) {
    this.lastResultHandler.update(newRound);

    for (const handler of this.resultHandlers) {
      handler.processResult(newRound[2]);
    }

    console.log(newRound);
  }
}
