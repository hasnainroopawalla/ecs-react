import * as React from "react";
import {
  EntityManager,
  SystemManager,
  Entity,
  useComponent,
  type ComponentSchema,
  type SignalsSchema,
} from "../../../src";

type MyComponents = ComponentSchema<{
  counter: { count: number };
  label: string;
}>;

type MySignals = SignalsSchema<"click" | "hover">;

const systemManager = new SystemManager<MyComponents, MySignals>();
const entityManager = new EntityManager<MyComponents>();

const counterEntity = entityManager.createEntity();

counterEntity.addComponent("counter", { count: 0 });

systemManager.createSystem({
  name: "counterSystem",
  signals: ["click"],
  fn: ({ entity }) => {
    entity.updateComponent("counter", prevValue => ({
      count: prevValue.count + 1,
    }));
  },
});

export const App: React.FC = () => {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <Button entity={counterEntity} />
      <Display entity={counterEntity} />
    </div>
  );
};

type EntityProps = {
  entity: Entity<MyComponents>;
};

const Button: React.FC<EntityProps> = ({ entity }) => {
  return (
    <button onClick={() => systemManager.signal("click", entity)}>Click</button>
  );
};

const Display: React.FC<EntityProps> = ({ entity }) => {
  const counter = useComponent(entity, "counter");

  return <span>{counter?.count}</span>;
};
