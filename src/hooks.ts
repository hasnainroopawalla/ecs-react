import * as React from "react";
import type { Entity } from "./entity";

/**
 * Subscribes to updates on a specific Component of an Entity.
 *
 * @param entity
 * @param componentName
 * @returns the latest Component value if it exists on the Entity.
 */
export const useComponent = <
  TComponents,
  TComponentName extends keyof TComponents
>(
  entity: Entity<TComponents>,
  componentName: TComponentName
): TComponents[TComponentName] | undefined => {
  const [componentValue, setComponentValue] = React.useState<
    TComponents[TComponentName] | undefined
  >(entity.getComponent(componentName));

  React.useEffect(() => {
    const unsubscribe = entity.onComponentUpdate(componentName, () => {
      const component = entity.getComponent(componentName);
      setComponentValue(component);
    });

    return () => unsubscribe();
  }, [entity, componentName]);

  return componentValue;
};
