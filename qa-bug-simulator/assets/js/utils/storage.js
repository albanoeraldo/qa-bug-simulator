const KEY = "qa_bug_simulator_state";

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearState() {
  localStorage.removeItem(KEY);
}
