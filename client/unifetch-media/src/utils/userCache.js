const USER_CACHE_KEY = "unifetch_user";

export function getCachedUser() {
  try {
    const cached = sessionStorage.getItem(USER_CACHE_KEY);

    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

export function setCachedUser(user) {
  try {
    sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
  } catch {
    // Ignore storage errors
  }
}

export function clearCachedUser() {
  try {
    sessionStorage.removeItem(USER_CACHE_KEY);
  } catch {
    // Ignore storage errors
  }
}
