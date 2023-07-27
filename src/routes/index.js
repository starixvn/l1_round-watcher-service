export const registerRoute = (fastify) => {
  fastify.get("/", async (request, reply) => {
    reply.code(200).send("Hello, I'm Round Watcher Service !!!");
  });
};
