export const RECENT_KEY = 'weathernow_recent_cities'
export const LAST_CITY_KEY = 'weathernow_last_city'
export const LAST_CURRENT_KEY = 'weathernow_last_current'
const LAST_TREND_PREFIX = 'weathernow_last_trend__'

export const trendKey = (city: string) =>
  `${LAST_TREND_PREFIX}${(city || '').toLowerCase()}`

export const AUTO_FETCH_ON_LOAD = false

export function loadJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function saveJSON(key: string, val: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch {}
}
