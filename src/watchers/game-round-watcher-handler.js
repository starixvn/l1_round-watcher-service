import mongoose from "mongoose";
import { OperationType, RoundCollectionMapper } from "./constants";
import authenticationHelper from "../helpers/authentication-helper";
import appConfigs from "../app-configs";
import { logger } from "sc-common";

const Schema = new mongoose.Schema({
  id: { type: Number, required: true },
  result: { type: Object },
  settlementResult: { type: Object },
});

export const registerBroadcastNewRoundEvent = (game) => {
  const { notificationApiSettings } = appConfigs;
  const model = mongoose.model(RoundCollectionMapper(game), Schema);
  const changeStream = model.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === OperationType.insert) {
      const { id, result, settlementResult, time } = change.fullDocument;
      authenticationHelper
        .post(`${notificationApiSettings.url}/miniCounter`, {
          [game]: { id, result, settlementResult, time },
        })
        .catch((ex) => {
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
