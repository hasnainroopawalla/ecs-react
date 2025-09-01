# react-ecs

A lightweight Entity Component System (ECS) implementation for React applications.

## Installation

```bash
npm install react-ecs
# or
yarn add react-ecs
```

## Overview

`react-ecs` provides a flexible Entity Component System architecture for React applications. It allows you to:

- Create entities with dynamic components
- Define and manage component schemas
- Handle signals for inter-entity communication
- Create systems that react to signals and update components
- Use React hooks to access component data

## Usage

Here's a basic example of using `react-ecs` to create a counter application:

```tsx
import {
  ECS,
  useComponent,
  type ComponentSchema,
  type SignalSchema,
  type WithEntityProps,
} from "react-ecs";

// Define your component types
type MyComponents = ComponentSchema<{
  counter: { count: number };
  label: string;
}>;

// Define your signal types
type MySignals = SignalSchema<"click" | "hover">;

// Create an ECS instance
const ecs = new ECS<MyComponents, MySignals>();

// Create an entity
const counterEntity = ecs.createEntity();
counterEntity.addComponent("counter", { count: 0 });

// Create a system that responds to signals
ecs.createSystem({
  name: "counterSystem",
  signals: ["click"],
  fn: ({ entity }) => {
    entity.updateComponent("counter", prevValue => ({
      count: prevValue.count + 1,
    }));
  },
});

// Create React components that interact with entities
const Button: React.FC<WithEntityProps<MyComponents>> = ({ entity }) => {
  return <button onClick={() => ecs.signal("click", entity)}>Click</button>;
};

const Display: React.FC<WithEntityProps<MyComponents>> = ({ entity }) => {
  const counter = useComponent(entity, "counter");
  return <span>{counter?.count}</span>;
};

// Use in your React app
const App: React.FC = () => {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <Button entity={counterEntity} />
      <Display entity={counterEntity} />
    </div>
  );
};
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
