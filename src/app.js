import Fastify from "fastify";
import cors from "@fastify/cors";
import mongoose from "mongoose";
import { middlewares, logger } from "sc-common";
import appConfigs from "./app-configs";
import { registerRoute } from "./route";
import authenticationHelper from "./helpers/authentication-helper";
import { addWatcher } from "./watcher/watcher-manager";

const fastify = Fastify({
  logger: appConfigs.enabledLogs,
  ignoreDuplicateSlashes: true,
  requestTimeout: 60,
});

fastify.setErrorHandler(async (error, request, reply) => {
  console.log(error);
  Sentry.captureException(error);
  reply.status(500).send({ error: "Something went wrong" });
});

fastify.register(cors, {
  origin: "*",
});

const start = async () => {
  try {
    const { database, sentry, enabledLogs, notificationApiSettings } =
      appConfigs;
    registerRoute(fastify);
    middlewares.database.configureDatabase(mongoose, database);
    enabledLogs && logger.start(sentry);
    authenticationHelper.init(notificationApiSettings.auth);
    addWatcher("xocxoc");

    await fastify.listen({ port: 5000, host: "0.0.0.0" });

    console.log(
      `Service started at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
    );
  } catch (err) {
    fastify.log.error(err);
    console.log(err);
    process.exit(1);
  }
};

start();
