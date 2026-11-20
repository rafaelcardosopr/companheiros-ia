import { describe, expect, it } from "vitest";
import { ageOn, isAdult } from "./age";

const today = new Date(Date.UTC(2026, 10, 20)); // 20/11/2026

describe("ageOn", () => {
  it("conta o aniversário no próprio dia", () => {
    expect(ageOn("2008-11-20", today)).toBe(18);
  });
  it("não conta antes do aniversário", () => {
    expect(ageOn("2008-11-21", today)).toBe(17);
  });
  it("rejeita datas inválidas", () => {
    expect(ageOn("2008-02-30", today)).toBeNaN();
    expect(ageOn("abc", today)).toBeNaN();
  });
});

describe("isAdult", () => {
  it("aceita 18 anos completos", () => expect(isAdult("2008-11-20", today)).toBe(true));
  it("recusa 17 anos", () => expect(isAdult("2008-11-21", today)).toBe(false));
  it("recusa datas absurdas", () => expect(isAdult("1800-01-01", today)).toBe(false));
});
