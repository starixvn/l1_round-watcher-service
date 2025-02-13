export default {
  enabledLogs: true,
  database: {
    url: "mongodb://svc_readonly:SvcReadonly%4022027@10.99.99.187:27201/?replicaSet=SabaUAT&appName=roundwatcher",
    options: {
      dbName: "minigame",
    },
  },
  notificationApiSettings: {
    url: "http://l1-notification-service-uat-service:5000/api",
    auth: {
      url: "http://l1-auth-api-uat-service:5000",
      id: "game-services",
      secret: "gameservices@20luminet&",
      useAuthenticate: true,
    },
    requestTimeout: 10000,
  },
  adminApiSettings: {
    url: "http://l1-admin-api-uat-service:5000/api",
  },
  sentry: {
    sentryUrl: "http://52368c4019044019885440599c180bda@10.2.190.51:9009/2",
    logIdentifier: "round-watcher-service",
    env: "UAT",
  },
  metrics: {
    enable: true,
    secretKey: "6c1f0f28-70f2-46ae-b031-22624a6cd8df",
  },
};
