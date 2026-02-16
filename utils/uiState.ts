
const STALE_TIME = 30 * 60 * 1000; // 30 minutes default

interface StoredState<T> {
  ts: number;
  data: T;
}

/**
 * Saves UI state to sessionStorage to persist during "Back" navigation.
 */
export const saveUIState = (key: string, state: any): void => {
  const payload: StoredState<any> = {
    ts: Date.now(),
    data: state
  };
  sessionStorage.setItem(`ui_state_${key}`, JSON.stringify(payload));
};

/**
 * Loads persisted UI state if it exists and hasn't expired.
 */
export const loadUIState = <T>(key: string, staleMs: number = STALE_TIME): T | null => {
  const raw = sessionStorage.getItem(`ui_state_${key}`);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredState<T>;
    if (Date.now() - parsed.ts > staleMs) {
      sessionStorage.removeItem(`ui_state_${key}`);
      return null;
    }
    return parsed.data;
  } catch (e) {
    return null;
  }
};

/**
 * Force clear specific UI state.
 */
export const clearUIState = (key: string): void => {
  sessionStorage.removeItem(`ui_state_${key}`);
};
