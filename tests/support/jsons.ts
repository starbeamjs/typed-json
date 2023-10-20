import { fc } from "@fast-check/vitest";
import type {
  JsonArray,
  JsonObject,
  JsonPrimitive,
  JsonValue,
} from "@typed-utils/json";

export const jsons = fc.letrec((tie) => ({
  number: fc.double({ noDefaultInfinity: true, noNaN: true }),
  string: fc.string(),
  boolean: fc.boolean(),
  null: fc.constant(null),
  primitive: fc.oneof(
    tie("boolean"),
    tie("number"),
    tie("string"),
    tie("null"),
  ) as fc.Arbitrary<JsonPrimitive>,
  object: fc.dictionary(fc.string(), tie("value")) as fc.Arbitrary<JsonObject>,
  array: fc.array(tie("value")) as fc.Arbitrary<JsonArray>,
  value: fc.oneof(
    tie("primitive"),
    tie("object"),
    tie("array"),
  ) as fc.Arbitrary<JsonValue>,
}));
