import { Document } from "bson";
import EventEmitter from "events";
import { ChangeEvent, ChangeEventCR, ChangeStream, ChangeStreamOptions, MongoError } from "mongodb";
import { Model } from "mongoose";
import { logger } from "sc-common";
import { OperationType } from "../constants";
import getGameRoundModel, { GameRound } from "../models/game-rounds";

export default class RoundBaseGameWatcher extends EventEmitter {
  private readonly gameName: string;
  private readonly model: Model<GameRound>;
  private changeStream: ChangeStream<GameRound>;

  constructor(gameName: string) {
    super();
    this.gameName = gameName;
    this.model = getGameRoundModel(gameName);
    this.initChangeStream();
  }

  private initChangeStream(pipeline: Document[] = [], options: ChangeStreamOptions = {}) {
    this.changeStream = this.model.watch(pipeline, options) as ChangeStream<GameRound>;
    this.registerEvents();
  }

  private registerEvents() {
    this.changeStream.on("change", (event) => this.handleChangeStreamChange(event));
    this.changeStream.on("close", async () => await this.handleChangeStreamClosed());
    this.changeStream.on("error", (error: MongoError) => this.handleChangeStreamError(error));
  }

  handleChangeStreamChange(data: ChangeEvent<GameRound>) {
    const { operationType } = data;
    if (operationType === OperationType.INSERT) {
      const { fullDocument } = data as ChangeEventCR<GameRound>;
      if (fullDocument) {
        const { id, result, settlementResult, time } = fullDocument;
        const newRound = { [this.gameName]: { id, result, settlementResult, time } };
        this.emit(WatcherEvent.NEWROUND, newRound);
      }
    }
  }

  handleChangeStreamError(error: MongoError) {
    logger.logError(error);
  }

  async handleChangeStreamClosed(): Promise<void> {
    const { resumeToken } = this.changeStream;
    await this.closeChangeStream();

    setTimeout(() => {
      this.initChangeStream([], { startAfter: resumeToken });
    }, 1000);
    this.emit(WatcherEvent.CLOSE, "Change stream is CLOSED");
  }

  async closeChangeStream() {
    this.changeStream.removeAllListeners();
    await this.changeStream.close();
  }
}

export class WatcherEvent {
  static readonly CLOSE: "close";
  static readonly NEWROUND: "newround";
  static readonly ERROR: "error";
}
