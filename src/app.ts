import cors from "@fastify/cors";
import Fastify from "fastify";
import mongoose from "mongoose";
import mongooseLong from "mongoose-long";
import { logger } from "sc-common";
import appConfigs from "./app-configs";
import { ContainerRegistry } from "./container-registry";
import AppBoostrapHandler from "./handlers/app-boostrap-handler";
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


export const configureDatabase = async ({ url = "", options = {} }) => {
  mongooseLong(mongoose);

  await mongoose
      .connect(url, options)
      .then(() => {
          console.log("Connect to MongoDB success " + url);
      })
      .catch((error) => {
          console.log("Connect to MongoDB failed", error);
          logger.logError(error);
      });

  mongoose.connection.once("open", function () {
      console.log("MongoDB database connection established successfully");
  });

  mongoose.connection.on("connected", () => {
      const message = `MongoDB connected at ${new Date()}`;
      logger.log(message);
  });

  mongoose.connection.on("reconnected", () => {
      const message = `MongoDB reconnected at ${new Date()}`;
      logger.logWarning(message);
  });

  mongoose.connection.on("disconnected", () => {
      logger.logWarning(`MongoDB disconnected at ${new Date()}`);
  });

  mongoose.connection.on("error", (err) => {
      logger.logError(err);
  });
};

const start = async () => {
  try {
    const { database, sentry, enabledLogs, notificationApiSettings } = appConfigs;
    configureDatabase(database);
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
