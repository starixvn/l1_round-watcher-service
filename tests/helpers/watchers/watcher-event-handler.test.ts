import appConfigs from "../../../src/app-configs";
import LastResultHandler from "../../../src/handlers/last-result-handler";
import authenticationHelper from "../../../src/helpers/authentication-helper";
import RoundBaseGameWatcher, { WatcherEvent } from "../../../src/watchers/round-base-game-watcher";
import WatcherEventHandler from "../../../src/watchers/watcher-event-handler";
jest.mock("../../../src/watchers/round-base-game-watcher");
jest.mock("../../../src/handlers/last-result-handler");
jest.mock("../../../src/helpers/authentication-helper");

const lastResultHandler = new LastResultHandler();

function initHandler() {
  return new WatcherEventHandler(lastResultHandler);
}

describe("WatcherEventHandler", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("attachListeners", () => {
    it("should register NEWROUND & CLOSE events", () => {
      //Arrange
      const handler = initHandler();
      const watcher = new RoundBaseGameWatcher({ id: 1, name: "game1" });

      //Act
      handler.attachListeners(watcher);

      //Assert
      expect(watcher.on).toHaveBeenCalledWith(WatcherEvent.CLOSE, handler.handleCloseEvent);
      expect(watcher.on).toHaveBeenCalledWith(WatcherEvent.NEWROUND, handler.handleNewRoundEvent);
    });
  });

  describe("handleNewRoundEvent", () => {
    it("should call lastResultHandler.update && authenticationHelper.post", async () => {
      //Arrange
      const handler = initHandler();
      const newRound = {
        "1": {
          id: 1,
          time: new Date(),
          result: 10,
          settlementResult: {},
        },
      };

      //Act
      await handler.handleNewRoundEvent(newRound);

      //Assert
      expect(lastResultHandler.update).toHaveBeenCalledWith(newRound);
      expect(authenticationHelper.post).toHaveBeenCalledWith(`${appConfigs.notificationApiSettings.url}/roundTimer`, newRound);
    });
  });
});
