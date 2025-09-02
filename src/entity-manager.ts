import { Entity } from "./entity";

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
