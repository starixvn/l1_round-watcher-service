import { GameRound } from "../models/game-rounds";

export interface ResultHandler {
  processResult(round: GameRound): void;
}

export default class StreakHandler implements ResultHandler {
  private streaks = {};

  constructor() {}

  processResult(round: GameRound) {
    Object.keys(round.settlementResult).forEach((choice) => {
      if (round.settlementResult[choice]) {
        this.streaks[choice] = this.streaks[choice] > 0 ? (this.streaks[choice] += 1) : 1;

        return;
      }

      this.streaks[choice] = 0;
    });

    console.log(this.streaks);
  }
}
