import { registerBroadcastNewRoundEvent } from "./game-round-watcher-handler";

const watcher = {};

const addWatcher = (game) => {
  const changeStream = registerBroadcastNewRoundEvent(game);

  watcher[game] = changeStream;
};

const removeWatcher = (game) => {
  watcher[game].close();

  delete watcher[game];
};

const removeAll = () => {
  Object.keys(watcher).map((key) => delete watcher[key]);
};

export { addWatcher, removeWatcher, removeAll };
