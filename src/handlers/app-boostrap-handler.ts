import { GameConfig } from "../types";
import WatcherManager from "../watchers/watcher-manager";
import LastResultHandler from "./last-result-handler";
import appConfigs from "../app-configs";
import authHelper from "../helpers/authentication-helper";

export default class AppBoostrapHandler {
  private readonly lastResultHandler: LastResultHandler;
  private readonly watcherManager: WatcherManager;

  constructor(lastResultHandler: LastResultHandler, watcherManager: WatcherManager) {
    this.lastResultHandler = lastResultHandler;
    this.watcherManager = watcherManager;
  }

  public async initWatcher() {
    // const supportedGames = await this.getSupportedGames();
    // await this.lastResultHandler.getLastResult(supportedGames);

    //TODO configuration of supportedGames
    const sedie: GameConfig = { id: 2, name: "xocxoc" };
    const supportedGames = [sedie];

    supportedGames.forEach((game) => this.watcherManager.addWatcher(game));
    //
  }

  async getSupportedGames() {
    const games = await authHelper.get(`${appConfigs.adminApiSettings.url}/lobby/getRoundTimerGame`);

    return games as GameConfig[];
  }
}
