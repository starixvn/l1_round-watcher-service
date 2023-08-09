import { lobbies } from "../models";
import WatcherManager from "../watchers/watcher-manager";
import LastResultHandler from "./last-result-handler";

export default class AppBoostrapHandler {
  private readonly lastResultHandler: LastResultHandler;
  private readonly watcherManager: WatcherManager;

  constructor(lastResultHandler: LastResultHandler, watcherManager: WatcherManager) {
    this.lastResultHandler = lastResultHandler;
    this.watcherManager = watcherManager;
  }

  public async initWatcher() {
    const supportedGames = await this.getSupportedGames();
    await this.lastResultHandler.getLastResult(supportedGames.filter((game) => game));

    this.clearWatcher();

    supportedGames.forEach((game) => this.watcherManager.addWatcher(game));
  }

  // TODO move to call admin api for first init
  async getSupportedGames() {
    const lobbySettings = await lobbies.find({}, { roundTimerGame: true, _id: false }).lean().exec();

    const games = lobbySettings.flatMap(setting => setting.roundTimerGame?.games);

    return games.flatMap((setting) => setting?.name || "");
  }

  // TODO why it not belong to watcher manager
  clearWatcher() {
    this.watcherManager.removeAllWatchers();
    this.lastResultHandler.clear();
  }
}
