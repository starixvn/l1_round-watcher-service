import Fastify from "fastify";
import cors from "@fastify/cors";
import mongoose from "mongoose";
import { middlewares, logger } from "sc-common";
import appConfigs from "./app-configs";
import AppBoostrapHandler from "./handlers/app-boostrap-handler";
import { ContainerRegistry } from "./container-registry";
import authenticationHelper from "./helpers/authentication-helper";
import Router from "./routes";

const fastify = Fastify({
  logger: appConfigs.enabledLogs,
  ignoreDuplicateSlashes: true,
  requestTimeout: 60,
});

fastify.register(cors, {
  origin: "*",
});

fastify.setErrorHandler(async (error, request, reply) => {
  console.log(error);
  logger.logError(error);
  reply.status(500).send({ error: "Something went wrong" });
});

const start = async () => {
  try {
    const { database, sentry, enabledLogs, notificationApiSettings } = appConfigs;
    middlewares.database.configureDatabase(mongoose, database);
    enabledLogs && logger.start(sentry);
    authenticationHelper.init(notificationApiSettings.auth);

    const container = new ContainerRegistry().register(appConfigs);

    const router = container.resolve<Router>("routers");
    const monitor = container.resolve<AppBoostrapHandler>("appBoostrapHandler");
    router.registerRoute(fastify);
    await monitor.initWatcher();

    await fastify.listen({ port: 5000, host: "0.0.0.0" });

    console.log(`Service started at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    fastify.log.error(err);
    console.log(err);
    process.exit(1);
  }
};

start();
