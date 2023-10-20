import { type JsonValue, parseJSON } from "@typed-utils/json";
import * as fc from "fast-check";
import { describe, expect, expectTypeOf, it } from "vitest";

import { jsons } from "./support/jsons.js";

describe("parseJSON", () => {
  it("should parse JSON", () => {
    fc.assert(
      fc.property(jsons.value, (json) => {
        const stringified = JSON.stringify(json);
        const parsed = parseJSON(stringified);

        expect(JSON.stringify(parsed)).toBe(stringified);

        expectTypeOf(parsed).toEqualTypeOf<JsonValue>();
      }),
    );
  });
});
