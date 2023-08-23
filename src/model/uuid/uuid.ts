import { Optional } from "../optional/optional";

export class UUID {
  private static readonly UUID_REGEX: RegExp =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  public static random(): UUID {
    return new UUID(crypto.randomUUID());
  }

  public static of(value: string): Optional<UUID> {
    return UUID.UUID_REGEX.test(value)
      ? Optional.of(new UUID(value))
      : Optional.empty();
  }

  private constructor(private readonly _value: string) {}

  public get value(): string {
    return this._value;
  }

  public equals(other: UUID): boolean {
    return other && this._value == other._value;
  }
}
