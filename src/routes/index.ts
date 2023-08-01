import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import appConfigs from "../app-configs";
import authenticationHelper from "../helpers/authentication-helper";
import Lobby from "../types/lobby";

const { notificationApiSettings } = appConfigs;
export const registerRoute = (fastify: FastifyInstance) => {
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    reply.code(200).send("Hello, I'm Round Watcher Service !!!");
  });
  fastify.post(
    "/api/lobby",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const lobby = request.body as Lobby;
      await authenticationHelper.post(
        `${notificationApiSettings.url}/lobby`,
        lobby
      );
      //TODO: call watcher to register changestream for each game Id
      //addWatchers(lobby.roundTimerGame.gameIds);
      reply.code(200).send();
    }
  );
};
