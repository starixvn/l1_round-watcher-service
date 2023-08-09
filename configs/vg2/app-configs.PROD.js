export default {
  enabledLogs: true,
  database: {
    url: "mongodb://lmn_backend:%21%23x97%25uYZv%2A%5E%25%3E%7C%2Aqg%40E7FHi%3F9l%7B9r%3CK@10.99.99.53:37101,10.99.99.54:37102/?replicaSet=L2_SabaMain&appName=roundwatcher",
    options: {
      dbName: "minigame",
    },
  },
  notificationApiSettings: {
    url: "http://l2_notification_service_prod:5000/api",
    auth: {
      url: "http://l2_auth_api_prod:5000",
      id: "game-services",
      secret: "gameservices@20luminet&",
      useAuthenticate: true,
    },
    requestTimeout: 10000,
  },
  sentry: {
    sentryUrl: "http://2b5b82bf699543ddb296364568bc30be@10.2.189.50:9009/52",
    logIdentifier: "round-watcher-service",
    env: "PROD",
  },
  metrics: {
    enable: true,
    secretKey: "30d15293-c7de-4c77-9293-b85d6c5bfe1a",
  },
};
