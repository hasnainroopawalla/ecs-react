import { SignalManager } from "../src/signal-manager";

describe("SignalManager", () => {
  let signalManager: SignalManager<string, (value: number) => void>;

  beforeEach(() => {
    signalManager = new SignalManager();
  });

  describe("subscribe and emit", () => {
    it("should call subscribed callbacks when signal is emitted", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      signalManager.subscribe("test", callback1);
      signalManager.subscribe("test", callback2);
      signalManager.emit("test", 42);

      expect(callback1).toHaveBeenCalledWith(42);
      expect(callback2).toHaveBeenCalledWith(42);
    });

    it("should not call unsubscribed callbacks", () => {
      const callback = jest.fn();
      const unsubscribe = signalManager.subscribe("test", callback);

      unsubscribe();
      signalManager.emit("test", 42);

      expect(callback).not.toHaveBeenCalled();
    });

    it("should handle multiple signals independently", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      signalManager.subscribe("signal1", callback1);
      signalManager.subscribe("signal2", callback2);

      signalManager.emit("signal1", 10);
      expect(callback1).toHaveBeenCalledWith(10);
      expect(callback2).not.toHaveBeenCalled();

      signalManager.emit("signal2", 20);
      expect(callback2).toHaveBeenCalledWith(20);
      expect(callback1).toHaveBeenCalledTimes(1);
    });
  });
});
