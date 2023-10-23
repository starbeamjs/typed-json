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
 * @category Readonly
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
 * @category Readonly
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
 * @category Readonly
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
 * | Specified `type` | Narrowed Type |
 * | ---------------- | ------------- |
 * | `String` | `string` |
 * | `Boolean` | `boolean` |
 * | `Number` | `number` |
 * | `null` | `null` |
 *
 *
 * @inline
 * @advanced
 * @category Advanced Usage
 */
export type PrimitiveClass =
  | typeof String
  | typeof Boolean
  | typeof Number
  | null;

export interface Hello {
  primitive: PrimitiveClass;
}

export declare class World {
  static primitive: PrimitiveClass;

  constructor(primitive: PrimitiveClass);

  toPrimitive(): PrimitiveClass;
}

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
 * {@label NARROW_TO_NEVER}
 * @remarks
 *
 * Narrows {@linkcode JsonObject} and {@linkcode JsonArray} to `never`. While
 * it probably doesn't make *typically* make sense to pass a value of a type
 * that's not a {@linkcode JsonObject} or {@linkcode JsonArray}, this overload
 * reflects the reality of the situation.
 *
 * @category Predicates
 * @param value A JSON value.
 * @param primitiveType A {@link PrimitiveClass} or undefined.
 */
export function isPrimitive(
  value: JsonObject | JsonArray,
  primitiveType?: PrimitiveClass,
): value is never;
/**
 * {@label NARROW}
 *
 * Narrows any {@linkcode JsonValue} to a specific type of primitive based upon
 * the {@link PrimitiveClass} passed.
 *
 * | Specified `type` | Narrowed Type |
 * | ---------------- | ------------- |
 * | `String` | `string` |
 * | `Boolean` | `boolean` |
 * | `Number` | `number` |
 * | `null` | `null` |
 */
export function isPrimitive<J extends PrimitiveClass | undefined = undefined>(
  value: JsonValue,
  primitiveType: J,
): value is PrimitiveFor<J, JsonValue>;
/**
 * PRIMARY
 *
 * Determine whether `value` is a primitive value.
 *
 * @remarks
 * You can pass `String`, `Boolean`, or `Number` as the
 * {@link !isPrimitive:PRIMARY | `primitiveType`} parameter.
 *
 * The overloads to `isPrimitive` help you {@link !isPrimitive:NARROW | narrow}
 * the type of a `value`. They also cause `isPrimitive` to
 * {@link !isPrimitive:NARROW_TO_NEVER | narrow to `never`} if you pass a
 * {@linkcode JsonObject} or {@linkcode JsonArray} to it.
 *
 * @label {PRIMARY}
 * @primary
 */
export function isPrimitive(
  value: JsonValue | undefined,
  primitiveType?: PrimitiveClass | undefined,
): value is JsonPrimitive;
export function isPrimitive(
  value: JsonValue | undefined,
  primitiveType?: PrimitiveClass | undefined,
): boolean {
  switch (primitiveType) {
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
