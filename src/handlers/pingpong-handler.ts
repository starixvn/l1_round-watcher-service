import { GameRound } from "../models/game-rounds";
import { GoodRoadHandler } from "./streak-handler";

export default class PingPongHandler implements GoodRoadHandler {
  private pattern = "pingpong";
  private pingpong = {};

  constructor() {}
  getGameId(): number {
    throw new Error("Method not implemented.");
  }
  hasGoodRoad(betOpt: string): boolean {
    throw new Error("Method not implemented.");
  }

  onHaveGoodRoad(goodroad: any): Promise<void> {
    //TODO broadcast message
    throw new Error("Method not implemented.");
  }

  async processResult(round: GameRound) {
    const settlement = round.settlementResult ?? round.result;

    Object.keys(settlement).forEach((choice) => {
      if (!this.pingpong[choice]) {
        this.pingpong[choice] = [];
      }

      const result = settlement[choice] ? 1 : 0;
      const length = this.pingpong[choice].length;

      if (length > 0) {
        const lastResult = this.pingpong[choice][length - 1];
        if (lastResult === result) {
          this.pingpong[choice] = [];
        }
      }

      this.pingpong[choice].push(result);
    });

    // console.log(this.pingpong);
  }

  getPattern() {
    return {
      pattern: this.pattern,
      result: this.pingpong,
    };
  }

  isSupported(pattern: string): boolean {
    return this.pattern === pattern.trim();
  }
}
