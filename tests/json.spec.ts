import type { fc } from "@fast-check/vitest";
import { test } from "@fast-check/vitest";
import {
  isArray,
  isObject,
  isPrimitive,
  type JsonArray,
  type JsonObject,
  type JsonPrimitive,
  type JsonValue,
  type PrimitiveClass,
  type PrimitiveClassFor,
} from "@typed-utils/json";
import { assertType, describe, expect, expectTypeOf } from "vitest";

import { check } from "./support.js";
import { jsons } from "./support/jsons.js";

const notArray = (value: JsonValue) => !isArray(value);
const notObject = (value: JsonValue) => !isObject(value);

const notPrimitive =
  (kind?: PrimitiveClass | undefined) => (value: JsonValue) =>
    !isPrimitive(value, kind);

const ALL_TYPES = [String, Boolean, Number, null] as const;

notPrimitive.except = (kind: PrimitiveClass) => (value: JsonValue) => {
  return ALL_TYPES.every((item) =>
    item === kind ? isPrimitive(value, item) : !isPrimitive(value, item),
  );
};

const JSON_VALUE = {} as JsonValue;

describe("Predicates", () => {
  describe("isPrimitive", () => {
    test("is true when the value is a JsonPrimitive", () => {
      check(jsons.primitive, (primitive) => {
        expectTypeOf(primitive).toEqualTypeOf<JsonPrimitive>();
        return isPrimitive(primitive);
      });

      check(jsons.primitive, notArray);
      check(jsons.primitive, notObject);
    });

    test("type: narrowing JsonValue produces JsonPrimitive", () => {
      if (isPrimitive(JSON_VALUE)) {
        expectTypeOf(JSON_VALUE).toEqualTypeOf<JsonPrimitive>();
      }
    });
  });

  function checkPrimitive<T extends JsonPrimitive>(
    arbitrary: fc.Arbitrary<T>,
    type: PrimitiveClassFor<T>,
  ): void {
    check(arbitrary, (value) => {
      assertType<T>(value);
      return isPrimitive(value, type);
    });

    check(arbitrary, notArray);
    check(arbitrary, notObject);
    check(arbitrary, notPrimitive.except(type));
  }

  describe("isPrimitive(Number)", () => {
    test("is true when the value is a number", () => {
      checkPrimitive(jsons.number, Number);
    });

    test("type: narrowing JsonValue produces JsonPrimitive", () => {
      if (isPrimitive(JSON_VALUE, Number)) {
        expectTypeOf(JSON_VALUE).toEqualTypeOf<number>();
      }
    });
  });

  describe("isPrimitive(String)", () => {
    test("is true when the value is a string", () => {
      checkPrimitive(jsons.string, String);
    });

    test("type: narrowing JsonValue produces JsonPrimitive", () => {
      if (isPrimitive(JSON_VALUE, String)) {
        expectTypeOf(JSON_VALUE).toEqualTypeOf<string>();
      }
    });
  });

  describe("isPrimitive(Boolean)", () => {
    test("is true when the value is a boolean", () => {
      checkPrimitive(jsons.boolean, Boolean);
    });

    test("type: narrowing JsonValue produces JsonPrimitive", () => {
      if (isPrimitive(JSON_VALUE, Boolean)) {
        expectTypeOf(JSON_VALUE).toEqualTypeOf<boolean>();
      }
    });
  });

  describe("isArray", () => {
    test("is true when the value is a JsonArray", () => {
      const arbitrary = jsons.array;
      check(arbitrary, (value) => {
        assertType<JsonArray>(value);
        return isArray(value);
      });

      check(arbitrary, notObject);
      check(arbitrary, notPrimitive());
    });

    test("type: narrowing JsonValue produces JsonArray", () => {
      if (isArray(JSON_VALUE)) {
        expectTypeOf(JSON_VALUE).toEqualTypeOf<JsonArray>();
      }
    });
  });

  describe("isObject", () => {
    test("is true when the value is a JsonObject", () => {
      const arbitrary = jsons.object;
      check(arbitrary, (value) => {
        assertType<JsonObject>(value);
        return isObject(value);
      });

      check(arbitrary, notArray);
      check(arbitrary, notPrimitive());
    });

    test("type: narrowing JsonValue produces JsonArray", () => {
      if (isArray(JSON_VALUE)) {
        expectTypeOf(JSON_VALUE).toEqualTypeOf<JsonArray>();
      }
    });
  });
});

function typeBranch(_description: string, callback: () => void) {
  callback();
}

describe("narrowing", () => {
  describe("narrowing to never", () => {
    test("isPrimitive first", () => {
      if (isPrimitive(JSON_VALUE)) return;
      assertType<JsonObject | JsonArray>(JSON_VALUE);

      typeBranch("isArray first", () => {
        if (isArray(JSON_VALUE)) return;
        expectTypeOf(JSON_VALUE).toEqualTypeOf<JsonObject>();

        if (isObject(JSON_VALUE)) return;
        expectTypeOf(JSON_VALUE).toBeNever();
      });

      typeBranch("isObject first", () => {
        if (isObject(JSON_VALUE)) return;
        expectTypeOf(JSON_VALUE).toEqualTypeOf<JsonArray>();

        if (isArray(JSON_VALUE)) return;
        expectTypeOf(JSON_VALUE).toBeNever();
      });
    });

    test("narrowing one-at-a-time using usePrimitive", () => {
      if (isObject(JSON_VALUE) || isArray(JSON_VALUE)) return;
      expectTypeOf(JSON_VALUE).toEqualTypeOf<JsonPrimitive>();

      if (isPrimitive(JSON_VALUE, String)) return;
      expectTypeOf(JSON_VALUE).toEqualTypeOf<number | boolean | null>();

      if (isPrimitive(JSON_VALUE, Number)) return;
      expectTypeOf(JSON_VALUE).toEqualTypeOf<boolean | null>();

      if (isPrimitive(JSON_VALUE, Boolean)) return;
      expectTypeOf(JSON_VALUE).toEqualTypeOf<null>();

      if (isPrimitive(JSON_VALUE, null)) return;
      expectTypeOf(JSON_VALUE).toBeNever();
    });

    test("narrowing an already narrow type using isPrimitive", () => {
      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers */
      const value = 1 as string | number;

      expect(isPrimitive(value, Boolean)).toBe(false);
      expect(isPrimitive(value, null)).toBe(false);

      if (isPrimitive(value, String)) return;
      expectTypeOf(value).toEqualTypeOf<number>();

      if (isPrimitive(value, Number)) return;
      expectTypeOf(value).toBeNever();
    });
  });

  describe("from JsonValue", () => {
    test("isPrimitive", () => {
      if (isPrimitive(JSON_VALUE)) {
        expectTypeOf(JSON_VALUE).toEqualTypeOf<JsonPrimitive>();
        return;
      }

      expectTypeOf(JSON_VALUE).toEqualTypeOf<JsonArray | JsonObject>();
    });
  });

  describe("from JsonObject | JsonArray", () => {
    const VALUE = {} as JsonObject | JsonArray;

    test("isPrimitive", () => {
      if (isPrimitive(VALUE)) {
        assertType<never>(VALUE);
        return;
      }

      assertType<JsonArray | JsonObject>(VALUE);
    });
  });
});
