import { lobbies } from "../models";
import { addWatcher, removeAll } from "../watchers/watcher-manager";
import { gameRounds } from "../models";

const LastResult: { [key: string]: Object } = {};

// TODO for resume action, does not need to be here
const getLastResult = async (gameConfigNames: Array<string>) => {
  const jobs = gameConfigNames.map(async (gameName) => {
    const model = gameRounds(gameName);

    const latestRound = await model.findOne({}, { _id: false, exchangeRateId: false }).sort({ id: -1 }).lean().exec();

    return { [gameName]: { ...latestRound } };
  });

  const data = await Promise.all(jobs);

  return data.reduce((acc, obj) => {
    const key = Object.keys(obj)[0];
    acc[key] = obj[key];

    return acc;
  }, {});
};

// TODO get timer config, shouldnt be in handler
const getSupportedGames = async () => {
  const lobbySettings = await lobbies.find({}, { roundTimerGame: true, _id: false }).lean().exec();

  const games = lobbySettings.flatMap((setting) => setting.roundTimerGame?.games);

  return games.flatMap((setting) => setting?.name || "");
};

// TODO why it not belong to watcher manager
const clearWatcher = () => {
  removeAll();
  Object.keys(LastResult).map((key) => delete LastResult[key]);
};

const initWatcher = async () => {
  const supportedGames = await getSupportedGames();
  const latestResult = await getLastResult(supportedGames.filter((game) => game));

  clearWatcher();
  Object.assign(LastResult, latestResult);
  supportedGames.forEach((game) => addWatcher(game));
};

const updateLastResult = (roundResult: { [key: string]: Object }) => {
  Object.assign(LastResult, roundResult);
};

const getLatestResult = () => ({ ...LastResult });

export { initWatcher, updateLastResult, getLatestResult };
