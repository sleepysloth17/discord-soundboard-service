export class Optional<T> {
  public static of<U>(value: U): Optional<U> {
    return new Optional(value);
  }

  public static empty<U>(): Optional<U> {
    return new Optional();
  }

  private readonly _value: T;

  private constructor(_value?: T) {
    this._value = typeof _value !== "undefined" ? _value : null; // TODO - check we don't need ot check for anything else
  }

  public get(): T {
    return this._value;
  }

  public orElse(value: T): T {
    return this.get() || value;
  }

  public map<U>(callback: (value: T) => U): Optional<U> {
    if (this._value == null) {
      return Optional.empty();
    }

    return Optional.of(callback(this._value));
  }

  public ifPresent(callback: (value: T) => void): void {
    if (this._value != null) {
      callback(this._value);
    }
  }

  public ifPresentOrElse(
    populatedCallback: (value: T) => void,
    emptyCallback: () => void,
  ): void {
    if (this._value != null) {
      populatedCallback(this._value);
    } else {
      emptyCallback();
    }
  }
}
