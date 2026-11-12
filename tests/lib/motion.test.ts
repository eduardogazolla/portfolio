import { duration, ease, spring } from "@/app/lib/motion";
import { fadeUpAnimation, techBadgeAnimation } from "@/app/lib/animations";

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

describe.each([
  ["fadeUpAnimation", fadeUpAnimation],
  ["techBadgeAnimation", techBadgeAnimation],
])("%s", (_name, preset) => {
  it("never animates scale", () => {
    expect(JSON.stringify(preset)).not.toContain("scale");
  });

  it("starts from opacity 0 and y 8", () => {
    expect(preset.initial).toEqual({ opacity: 0, y: 8 });
    expect(preset.exit).toEqual({ opacity: 0, y: 8 });
    expect(preset.whileInView).toEqual({ opacity: 1, y: 0 });
  });

  it("uses the base duration and out easing", () => {
    expect(preset.transition).toEqual({ duration: duration.base, ease: ease.out });
  });
});
