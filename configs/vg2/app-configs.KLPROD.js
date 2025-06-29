export default {
  enabledLogs: true,
  database: {
    url: "mongodb://svc_readonly:%7Ba%22ggV3I%2FU%7CJl%291sdHEbe5x%5EA%7BL%21%3BYYT@10.146.34.26:37101,10.146.34.27:37102/?replicaSet=L2_SabaMain&appName=roundwatcher",
    options: {
      dbName: "minigame",
    },
  },
  notificationApiSettings: {
    url: "http://l2-notification-service-klprod-service:5000/api",
    auth: {
      url: "http://l2-auth-api-klprod-service:5000",
      id: "game-services",
      secret: "gameservices@20luminet&",
      useAuthenticate: true,
    },
    requestTimeout: 10000,
  },
  adminApiSettings: {
    url: "http://l2-admin-api-klprod-service:5000/api",
  },
  sentry: {
    sentryUrl: "http://2b5b82bf699543ddb296364568bc30be@sentry-scklprod-ovs.ops-klprod.gamora.prod/52",
    logIdentifier: "round-watcher-service",
    env: "PROD",
  },
  metrics: {
    enable: true,
    secretKey: "30d15293-c7de-4c77-9293-b85d6c5bfe1a",
  },
};
