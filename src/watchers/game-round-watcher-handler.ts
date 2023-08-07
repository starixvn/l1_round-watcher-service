import EventEmitter from "events";
import { ChangeStream, ChangeStreamDocument, ChangeStreamInsertDocument, ChangeStreamOptions, Document } from "mongodb";
import { Model } from "mongoose";
import { logger } from "sc-common";
import appConfigs from "../app-configs";
import { OperationType, StreamWatcherEvent } from "../constants";
import LastResultHandler from "../handlers/last-result-handler";
import authenticationHelper from "../helpers/authentication-helper";
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
    this.changeStream.on(ChangeStream.CHANGE, (...args) => this.handleChangeStreamChange(...args));
    this.changeStream.on(ChangeStream.CLOSE, async () => await this.handleChangeStreamClosed());
  }

  handleChangeStreamChange(data: ChangeStreamDocument<GameRound>) {
    const { operationType } = data;
    if (operationType === OperationType.INSERT) {
      const { fullDocument } = data as ChangeStreamInsertDocument<GameRound>;
      const { id, result, settlementResult, time } = fullDocument;
      const newRound = { [this.gameName]: { id, result, settlementResult, time } };
      this.emit(WatcherEvent.NEWROUND, newRound);
    }
  }

  async handleChangeStreamClosed(): Promise<void> {
    const { pipeline, options, resumeToken } = this.changeStream;
    await this.closeChangeStream();

    setTimeout(() => {
      this.initChangeStream(pipeline, { ...options, startAfter: resumeToken });
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
}

export const registerRoundEvent = (game: string, lastResultHandler: LastResultHandler) => {
  const { notificationApiSettings } = appConfigs;
  const model = getGameRoundModel(game);
  const changeStream = model.watch();

  changeStream.on(StreamWatcherEvent.CHANGE, (change) => {
    if (change.operationType === OperationType.INSERT) {
      const { id, result, settlementResult, time } = change?.fullDocument;
      const newRound = { [game]: { id, result, settlementResult, time } };

      // it is a subcriber
      lastResultHandler.update(newRound);

      // then it is another subcriber
      authenticationHelper.post(`${notificationApiSettings.url}/miniCounter`, newRound).catch((ex: Error) => {
        logger.logError(ex);
      });

      // another subscriber
      // subscriber.onReceived(....)
    }
  });

  changeStream.on(StreamWatcherEvent.ERROR, (err) => {
    console.error("Change Stream error:", err);
    logger.logError(err);
  });

  return changeStream;
};
