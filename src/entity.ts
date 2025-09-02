import { SignalManager } from "./signal-manager";
import type { Unsubscribe } from "./types";

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
      throw new Error(
        `Component {${componentName.toString()}} does not exist on the entity.`
      );
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
