import type { Entity } from "./entity";

export type ISystemProps<TComponents, TSignal> = {
  name: string;
  fn: (args: { entity: Entity<TComponents> }) => void;
  signals: TSignal[];
};

export class System<TComponents, TSignal extends string> {
  public readonly name: ISystemProps<TComponents, TSignal>["name"];
  public readonly fn: ISystemProps<TComponents, TSignal>["fn"];
  public readonly signals: ISystemProps<TComponents, TSignal>["signals"];

  constructor(props: ISystemProps<TComponents, TSignal>) {
    this.name = props.name;
    this.fn = props.fn;
    this.signals = props.signals;
  }
}
