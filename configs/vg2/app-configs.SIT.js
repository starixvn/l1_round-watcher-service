export default {
  enabledLogs: true,
  database: {
    url: "mongodb://lmn_backend:LmnBackend%40517@10.99.99.187:37301/?replicaSet=SabaL2SIT&appName=gameroundmonitorservice",
    options: {
      dbName: "minigame",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      auto_reconnect: true,
    },
  },
  notificationApiSettings: {
    url: "http://l2_notification_service_sit:5000/api",
    auth: {
      url: "http://l2_auth_api_sit:5000",
      id: "game-services",
      secret: "gameservices@20luminet&",
    },
    requestTimeout: 10000,
    useAuthenticate: true,
  },
  sentry: {
    sentryUrl: "http://8ac47fca6d3e4a41908896a64ef201ac@10.2.190.51:9009/53",
    logIdentifier: "game-round-monitor-service",
    env: "SIT",
  },
  metrics: {
    enable: true,
    secretKey: "6c1f0f28-70f2-46ae-b031-22624a6cd8df",
  },
};
