import { fc } from "@fast-check/vitest";

export function check<T>(
  arbitrary: fc.Arbitrary<T>,
  check: (value: T) => boolean,
): void {
  fc.assert(fc.property(arbitrary, check));
}
