export default {
  enabledLogs: true,
  database: {
    url: "mongodb://lmn_backend:LmnBackend@10.10.50.12:39201,10.10.50.13:39201,10.10.50.14:39201/?replicaSet=L2pLocal&appName=roundwatcher",
    options: {
      dbName: "minigame",
    },
  },
  notificationApiSettings: {
    url: "http://l2_notification_service_local_1:5000/api",
    auth: {
      url: "http://l2_auth_api_local_1:5000",
      id: "game-services",
      secret: "gameservices@20luminet&",
      useAuthenticate: true,
    },
    requestTimeout: 10000,
  },
  sentry: {
    sentryUrl: "https://acb36eb835d948d68c1aad9873754d51@sentry.lumigame.com/27",
    logIdentifier: "round-watcher-service",
    env: "LOCAL-1",
  },
  metrics: {
    enable: true,
    secretKey: "6c1f0f28-70f2-46ae-b031-22624a6cd8df",
  },
};
