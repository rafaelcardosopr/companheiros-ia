import { describe, expect, it } from "vitest";
import { validateCharacter } from "./validation";

const base = {
  name: "Lívia",
  age: "27",
  archetype: "Confiante",
  relationship: "Paquera",
  appearance: "Mulher adulta, cabelo castanho",
  tags: "Praia, Música, praia",
};

describe("validateCharacter", () => {
  it("aceita um personagem adulto válido e normaliza as tags", () => {
    const r = validateCharacter(base);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.tags).toEqual(["praia", "música"]);
  });

  it("recusa idade abaixo de 18", () => {
    const r = validateCharacter({ ...base, age: "17" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.fieldErrors?.age).toMatch(/mínima/);
  });

  it.each([
    ["appearance", "parece uma colegial"],
    ["backstory", "Ela tem 16 anos"],
    ["backstory", "estuda no ensino médio"],
    ["tags", "teen"],
    ["backstory", "a 15-year-old girl"],
    ["personality", "com apenas 17 anos"],
    ["appearance", "estilo lolí"],
  ])("recusa referência a menor em %s: %s", (field, value) => {
    const r = validateCharacter({ ...base, [field]: value });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/adultos/);
  });

  it("não confunde palavras parecidas", () => {
    expect(validateCharacter({ ...base, backstory: "Tem 26 anos e mora em Kidderminster" }).ok).toBe(true);
    expect(validateCharacter({ ...base, backstory: "Trabalha há 9 anos como bombeiro" }).ok).toBe(true);
    expect(validateCharacter({ ...base, backstory: "Médica com 5 anos de carreira" }).ok).toBe(true);
  });

  it("recusa pessoas reais e famosas", () => {
    const r = validateCharacter({ ...base, name: "Taylor Swift" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/pessoas reais/);
  });
});
