import { lobbies } from "../models";
import { addWatcher, removeAll } from "../watchers/watcher-manager";
import LastResultHandler from "./last-result-handler";

export default class AppBoostrapHandler {
  private readonly lastResultHandler: LastResultHandler;

  constructor(lastResultHandler: LastResultHandler) {
    this.lastResultHandler = lastResultHandler;
  }

  public async initWatcher() {
    const supportedGames = await this.getSupportedGames();
    await this.lastResultHandler.getLastResult(supportedGames.filter((game) => game));

    this.clearWatcher();

    supportedGames.forEach((game) => addWatcher(game, this.lastResultHandler));
  }

  // TODO move to call admin api for first init
  async getSupportedGames() {
    const lobbySettings = await lobbies.find({}, { roundTimerGame: true, _id: false }).lean().exec();

    const games = lobbySettings.flatMap((setting: { roundTimerGame: { games: any } }) => setting.roundTimerGame?.games);

    return games.flatMap((setting) => setting?.name || "");
  }

  // TODO why it not belong to watcher manager
  clearWatcher() {
    removeAll();

    this.lastResultHandler.clear();
  }
}
