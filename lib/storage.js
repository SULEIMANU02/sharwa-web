export const storage = {
  get(key, fallback = null) {
    if (typeof window === 'undefined') return fallback
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return fallback
      
      // Try to parse as JSON, if it fails return the raw string
      try {
        return JSON.parse(raw)
      } catch {
        return raw
      }
    } catch {
      return fallback
    }
  },
  set(key, value) {
    if (typeof window === 'undefined') return
    try {
      // If value is a string, store it directly, otherwise JSON stringify
      const toStore = typeof value === 'string' ? value : JSON.stringify(value)
      localStorage.setItem(key, toStore)
    } catch {}
  },
  remove(key) {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch {}
  }
}
