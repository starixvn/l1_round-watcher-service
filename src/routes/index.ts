import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";

export const registerRoute = (fastify: FastifyInstance) => {
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    reply.code(200).send("Hello, I'm Round Watcher Service !!!");
  });
};
