import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import LastResultHandler from "../handlers/last-result-handler";
import { async } from "fast-glob";
import WatcherManager from "../watchers/watcher-manager";
import { GameConfig, Requests } from "../types";
export default class Router {
  private readonly lastResultHandler: LastResultHandler;
  private readonly watcherManager: WatcherManager;

  constructor(lastResultHandler: LastResultHandler, watcherManager: WatcherManager) {
    this.lastResultHandler = lastResultHandler;
    this.watcherManager = watcherManager;
  }
  registerRoute(fastify: FastifyInstance) {
    fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
      reply.code(200).send("Hello, I'm Round Watcher Service !!!");
    });

    fastify.get("/api/lastResult", async (request: FastifyRequest, reply: FastifyReply) => {
      reply.code(200).send(this.lastResultHandler.get());
    });

    fastify.post("/api/lobby", async (request: FastifyRequest<{ Body: Requests.LobbyRequestBody }>, reply: FastifyReply) => {
      const games = request.body?.games;

      await this.watcherManager.updateWatchers(games);

      reply.code(200).send({ received: true });
    });
  }
}
