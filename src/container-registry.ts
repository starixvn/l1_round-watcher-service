import { asClass, asValue, AwilixContainer, createContainer, InjectionMode } from "awilix";
import AppBoostrapHandler from "./handlers/app-boostrap-handler";
import LastResultHandler from "./handlers/last-result-handler";
import WatcherEventHandler from "./watchers/watcher-event-handler";
import WatcherManager from "./watchers/watcher-manager";
import Router from "./routes";

export class ContainerRegistry {
  container: AwilixContainer;

  constructor(defaultInjectionMode: typeof InjectionMode.CLASSIC = InjectionMode.CLASSIC) {
    this.container = createContainer({ injectionMode: defaultInjectionMode });
  }

  register(appConfigs) {
    this.container.register({ appConfigs: asValue(appConfigs) });
    this.container.register({ routers: asClass(Router) });

    this.registerHandlers();
    this.registerWatchers();

    return this.container;
  }

  registerHandlers() {
    this.container.register({ lastResultHandler: asClass(LastResultHandler).singleton() });
    this.container.register({ appBoostrapHandler: asClass(AppBoostrapHandler).singleton() });
  }

  registerWatchers() {
    this.container.register({ watcherManager: asClass(WatcherManager).singleton() });
    this.container.register({ watcherEventHandler: asClass(WatcherEventHandler).singleton() });
  }
}
