import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import LastResultHandler from "../handlers/last-result-handler";
export default class Router {
  private readonly lastResultHandler: LastResultHandler;

  constructor(lastResultHandler: LastResultHandler) {
    this.lastResultHandler = lastResultHandler;
  }
  registerRoute(fastify: FastifyInstance) {
    fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
      reply.code(200).send("Hello, I'm Round Watcher Service !!!");
    });

    fastify.get("/api/lastResult", async (request: FastifyRequest, reply: FastifyReply) => {
      reply.code(200).send(this.lastResultHandler.get());
    });
  }
}
