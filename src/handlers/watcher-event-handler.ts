import appConfigs from "../app-configs";
import authenticationHelper from "../helpers/authentication-helper";
import { GameRound } from "../models/game-rounds";
import RoundBaseGameWatcher, { WatcherEvent } from "../watchers/round-base-game-watcher";
import LastResultHandler from "./last-result-handler";
import { GoodRoadHandler } from "./streak-handler";

export default class WatcherEventHandler {
  private readonly lastResultHandler: LastResultHandler;

  private readonly resultHandlers: GoodRoadHandler[] = [];

  constructor(lastResultHandler: LastResultHandler) {
    this.lastResultHandler = lastResultHandler;

    this.handleNewRoundEvent = this.handleNewRoundEvent.bind(this);
  }

  attachListeners(watcher: RoundBaseGameWatcher) {
    watcher.on(WatcherEvent.NEWROUND, this.handleNewRoundEvent);
  }

  attachHandler(handler: GoodRoadHandler) {
    this.resultHandlers.push(handler);
  }

  async handleNewRoundEvent(newRound: { [key: string]: GameRound }) {
    this.lastResultHandler.update(newRound);

    const gameResult = Object.values(newRound).shift();
    const gameId = Object.keys(newRound).shift();

    for (const handler of this.resultHandlers.filter((handler) => handler.getGameId().toString() === gameId)) {
      handler.processResult(gameResult ?? ({} as GameRound));
    }
  }
}
