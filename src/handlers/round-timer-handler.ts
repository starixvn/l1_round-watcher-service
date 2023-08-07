import { lobbies } from "../models";
import { addWatcher, removeAll } from "../watchers/watcher-manager";
import { gameRounds } from "../models";

const LastResult: { [key: string]: Object } = {};

const getLastResult = async (gameConfigs: Array<{ id: string; name: string }>) => {
  const jobs = gameConfigs.map(async (game) => {
    const model = gameRounds(game.name);

    const latestRound = await model.findOne({}, { _id: false, exchangeRateId: false }).sort({ id: -1 }).lean().exec();

    return { [game.id]: { ...latestRound } };
  });

  const data = await Promise.all(jobs);

  return data.reduce((acc, obj) => {
    const key = Object.keys(obj)[0];
    acc[key] = obj[key];

    return acc;
  }, {});
};

const getSupportedGames = async () => {
  const lobbySettings = await lobbies.find({}, { roundTimerGame: true, _id: false }).lean().exec();

  const games = lobbySettings.flatMap((setting) => setting.roundTimerGame?.games);

  return games;
};

const clearWatcher = () => {
  removeAll();
  Object.keys(LastResult).map((key) => delete LastResult[key]);
};

const initWatcher = async () => {
  const supportedGames = await getSupportedGames();
  const latestResult = await getLastResult(supportedGames);

  clearWatcher();
  Object.assign(LastResult, latestResult);
  supportedGames.forEach((game) => addWatcher(game.id, game.name));
};

const updateLastResult = (roundResult: { [key: string]: Object }) => {
  Object.assign(LastResult, roundResult);
};

const getLatestResult = () => ({ ...LastResult });

export { initWatcher, updateLastResult, getLatestResult };
