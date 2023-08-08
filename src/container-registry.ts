import { asClass, asValue, AwilixContainer, createContainer, InjectionMode } from "awilix";
import LastResultHandler from "./handlers/last-result-handler";
import WatcherManager from "./watchers/watcher-manager";
import AppBoostrapHandler from "./handlers/app-boostrap-handler";
import RoundBaseGameWatcher from "./watchers/round-base-game-watcher";
import WatcherEventHandler from "./watchers/watcher-event-handler";

export class ContainerRegistry {
  container: AwilixContainer;

  constructor(defaultInjectionMode: typeof InjectionMode.CLASSIC = InjectionMode.CLASSIC) {
    this.container = createContainer({ injectionMode: defaultInjectionMode });
  }

  register(appConfigs) {
    this.container.register({ appConfigs: asValue(appConfigs) });

    this.registerHandlers();
    this.registerWatchers();

    return this.container;
  }

  registerHandlers() {
    this.container.register({ appBoostrapHandler: asClass(AppBoostrapHandler).singleton() });
    this.container.register({ lastResultHandler: asClass(LastResultHandler).singleton() });
  }

  registerWatchers() {
    this.container.register({ watcherManager: asClass(WatcherManager).singleton() });
    this.container.register({ roundBaseGameWatcher: asClass(RoundBaseGameWatcher).singleton() });
    this.container.register({ watcherEventHandler: asClass(WatcherEventHandler).singleton() });
  }
}
