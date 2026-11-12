import { duration, ease, spring } from "@/app/lib/motion";

describe("motion tokens", () => {
  it("exposes durations in seconds", () => {
    expect(duration).toEqual({ fast: 0.14, base: 0.22, slow: 0.7 });
  });

  it("exposes easing curves", () => {
    expect(ease.out).toEqual([0.22, 1, 0.36, 1]);
    expect(ease.inOut).toEqual([0.65, 0, 0.35, 1]);
  });

  it("exposes spring presets", () => {
    expect(spring.ui).toEqual({ type: "spring", stiffness: 500, damping: 35 });
    expect(spring.cursor).toEqual({ type: "spring", stiffness: 300, damping: 30 });
  });
});
