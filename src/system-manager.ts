import type { Entity } from "./entity";
import { SignalManager } from "./signal-manager";
import { type ISystemProps, System } from "./system";
import type { Unsubscribe } from "./types";

export class SystemManager<TComponents, TSignal extends string> {
  private readonly systems: Set<System<TComponents, TSignal>>;

  private readonly signalManager: SignalManager<
    TSignal,
    ISystemProps<TComponents, TSignal>["fn"]
  >;

  private readonly unsubscribers: Map<string /* systemName */, Unsubscribe[]>;

  constructor() {
    this.systems = new Set();
    this.signalManager = new SignalManager();

    this.unsubscribers = new Map();
  }

  /**
   * Creates a standalone System.
   *
   * @param name a unique name for the system.
   * @param fn the callback to be executed when the system is triggered.
   * @param signals a list of signals that the system reacts to.
   * @returns
   */
  public createSystem(
    props: ISystemProps<TComponents, TSignal>
  ): System<TComponents, TSignal> {
    const system = new System(props);

    const unsubscribers: Unsubscribe[] = [];

    props.signals.forEach(signal => {
      const unsubscribe = this.signalManager.subscribe(signal, props.fn);
      unsubscribers.push(unsubscribe);
    });

    this.unsubscribers.set(props.name, unsubscribers);
    this.systems.add(system);

    return system;
  }

  /**
   * Deletes an existing system if it exists.
   *
   * @param name the name of the system to be deleted.
   */
  public deleteSystem(name: string): void {
    this.unsubscribers.get(name)?.forEach(unsubscribe => unsubscribe());
    this.deleteSystemByName(name);
  }

  /**
   * Triggers a Signal that propagates through the ECS and
   * executes the appropriate systems.
   *
   * @param name the name of the Signal to be triggered.
   * @param entity the entity involved in Signal trigger.
   */
  public signal(name: TSignal, entity: Entity<TComponents>): void {
    this.signalManager.emit(name, { entity });
  }

  private deleteSystemByName(name: string): void {
    for (const system of this.systems) {
      if (system.name === name) {
        this.systems.delete(system);
        break;
      }
    }
  }
}
