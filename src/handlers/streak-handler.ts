import { GameRound } from "../models/game-rounds";

import appConfigs from "../app-configs";
import authenticationHelper from "../helpers/authentication-helper";

export interface GoodRoadHandler {
  processResult(round: GameRound): Promise<void>;
  getPattern(): any;
  isSupported(pattern: string): boolean;
  onHaveGoodRoad(goodroad: any): Promise<void>;
  hasGoodRoad(betOpt: string): boolean;
  getGameId(): number;
}

export default class StreakHandler implements GoodRoadHandler {
  private readonly minimum = 4;
  private readonly pattern = "streak";
  private gameId;
  private streaks = {};

  constructor(gameId: number) {
    this.gameId = gameId;
    //TODO inject publisher
  }
  getGameId(): number {
    return this.gameId;
  }

  async onHaveGoodRoad(goodroad: any): Promise<void> {
    console.log(this.streaks);

    const notification = { gameId: this.gameId, pattern: this.pattern, goodroad };

    //TODO broadcast message
    await authenticationHelper.post(`${appConfigs.notificationApiSettings.url}/goodRoad`, notification);
  }

  async processResult(round: GameRound) {
    const settlement = round.settlementResult ?? round.result;

    Object.keys(settlement).forEach((choice) => {
      if (settlement[choice]) {
        this.streaks[choice] = this.streaks[choice] > 0 ? (this.streaks[choice] += 1) : 1;

        return;
      }

      this.streaks[choice] = 0;
    });

    const { total, goodroad } = this.getGoodRoad();

    if (total > 0) {
      await this.onHaveGoodRoad(goodroad);
    }

    // console.log(`processResult for ${this.gameId}`);
    // console.log(round);
  }

  getPattern() {
    const { total, goodroad } = this.getGoodRoad();

    return {
      pattern: this.pattern,
      total,
      result: goodroad,
    };
  }

  private getGoodRoad() {
    const goodroad = {};
    let total = 0;

    Object.keys(this.streaks).forEach((betOpt) => {
      if (this.hasGoodRoad(betOpt)) {
        goodroad[betOpt] = this.streaks[betOpt];
        total += 1;
      }
    });

    return { total, goodroad };
  }

  hasGoodRoad(betOpt: string): boolean {
    return this.streaks[betOpt] >= this.minimum;
  }

  isSupported(pattern: string): boolean {
    return this.pattern === pattern.trim();
  }
}
