export const INTRO_STORAGE_KEY = "portfolio-gazolla:intro";

/**
 * Constant script inlined in <head> (app/layout.tsx). It runs before first paint and,
 * only when the intro should play (no reduced motion, flag absent in sessionStorage),
 * sets <html data-intro="play">. The hidden initial states in globals.css apply only
 * under that attribute, so content stays visible without JS and for repeat visits.
 * The 4 s timer is a last-resort fallback so content can never stay hidden.
 * Static string: no user or request data is interpolated.
 */
export const INTRO_BOOT_SCRIPT = `(function(){try{var d=document.documentElement;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(window.sessionStorage.getItem("${INTRO_STORAGE_KEY}")!==null)return;d.dataset.intro="play";window.setTimeout(function(){delete d.dataset.intro},4000)}catch(e){}})();`;

/** Records that the intro started in this browser session. Storage may be blocked. */
export const markIntroPlayed = (): void => {
  try {
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    // Storage unavailable: the intro may replay on the next visit, which is harmless.
  }
};
