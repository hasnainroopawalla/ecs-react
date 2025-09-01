import type { Entity } from "./entity";

export type ComponentSchema<TComponents extends object> = TComponents;

export type SignalSchema<TSignals extends string> = TSignals;

export type WithEntityProps<
  TComponents extends object,
  TProps = object
> = TProps & {
  entity: Entity<TComponents>;
};

export type Unsubscribe = () => void;
