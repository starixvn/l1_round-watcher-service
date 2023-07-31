import { registerBroadcastNewRoundEvent } from "./game-round-watcher-handler";
import { ChangeStream } from "mongodb";

const watcher: { [key: string]: ChangeStream } = {};

const addWatcher = (game: string) => {
  const changeStream = registerBroadcastNewRoundEvent(game);

  watcher[game] = changeStream;
};

const removeWatcher = (game: string) => {
  watcher[game].close();

  delete watcher[game];
};

const removeAll = () => {
  Object.keys(watcher).map((key) => delete watcher[key]);
};

export { addWatcher, removeWatcher, removeAll };
