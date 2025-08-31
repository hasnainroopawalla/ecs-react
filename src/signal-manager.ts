export type Unsubscribe = () => void;

export class SignalManager<
  TSignal extends PropertyKey,
  TCallback extends (args: never) => void
> {
  private readonly subscriptions: Map<TSignal, Set<TCallback>>;

  constructor() {
    this.subscriptions = new Map();
  }

  public subscribe(signal: TSignal, callback: TCallback): Unsubscribe {
    const callbacks = this.subscriptions.get(signal) ?? new Set();
    callbacks.add(callback);

    this.subscriptions.set(signal, callbacks);

    return () => {
      this.subscriptions.get(signal)?.delete(callback);
    };
  }

  public emit(eventName: TSignal, args: Parameters<TCallback>[0]): void {
    this.subscriptions.get(eventName)?.forEach(callback => callback(args));
  }
}
