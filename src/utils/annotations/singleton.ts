/* eslint-disable @typescript-eslint/no-explicit-any */
import { DecoratorContxt } from "./decorator-contxt";

type Constructor<T> = {
  new (...args: unknown[]): T;
};

export const Singleton: <T extends Constructor<any>>(
  target: T,
  context: DecoratorContxt,
) => T = <T extends Constructor<any>>(target: T, context: DecoratorContxt) => {
  let singleton: T;

  return class {
    constructor(...args: unknown[]) {
      if (singleton) {
        console.warn(
          `Attempted to instantiate singleton ${context.name} more than once`,
        );
        return singleton;
      }

      console.log(`Instantiating singleton ${context.name} for the first time`);

      singleton = new target(...args);
      return singleton;
    }
  } as T;
};
