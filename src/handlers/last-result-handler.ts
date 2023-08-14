import { gameRounds } from "../models";
import { GameRound } from "../models/game-rounds";
import { GameConfig } from "../types";
import { logger } from "sc-common";

export default class LastResultHandler {
  lastResult: { [key: string]: Object } = {};

  async getLastResult(gameConfigs: Array<GameConfig>) {
    try {
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
      }, this.lastResult);
    } catch (err) {
      logger.logError(err);
    }
  }

  update(roundResult: { [key: string]: GameRound }) {
    Object.assign(this.lastResult, roundResult);
  }

  get() {
    return { ...this.lastResult };
  }

  remove(key: string) {
    delete this.lastResult[key];
  }

  clear() {
    this.lastResult = {};
  }
}
