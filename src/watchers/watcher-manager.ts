import { registerRoundEvent } from "./game-round-watcher-handler";
import { ChangeStream } from "mongodb";
import { registerBroadcastNewRoundEvent } from "./game-round-watcher-handler";

const watcher: { [key: string]: ChangeStream } = {};

const addWatcher = (game: string) => {
  if (!watcher[game]) {
  const changeStream = registerRoundEvent(game);

  watcher[game] = changeStream;
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

