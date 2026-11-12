import { createContactSchema } from "@/app/lib/contact-schema";

const valid = {
  name: "Maria Silva",
  email: "maria@empresa.com",
  message: "Oi, Eduardo!",
};

type Locale = "pt" | "en";
const locales: Locale[] = ["pt", "en"];

const messagesFor = (
  locale: Locale,
  input: Record<string, unknown>,
  field: string
) => {
  const result = createContactSchema(locale).safeParse({ ...valid, ...input });
  if (result.success) return [];
  return result.error.issues
    .filter((i) => i.path[0] === field)
    .map((i) => i.message);
};

describe("createContactSchema", () => {
  it("accepts a valid body and trims name, email and message", () => {
    const result = createContactSchema("pt").safeParse({
      name: "  Maria Silva  ",
      email: " maria@empresa.com ",
      message: "  Oi!  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: "Maria Silva",
        email: "maria@empresa.com",
        message: "Oi!",
      });
    }
  });

  it("strips unknown keys", () => {
    const result = createContactSchema("pt").parse({ ...valid, extra: "x" });
    expect(result).not.toHaveProperty("extra");
  });

  describe.each(locales)("locale %s", (locale) => {
    it("name: trimmed 3-100 characters", () => {
      expect(messagesFor(locale, { name: "Ana" }, "name")).toEqual([]);
      expect(messagesFor(locale, { name: "a".repeat(100) }, "name")).toEqual([]);
      expect(messagesFor(locale, { name: "  ab  " }, "name")).toHaveLength(1);
      expect(messagesFor(locale, { name: "   " }, "name")).toHaveLength(1);
      expect(messagesFor(locale, { name: "a".repeat(101) }, "name")).toHaveLength(1);
      expect(messagesFor(locale, { name: undefined }, "name")).toHaveLength(1);
    });

    it("message: trimmed 1-500 characters", () => {
      expect(messagesFor(locale, { message: "x" }, "message")).toEqual([]);
      expect(messagesFor(locale, { message: "x".repeat(500) }, "message")).toEqual([]);
      expect(messagesFor(locale, { message: "   " }, "message")).toHaveLength(1);
      expect(messagesFor(locale, { message: "x".repeat(501) }, "message")).toHaveLength(1);
    });

    it("email: up to 254 characters", () => {
      const ok = `${"a".repeat(64)}@${"b".repeat(63)}.${"c".repeat(63)}.com`;
      expect(ok.length).toBeLessThanOrEqual(254);
      expect(messagesFor(locale, { email: ok }, "email")).toEqual([]);
      const long = `${"a".repeat(250)}@x.com`;
      expect(messagesFor(locale, { email: long }, "email")).toHaveLength(1);
    });

    it.each([
      ["empty", ""],
      ["missing @", "mariaempresa.com"],
      ["missing local part", "@gmail.com"],
      ["missing domain", "maria@"],
      ["missing TLD", "maria@gmail"],
      ["trailing dot", "maria@gmail."],
      ["spaces inside", "ma ria@gmail.com"],
      ["two @", "a@b@gmail.com"],
    ])("email %s -> exactly one message", (_label, email) => {
      expect(messagesFor(locale, { email }, "email")).toHaveLength(1);
    });

    it("every error message is non-empty and teaches a fix", () => {
      const bad = createContactSchema(locale).safeParse({
        name: "a",
        email: "x",
        message: "",
      });
      expect(bad.success).toBe(false);
      if (!bad.success) {
        for (const issue of bad.error.issues) {
          expect(issue.message.length).toBeGreaterThan(15);
          expect(issue.message).not.toMatch(/^(Required|Invalid)/);
        }
      }
    });
  });

  it("distinguishes email problems with distinct PT messages", () => {
    const msg = (email: string) => messagesFor("pt", { email }, "email")[0];
    expect(msg("maria@")).toBe("Falta o domínio. Use algo como nome@gmail.com.");
    const all = [
      msg(""),
      msg("mariaempresa.com"),
      msg("@gmail.com"),
      msg("maria@"),
      msg("maria@gmail"),
      msg("ma ria@gmail.com"),
    ];
    expect(new Set(all).size).toBe(all.length);
  });

  it("distinguishes email problems with distinct EN messages", () => {
    const msg = (email: string) => messagesFor("en", { email }, "email")[0];
    expect(msg("maria@")).toBe(
      "The domain is missing. Use something like name@gmail.com."
    );
    expect(msg("mariaempresa.com")).toMatch(/@/);
  });
});
