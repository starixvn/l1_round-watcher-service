import { registerRoundEvent } from "./game-round-watcher-handler";
import { ChangeStream } from "mongodb";

const watcher: { [key: string]: ChangeStream } = {};

const addWatcher = (gameId: string, gameName: string) => {
  if (!watcher[gameId]) {
    const changeStream = registerRoundEvent(gameId, gameName);

    watcher[gameId] = changeStream;
  }
};

const removeWatcher = (gameId: string) => {
  watcher[gameId].removeAllListeners();
  watcher[gameId].close();

  delete watcher[gameId];
};

const removeAll = () => {
  Object.keys(watcher).forEach((key) => removeWatcher[key]);
};

export { addWatcher, removeAll, removeWatcher };
