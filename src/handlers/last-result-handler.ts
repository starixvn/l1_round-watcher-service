import { gameRounds } from "../models";
import { GameRound } from "../models/game-rounds";
import { GameConfig } from "../types";

export default class LastResultHandler {
  lastResult: { [key: string]: Object } = {};

  async getLastResult(gameConfigs: Array<GameConfig>) {
    const jobs = gameConfigs.map(async (game) => {
      const rounds = gameRounds(game.name);

      const latestRound = await rounds.findOne({}, { _id: false, exchangeRateId: false }).sort({ id: -1 }).lean().exec();

      return { [game.id]: { ...latestRound } };
    });

    const data = await Promise.all(jobs);

    this.lastResult = data.reduce((acc, obj) => {
      const key = Object.keys(obj)[0];
      acc[key] = obj[key];

      return acc;
    }, {});
  }

  update(roundResult: { [key: string]: GameRound }) {
    Object.assign(this.lastResult, roundResult);
  }

  get() {
    return { ...this.lastResult };
  }

  clear() {
    this.lastResult = {};
  }
}
