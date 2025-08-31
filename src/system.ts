import type { Entity } from "./entity";
import { SignalManager, type Unsubscribe } from "./signal-manager";

type ISystemProps<TComponents, TSignal> = {
  name: string;
  fn: (args: { entity: Entity<TComponents> }) => void;
  signals: TSignal[];
};

export class System<TComponents, TSignal> {
  public readonly name: ISystemProps<TComponents, TSignal>["name"];
  public readonly fn: ISystemProps<TComponents, TSignal>["fn"];
  public readonly signals: ISystemProps<TComponents, TSignal>["signals"];

  constructor(props: ISystemProps<TComponents, TSignal>) {
    this.name = props.name;
    this.fn = props.fn;
    this.signals = props.signals;
  }
}

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

  public deleteSystem(name: string): void {
    this.unsubscribers.get(name)?.forEach(unsubscribe => unsubscribe());

    // TODO delete from Set
    // this.systems.delete(name)
  }

  public signal(name: TSignal, entity: Entity<TComponents>): void {
    this.signalManager.emit(name, { entity });
  }
}
