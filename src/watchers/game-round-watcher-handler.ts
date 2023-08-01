import { ChangeStream, ChangeStreamInsertDocument } from "mongodb";
import { logger } from "sc-common";
import appConfigs from "../app-configs";
import { OperationType } from "../constants";
import authenticationHelper from "../helpers/authentication-helper";
import GameRound from "../models/game-rounds";

export const registerBroadcastNewRoundEvent = (game: string) => {
  const { notificationApiSettings } = appConfigs;
  const model = GameRound(game);
  const changeStream = model.collection.watch();

  changeStream.on(ChangeStream.CHANGE, (change: ChangeStreamInsertDocument) => {
    if (change.operationType === OperationType.insert) {
      const { id, result, settlementResult, time } = change.fullDocument;
      authenticationHelper
        .post(`${notificationApiSettings.url}/miniCounter`, {
          [game]: { id, result, settlementResult, time },
        })
        .catch((ex: Error) => {
          logger.logError(ex);
        });
    }
  });

  changeStream.on(ChangeStream.ERROR, (err) => {
    console.error("Change Stream error:", err);
    logger.logError(err);
  });

  return changeStream;
};
