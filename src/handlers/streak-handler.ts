import { GameRound } from "../models/game-rounds";

export interface GoodRoadHandler {
  processResult(round: GameRound): void;
  getPattern(): any;
  isSupported(pattern: string): boolean;
  onHaveGoodRoad(): void;
}

export default class StreakHandler implements GoodRoadHandler {
  private readonly minimum = 4;
  private readonly pattern = "streak";
  private streaks = {};

  constructor() {}

  onHaveGoodRoad(): void {
    //TODO broadcast message
    throw new Error("Method not implemented.");
  }

  processResult(round: GameRound) {
    const settlement = round.settlementResult ?? round.result;

    Object.keys(settlement).forEach((choice) => {
      if (settlement[choice]) {
        this.streaks[choice] = this.streaks[choice] > 0 ? (this.streaks[choice] += 1) : 1;

        return;
      }

      this.streaks[choice] = 0;
    });

    console.log(this.streaks);
  }

  getPattern() {
    const goodroad = {};
    let total = 0;

    Object.keys(this.streaks).forEach((betOpt) => {
      if (this.streaks[betOpt] >= this.minimum) {
        goodroad[betOpt] = this.streaks[betOpt];
        total += 1;
      }
    });

    return {
      pattern: this.pattern,
      total,
      result: goodroad,
    };
  }

  isSupported(pattern: string): boolean {
    return this.pattern === pattern.trim();
  }
}
