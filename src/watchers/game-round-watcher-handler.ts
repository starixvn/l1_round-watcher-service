import { OperationType } from "../constants";
import authenticationHelper from "../helpers/authentication-helper";
import appConfigs from "../app-configs";
import { logger } from "sc-common";
import GameRound from "../models/game-rounds";
import { ChangeStream, ChangeStreamInsertDocument } from "mongodb";
import { updateLastResult } from "../handlers/round-timer-handler";

export const registerRoundEvent = (game: string) => {
  const { notificationApiSettings } = appConfigs;
  const model = GameRound(game);
  const changeStream = model.collection.watch();

  changeStream.on(ChangeStream.CHANGE, (change: ChangeStreamInsertDocument) => {
    if (change.operationType === OperationType.insert) {
      const { id, result, settlementResult, time } = change.fullDocument;

      const newRound = { [game]: { id, result, settlementResult, time } };

      updateLastResult(newRound);
      authenticationHelper
        .post(`${notificationApiSettings.url}/miniCounter`, newRound)
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
