/**
 * Hello world.
 *
 * @packageDocumentation
 */

/**
 * A JSON value that represents a primitive type (`string`, `boolean`, `number`,
 * or `null`, but not a {@link JsonObject} or {@link JsonArray}).
 *
 * @category Core Types
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * @alpha
 * @advanced
 * @group readonly
 */
export type ReadonlyJsonArray = readonly JsonValue[];

/**
 * A JSON array (list of {@link JsonValue}).
 *
 * @category Core Types
 */
export type JsonArray = JsonValue[];

/**
 * @alpha
 * @advanced
 * @group readonly
 */
export type ReadonlyJsonObject = Readonly<Record<string, JsonValue>>;

/**
 * A JSON object (keys are strings, values are of {@link JsonValue}).
 *
 * @category Core Types
 */

export type JsonObject = { [key in string]: JsonValue };

/**
 * @category Core Types
 */
export type JsonValue = JsonPrimitive | JsonArray | JsonObject;

/**
 * @alpha
 * @advanced
 */
export type ReadonlyJsonValue = JsonPrimitive | ReadonlyJsonArray | JsonValue;

/**
 * Returns `true` if `value` is a {@linkcode JsonObject}.
 *
 * @category Predicates
 * @param value A JSON value (or undefined).
 */
export function isObject(value: JsonValue | undefined): value is JsonObject {
  return typeof value === "object" && value !== null && !isArray(value);
}

/**
 * Returns `true` if `value` is a {@linkcode JsonArray}.
 *
 * @remarks
 * This predicate narrows the type of `value` to `JsonArray`.
 *
 * @category Predicates
 * @param value A JSON value (or undefined).
 */
export function isArray(value: JsonValue | undefined): value is JsonArray {
  return Array.isArray(value);
}

/**
 * A JavaScript value that represents a primitive type.
 *
 *
 * @remarks
 * - `String` for `string`
 * - `Boolean` for `boolean`
 * - `Number` for `number`
 * - `null`
 *
 * @advanced
 * @category Advanced Usage
 */
export type PrimitiveClass =
  | typeof String
  | typeof Boolean
  | typeof Number
  | null;

/**
 * Get the {@link PrimitiveClass} for a given subtype of {@link JsonValue}.
 *
 * @advanced
 * @category Advanced Usage
 */
export type PrimitiveClassFor<J extends JsonValue> = J extends string
  ? typeof String
  : J extends boolean
  ? typeof Boolean
  : J extends number
  ? typeof Number
  : J extends null
  ? null
  : never;

/**
 * @advanced
 * @category Advanced Usage
 */
export type PrimitiveFor<
  T extends PrimitiveClass | undefined,
  J extends JsonValue,
> = T extends undefined
  ? JsonPrimitive
  : J extends JsonPrimitive
  ? T extends typeof String
    ? string
    : T extends typeof Boolean
    ? boolean
    : T extends typeof Number
    ? number
    : T
  : never;

/**
 * @category Predicates
 */
export function isPrimitive(
  value: JsonObject | JsonArray,
  type?: PrimitiveClass,
): value is never;
export function isPrimitive<J extends PrimitiveClass | undefined = undefined>(
  value: JsonValue,
  type?: J,
): value is PrimitiveFor<J, JsonValue>;
export function isPrimitive<
  J extends JsonValue,
  T extends PrimitiveClassFor<J>,
>(value: J | undefined, type?: T | undefined): boolean {
  switch (type) {
    case undefined:
      return (
        value === null ||
        typeof value === "boolean" ||
        typeof value === "number" ||
        typeof value === "string"
      );

    case Boolean:
      return typeof value === "boolean";
    case Number:
      return typeof value === "number";
    case String:
      return typeof value === "string";
    default:
      return value === null;
  }
}

/**
 * @category Parse
 */
export function parseJSON(source: string): JsonValue {
  return JSON.parse(source) as JsonValue;
}
