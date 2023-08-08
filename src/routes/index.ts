import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import LastResultHandler from "../handlers/last-result-handler";
export default class Router {
  private readonly fastify: FastifyInstance;
  
  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }
  registerRoute() {
    this.fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
      reply.code(200).send("Hello, I'm Round Watcher Service !!!");
    });

    this.fastify.get("/api/lastResult", async (request: FastifyRequest, reply: FastifyReply) => {
      //TODO must be singleton
      const timerHandler = new LastResultHandler();
      reply.code(200).send(timerHandler.get());
    });
  }
}
