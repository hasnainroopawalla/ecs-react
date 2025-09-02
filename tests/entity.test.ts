import { Entity } from "../src/entity";

type TestComponents = {
  position: { x: number; y: number };
  health: number;
};

describe("Entity", () => {
  let entity: Entity<TestComponents>;

  beforeEach(() => {
    entity = new Entity<TestComponents>();
  });

  describe("addComponent", () => {
    it("should add a component", () => {
      entity.addComponent("position", { x: 10, y: 20 });
      expect(entity.getComponent("position")).toEqual({ x: 10, y: 20 });
    });

    it("should add multiple components", () => {
      entity.addComponent("position", { x: 10, y: 20 });
      entity.addComponent("health", 100);
      expect(entity.getComponent("position")).toEqual({ x: 10, y: 20 });
      expect(entity.getComponent("health")).toBe(100);
    });
  });

  describe("updateComponent", () => {
    it("should update a component", () => {
      entity.addComponent("position", { x: 10, y: 20 });
      entity.updateComponent("position", prev => ({
        x: prev.x + 5,
        y: prev.y + 5,
      }));
      expect(entity.getComponent("position")).toEqual({ x: 15, y: 25 });
    });

    it("should not update if component does not exist", () => {
      expect(() => {
        entity.updateComponent("health", prev => prev + 10);
      }).toThrow("Component {health} does not exist on the entity.");
    });
  });

  describe("onComponentUpdate", () => {
    it("should trigger callback when component is updated", () => {
      const callback = jest.fn();
      entity.addComponent("health", 100);
      entity.onComponentUpdate("health", callback);
      entity.updateComponent("health", prev => prev + 10);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should allow unsubscribing from updates", () => {
      const callback = jest.fn();
      entity.addComponent("health", 100);
      const unsubscribe = entity.onComponentUpdate("health", callback);
      unsubscribe();
      entity.updateComponent("health", prev => prev + 10);
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
