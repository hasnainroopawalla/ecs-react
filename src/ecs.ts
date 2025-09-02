import { Entity } from "./entity";
import { System } from "./system";
import { EntityManager } from "./entity-manager";
import { SystemManager } from "./system-manager";

type IECS<TComponents extends object, TSignals extends string> = Pick<
  EntityManager<TComponents>,
  "createEntity"
> &
  Pick<
    SystemManager<TComponents, TSignals>,
    "createSystem" | "deleteSystem" | "signal"
  >;

export class ECS<TComponents extends object, TSignals extends string>
  implements IECS<TComponents, TSignals>
{
  private readonly systemManager: SystemManager<TComponents, TSignals>;
  private readonly entityManager: EntityManager<TComponents>;

  constructor() {
    this.systemManager = new SystemManager();
    this.entityManager = new EntityManager();
  }

  public createEntity(): Entity<TComponents> {
    return this.entityManager.createEntity();
  }

  public createSystem(
    ...args: Parameters<SystemManager<TComponents, TSignals>["createSystem"]>
  ): System<TComponents, TSignals> {
    return this.systemManager.createSystem(...args);
  }

  public deleteSystem(
    ...args: Parameters<SystemManager<TComponents, TSignals>["deleteSystem"]>
  ): void {
    return this.systemManager.deleteSystem(...args);
  }

  public signal(
    ...args: Parameters<SystemManager<TComponents, TSignals>["signal"]>
  ) {
    return this.systemManager.signal(...args);
  }
}
