import { registerRoundEvent } from "./game-round-watcher-handler";
import { ChangeStream } from "mongodb";
import LastResultHandler from "../handlers/last-result-handler";

const watcher: { [key: string]: ChangeStream } = {};

const addWatcher = (game: string, lastResultHandler: LastResultHandler) => {
  if (!watcher[game]) {
    const changeStream = registerRoundEvent(game, lastResultHandler);

    watcher[game] = changeStream;
  }
};

const removeWatcher = (game: string) => {
  watcher[game].removeAllListeners();
  watcher[game].close();

  delete watcher[game];
};

const removeAll = () => {
  Object.keys(watcher).forEach((key) => removeWatcher[key]);
};

export { addWatcher, removeAll, removeWatcher };
