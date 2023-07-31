import { OperationType } from "../constants";
import authenticationHelper from "../helpers/authentication-helper";
import appConfigs from "../app-configs";
import { logger } from "sc-common";
import GameRound from "../models/game-rounds";
import { ChangeStreamInsertDocument } from "mongodb";

export const registerBroadcastNewRoundEvent = (game: string) => {
  const { notificationApiSettings } = appConfigs;
  const model = GameRound(game);
  const changeStream = model.watch();

  changeStream.on("change", (change: ChangeStreamInsertDocument) => {
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

  changeStream.on("error", (err) => {
    console.error("Change Stream error:", err);
    logger.logError(err);
  });

  return changeStream;
};
