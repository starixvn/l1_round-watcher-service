import { GameRound } from "../models/game-rounds";
import { ResultHandler } from "./streak-handler";

export default class PingPongHandler implements ResultHandler {
  private pingpong = {};

  constructor() {}

  processResult(round: GameRound) {
    Object.keys(round.settlementResult).forEach((choice) => {
      if (!this.pingpong[choice]) {
        this.pingpong[choice] = [];
      }

      const result = round.settlementResult[choice] ? 1 : 0;
      const length = this.pingpong[choice].length;

      if (length > 0) {
        const lastResult = this.pingpong[choice][length - 1];
        if (lastResult === result) {
          this.pingpong[choice] = [];
        }
      }

      this.pingpong[choice].push(result);
    });

    console.log(this.pingpong);
  }
}
