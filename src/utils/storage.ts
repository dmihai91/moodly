export function saveState(key: string, state: any) {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state:', error);
  }
}

export function loadState(key: string) {
  try {
    const state = localStorage.getItem(key);
    return state ? JSON.parse(state) : null;
  } catch (error) {
    console.error('Error loading state:', error);
    return null;
  }
}