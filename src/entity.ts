import { SignalManager, type Unsubscribe } from "./signal-manager";

export class Entity<TComponents> {
  private readonly components: {
    [K in keyof TComponents]?: TComponents[K];
  };

  private readonly signalManager: SignalManager<keyof TComponents, () => void>;

  constructor() {
    this.components = {};
    this.signalManager = new SignalManager();
  }

  public addComponent<TComponentName extends keyof TComponents>(
    componentName: TComponentName,
    componentValue: TComponents[TComponentName]
  ): void {
    this.components[componentName] = componentValue;
  }

  public getComponent<TComponentName extends keyof TComponents>(
    componentName: TComponentName
  ): TComponents[TComponentName] | undefined {
    return this.components[componentName];
  }

  public updateComponent<TComponentName extends keyof TComponents>(
    componentName: TComponentName,
    componentValueSetter: (
      prevValue: TComponents[TComponentName]
    ) => TComponents[TComponentName]
  ): void {
    const component = this.getComponent(componentName);

    if (!component) {
      return; // TODO: add logging
    }

    this.components[componentName] = componentValueSetter(component);
    this.triggerComponentUpdate(componentName);
  }

  public onComponentUpdate(
    componentName: keyof TComponents,
    callback: () => void
  ): Unsubscribe {
    return this.signalManager.subscribe(componentName, callback);
  }

  private triggerComponentUpdate(componentName: keyof TComponents) {
    this.signalManager.emit(componentName, undefined);
  }
}

export class EntityManager<TComponents> {
  private readonly entities: Set<Entity<TComponents>>;

  constructor() {
    this.entities = new Set();
  }

  public createEntity(): Entity<TComponents> {
    const entity = new Entity<TComponents>();
    this.entities.add(entity);

    return entity;
  }
}
