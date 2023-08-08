import { gameRounds } from "../models";
import { GameRound } from "../models/game-rounds";

export default class LastResultHandler {
  lastResult: { [key: string]: Object } = {};

  async getLastResult(gameConfigNames: Array<string>) {
    const jobs = gameConfigNames.map(async (gameName) => {
      const rounds = gameRounds(gameName);

      const latestRound = await rounds.findOne({}, { _id: false, exchangeRateId: false }).sort({ id: -1 }).lean().exec();

      return { [gameName]: { ...latestRound } };
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
