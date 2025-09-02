import { System } from "../src/system";
import { Entity } from "../src/entity";

type TestComponents = {
  position: { x: number; y: number };
  health: number;
};

describe("System", () => {
  it("should create a system with correct properties", () => {
    const systemFn = ({
      entity: _entity,
    }: {
      entity: Entity<TestComponents>;
    }) => {
      // System logic
    };

    const system = new System<TestComponents, "update">({
      name: "TestSystem",
      fn: systemFn,
      signals: ["update"],
    });

    expect(system.name).toBe("TestSystem");
    expect(system.fn).toBe(systemFn);
    expect(system.signals).toEqual(["update"]);
  });

  it("should execute system function correctly", () => {
    const entity = new Entity<TestComponents>();
    entity.addComponent("position", { x: 0, y: 0 });

    const system = new System<TestComponents, "update">({
      name: "MovementSystem",
      fn: ({ entity }) => {
        const pos = entity.getComponent("position");
        if (pos) {
          entity.updateComponent("position", prev => ({
            x: prev.x + 1,
            y: prev.y + 1,
          }));
        }
      },
      signals: ["update"],
    });

    system.fn({ entity });

    expect(entity.getComponent("position")).toEqual({ x: 1, y: 1 });
  });
});
