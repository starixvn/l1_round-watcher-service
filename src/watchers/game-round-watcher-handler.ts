import { OperationType, StreamWatcherEvent } from "../constants";
import authenticationHelper from "../helpers/authentication-helper";
import appConfigs from "../app-configs";
import { logger } from "sc-common";
import GameRound from "../models/game-rounds";
import { updateLastResult } from "../handlers/round-timer-handler";

export const registerRoundEvent = (game: string) => {
  const { notificationApiSettings } = appConfigs;
  const model = GameRound(game);
  const changeStream = model.watch();

  changeStream.on(StreamWatcherEvent.CHANGE, (change) => {
    if (change.operationType === OperationType.INSERT) {
      const { id, result, settlementResult, time } = change?.fullDocument;
      const newRound = { [game]: { id, result, settlementResult, time } };

      // it is a subcriber
      updateLastResult(newRound);

      // then it is another subcriber
      authenticationHelper
        .post(`${notificationApiSettings.url}/miniCounter`, newRound)
        .catch((ex: Error) => {
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
