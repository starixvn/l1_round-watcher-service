import { stub } from "jest-micro-auto-stub";
import OpenIdClient, { Issuer } from "openid-client";
import { logger } from "sc-common";

import BearerAuthenticator from "../../src/helpers/bearer-authenticator";

jest.mock("sc-common");
jest.useFakeTimers();
jest.mock("openid-client");

describe("bearer authenticator test", () => {
  logger.log.mockReturnValue(jest.fn());
  logger.logError.mockReturnValue(jest.fn());

  const authConfigs = {
    url: "http://localhost",
    id: "client_id",
    secret: "client_secret",
  };
  /** @type {Issuer} */
  const issuer = stub(Issuer);
  issuer.Client.mockClear();
  OpenIdClient.Issuer.discover.mockReturnValue(issuer);

  const bearerAuthenticator = new BearerAuthenticator(authConfigs);

  describe("autoUpdateToken", () => {
    it("should calls updateToken", async () => {
      // arrange
      bearerAuthenticator["updateToken"] = jest.fn();
      bearerAuthenticator["refresh"] = jest.fn();

      // act
      await bearerAuthenticator.autoUpdateToken();

      // assert
      expect(bearerAuthenticator.updateToken).toHaveBeenCalled();
    });

    it("should calls setTimeout", async () => {
      // arrange
      bearerAuthenticator["updateToken"] = jest.fn();
      bearerAuthenticator["refresh"] = jest.fn();
      jest.spyOn(global, "setTimeout");

      // act
      await bearerAuthenticator.autoUpdateToken();

      // assert
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 60000);
    });
  });

  describe("refresh", () => {
    it("should calls setTimeout", async () => {
      // arrange
      bearerAuthenticator["isTokenExpired"] = jest
        .fn()
        .mockReturnValueOnce(false);
      jest.spyOn(global, "setTimeout");

      // act
      await bearerAuthenticator.refresh();

      // assert
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 60000);
    });

    describe("when token expired", () => {
      it("should calls update token", async () => {
        // arrange
        bearerAuthenticator["isTokenExpired"] = jest
          .fn()
          .mockReturnValueOnce(true);
        jest.spyOn(bearerAuthenticator, "updateToken");

        // act
        await bearerAuthenticator.refresh();
        expect(bearerAuthenticator.updateToken).toHaveBeenCalled();
      });
    });
  });

  describe("updateToken", () => {
    describe("when normal", () => {
      it("should get bearer token", async () => {
        // arrange
        const token = {
          token: "bearer_token",
          expired: new Date(),
        };

        bearerAuthenticator["getBearerToken"] = jest
          .fn()
          .mockResolvedValueOnce(token);

        // act
        await bearerAuthenticator.updateToken();

        // assert
        expect(bearerAuthenticator.getBearerToken).toHaveBeenCalled();
        expect(bearerAuthenticator.token).toEqual(token.token);
        expect(bearerAuthenticator.expired).toEqual(token.expired);
        expect(logger.log).toHaveBeenCalledWith(
          "Get bearer token successfully."
        );
      });
    });

    describe("when have exception", () => {
      it("should log error", async () => {
        // arrange
        bearerAuthenticator["getBearerToken"] = jest
          .fn()
          .mockRejectedValueOnce("error");

        // act
        await bearerAuthenticator.updateToken();

        // assert
        expect(logger.logError).toHaveBeenCalled();
      });
    });
  });

  describe("isTokenExpired", () => {
    describe("when expired is null", () => {
      it("should returns true", () => {
        // arrange
        bearerAuthenticator.expired = null;

        // act & assert
        expect(bearerAuthenticator.isTokenExpired()).toBeTruthy();
      });
    });
    describe("when expired is undefined", () => {
      it("should returns true", () => {
        // arrange
        bearerAuthenticator.expired = undefined;

        // act & assert
        expect(bearerAuthenticator.isTokenExpired()).toBeTruthy();
      });
    });
  });
});
