export interface DecoratorContxt {
  kind: string;
  name: string | undefined;
  addInitializer(initializer: () => void): void;
}
