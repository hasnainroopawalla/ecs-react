import * as React from "react";
import {
  ECS,
  useComponent,
  type ComponentSchema,
  type SignalSchema,
  type WithEntityProps,
} from "ecs-react";

type MyComponents = ComponentSchema<{
  counter: { count: number };
  label: string;
}>;

type MySignals = SignalSchema<"click" | "hover">;

const ecs = new ECS<MyComponents, MySignals>();

const counterEntity = ecs.createEntity();

counterEntity.addComponent("counter", { count: 0 });

ecs.createSystem({
  name: "counterSystem",
  signals: ["click"],
  fn: ({ entity }) => {
    entity.updateComponent("counter", prevValue => ({
      count: prevValue.count + 1,
    }));
  },
});

const Button: React.FC<WithEntityProps<MyComponents>> = ({ entity }) => {
  return <button onClick={() => ecs.signal("click", entity)}>Click</button>;
};

const Display: React.FC<WithEntityProps<MyComponents>> = ({ entity }) => {
  const counter = useComponent(entity, "counter");

  return <span>{counter?.count}</span>;
};

export const App: React.FC = () => {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <Button entity={counterEntity} />
      <Display entity={counterEntity} />
    </div>
  );
};
