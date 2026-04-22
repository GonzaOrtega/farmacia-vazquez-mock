/**
 * Tests for lib/format.ts — specifically the fmtPrice function.
 *
 * fmtPrice is a one-liner: "$" + n.toLocaleString("es-AR"). Argentine locale
 * uses a period as the thousands separator and a comma as the decimal separator,
 * so 15000 renders as "$15.000" and 1234.56 renders as "$1.234,56".
 *
 * What would break these tests: changing the locale string, adding/removing the
 * "$" prefix, or wrapping the number with Intl.NumberFormat using different options.
 * What these tests do NOT cover: currency formatting beyond the $ prefix (e.g., no
 * "ARS" symbol, no sign placement for negatives beyond the current behavior).
 */
import { describe, expect, it } from "vitest";
import { fmtPrice } from "./format";

// "Arrange-Act-Assert" pattern: each test sets up data (Arrange),
// calls the function under test (Act), then checks the result (Assert).
// For pure functions like fmtPrice the three phases often collapse into one line.

describe("fmtPrice", () => {
  it("formats zero as $0", () => {
    expect(fmtPrice(0)).toBe("$0");
  });

  it("uses a period as the thousands separator for Argentine locale (es-AR)", () => {
    // 15000 → "$15.000" — note the period, not a comma
    expect(fmtPrice(15000)).toBe("$15.000");
  });

  it("uses a comma as the decimal separator (es-AR) and preserves decimal places", () => {
    // 1234.56 → "$1.234,56" — period for thousands, comma for decimals
    expect(fmtPrice(1234.56)).toBe("$1.234,56");
  });

  it("regression-locks the current behavior for negative numbers: prefix is $-n not -$n", () => {
    // The implementation does not special-case negatives; toLocaleString produces
    // "-50" and we prepend "$", giving "$-50". If the design later requires "-$50"
    // this test will fail intentionally — that's the point.
    expect(fmtPrice(-50)).toBe("$-50");
  });

  it("formats a large round price correctly", () => {
    // Verify a real product price from the dataset (Eau de Parfum = 29900)
    expect(fmtPrice(29900)).toBe("$29.900");
  });
});
