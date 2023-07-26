export default {
  enabledLogs: true,
  database: {
    url: "mongodb://lmn_backend:LmnBackend%40517@10.99.99.187:27301/?replicaSet=SabaSIT&appName=gameroundmonitorservice",
    options: {
      dbName: "minigame",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      auto_reconnect: true,
    },
  },
  notificationApiSettings: {
    url: "http://l1_notification_service_sit:5000/api",
    auth: {
      url: "http://l1_auth_api_sit:5000",
      id: "game-services",
      secret: "gameservices@20luminet&",
      useAuthenticate: true,
    },
    requestTimeout: 10000,
  },
  sentry: {
    sentryUrl: "http://52368c4019044019885440599c180bda@10.2.190.51:9009/24",
    logIdentifier: "game-round-monitor-service",
    env: "SIT",
  },
  metrics: {
    enable: true,
    secretKey: "6c1f0f28-70f2-46ae-b031-22624a6cd8df",
  },
};
