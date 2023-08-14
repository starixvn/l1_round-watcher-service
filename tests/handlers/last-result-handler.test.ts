import { gameRounds } from "../../src/models";
import { logger } from "sc-common";
import LastResultHandler from "../../src/handlers/last-result-handler";

jest.mock("sc-common");
jest.mock("../../src/models", () => ({
  gameRounds: jest.fn(),
}));

describe("LastResultHandler", () => {
  let lastResultHandler;

  beforeEach(() => {
    lastResultHandler = new LastResultHandler();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getLastResult", () => {
    const exec = jest.fn().mockResolvedValue({ id: 123 });

    const rounds = {
      findOne: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: () => ({
            exec,
          }),
        }),
      }),
    };

    beforeEach(() => {
      (gameRounds as jest.Mock).mockReturnValue(rounds);
    });

    it("should get the last result for each game config", async () => {
      const gameConfigs = [
        { id: "game1", name: "Game 1" },
        { id: "game2", name: "Game 2" },
        { id: "game3", name: "Game 3" },
      ];

      await lastResultHandler.getLastResult(gameConfigs);

      expect(gameRounds).toHaveBeenCalledWith(gameConfigs[0].name);
      expect(gameRounds).toHaveBeenCalledWith(gameConfigs[1].name);
      expect(gameRounds).toHaveBeenCalledWith(gameConfigs[2].name);

      expect(rounds.findOne).toHaveBeenCalledWith({}, { _id: false, exchangeRateId: false });
      expect(rounds.findOne().sort).toHaveBeenCalledWith({ id: -1 });
      expect(exec).toHaveBeenCalledTimes(3);

      expect(lastResultHandler.lastResult).toEqual({
        game1: { id: 123 },
        game2: { id: 123 },
        game3: { id: 123 },
      });
    });

    it("should log error when an error occurs", async () => {
      const gameConfigs = [{ id: "game1", name: "Game 1" }];
      const error = new Error("Something went wrong");
      exec.mockRejectedValueOnce(error);

      await lastResultHandler.getLastResult(gameConfigs);

      expect(logger.logError).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("should update the last result with the given round result", () => {
      lastResultHandler.lastResult = {
        game1: { id: 123 },
        game2: { id: 456 },
      };

      const roundResult = {
        game1: { id: 789 },
        game3: { id: 987 },
      };

      lastResultHandler.update(roundResult);

      expect(lastResultHandler.lastResult).toEqual({
        game1: { id: 789 },
        game2: { id: 456 },
        game3: { id: 987 },
      });
    });
  });

  describe("get", () => {
    it("should return a copy of the last result", () => {
      lastResultHandler.lastResult = {
        game1: { id: 123 },
        game2: { id: 456 },
      };

      const result = lastResultHandler.get();

      expect(result).toEqual({
        game1: { id: 123 },
        game2: { id: 456 },
      });
    });
  });

  describe("remove", () => {
    it("should remove the last result with the given key", () => {
      lastResultHandler.lastResult = {
        game1: { id: 123 },
        game2: { id: 456 },
      };

      lastResultHandler.remove("game2");

      expect(lastResultHandler.lastResult).toEqual({
        game1: { id: 123 },
      });
    });
  });

  describe("clear", () => {
    it("should clear the last result", () => {
      lastResultHandler.lastResult = {
        game1: { id: 123 },
        game2: { id: 456 },
      };

      lastResultHandler.clear();

      expect(lastResultHandler.lastResult).toEqual({});
    });
  });
});
