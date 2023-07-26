export default {
  hostingPort: 5000,
  enabledLogs: true,
  database: {
    url: "mongodb://lmn_backend:LmnBackend@10.10.50.12:39100,10.10.50.13:39100,10.10.50.14:39100/?replicaSet=L1Local&appName=gameroundmonitorservice",
    options: {
      dbName: "minigame",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      auto_reconnect: true,
    },
  },
  notificationApiSettings: {
    url: "https://l1-proxy.lumigame.com/notification/api",
    auth: {
      url: "https://auth.lumigame.com",
      id: "game-services",
      secret: "gameservices@20luminet&",
    },
    requestTimeout: 10000,
    useAuthenticate: false,
  },
  sentry: {
    sentryUrl: "https://13f39b8359404ed5aec23655e64ccf78@sentry.lumigame.com/2",
    logIdentifier: "game-round-monitor-service",
    env: "LOCAL",
  },
  metrics: {
    enable: true,
    secretKey: "6c1f0f28-70f2-46ae-b031-22624a6cd8df",
  },
};
