import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import appConfigs from "../app-configs";
import authenticationHelper from "../helpers/authentication-helper";
import Lobby from "../types/lobby";
import { getLatestResult } from "../handlers/round-timer-handler";

const { notificationApiSettings } = appConfigs;
export const registerRoute = (fastify: FastifyInstance) => {
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    reply.code(200).send("Hello, I'm Round Watcher Service !!!");
  });

  fastify.post("/api/lobby", async (request: FastifyRequest, reply: FastifyReply) => {
    //const lobby = request.body as Lobby;

    reply.code(200).send({ received: true });
  });

  fastify.get("/api/lastResult", async (request: FastifyRequest, reply: FastifyReply) => {
    reply.code(200).send(getLatestResult());
  });
};
