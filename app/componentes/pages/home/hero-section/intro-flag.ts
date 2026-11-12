export const INTRO_STORAGE_KEY = "portfolio-gazolla:intro";

const noopSubscribe = () => () => {};

export const subscribeIntroFlag = noopSubscribe;

/** True when the hero intro already played in this browser session. */
export const readIntroPlayed = (): boolean => {
  try {
    return sessionStorage.getItem(INTRO_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
};

export const readIntroPlayedOnServer = (): boolean => false;
