export default {
  enabledLogs: true,
  database: {
    url: "mongodb://svc_readonly:svcReadonly@10.10.50.12:39101,10.10.50.13:39101,10.10.50.14:39101/?replicaSet=L1pLocal&appName=roundwatcher",
    options: {
      dbName: "minigame",
    },
  },
  notificationApiSettings: {
    url: "http://l1-notification-service-local1-service:5000/api",
    auth: {
      url: "http://l1-auth-api-local1-service:5000",
      id: "game-services",
      secret: "gameservices@20luminet&",
      useAuthenticate: true,
    },
    requestTimeout: 10000,
  },
  adminApiSettings: {
    url: "http://l1-admin-api-local1-service:5000/api",
  },
  sentry: {
    sentryUrl: "https://13f39b8359404ed5aec23655e64ccf78@sentry.lumigame.com/2",
    logIdentifier: "round-watcher-service",
    env: "LOCAL_1",
  },
  metrics: {
    enable: true,
    secretKey: "6c1f0f28-70f2-46ae-b031-22624a6cd8df",
  },
};
