import { useEffect, useMemo, useRef, useState } from 'react'
import { getRecent, getWeather, type TrendPoint } from '../api'
import type { Current, RecentCity, SavedItem } from '../types.ts'
import { RANGE_CONFIG, type RangeKey, MIN } from '../constants/range'
import { AUTO_FETCH_ON_LOAD, LAST_CITY_KEY, LAST_CURRENT_KEY, RECENT_KEY, loadJSON, saveJSON, trendKey } from '../utils/cache'

// 👇 cap sincronizat cu backend (limit le=10000)
const MAX_LIMIT = 10000

// Hook care conține toată logica. App devine doar “UI glue”.
export function useWeatherController() {
  // THEME
  const [darkMode, setDarkMode] = useState(true)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // UNIT
  const [unit, setUnit] = useState<'C' | 'F'>('C')
  const convert = (t: number) =>
    unit === 'F' ? Number(((t * 9) / 5 + 32).toFixed(1)) : Number(t.toFixed(1))

  // CURRENT + RECENT SEARCHES
  const [currentWeather, setCurrentWeather] = useState<Current | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [hydratedFromCache, setHydratedFromCache] = useState(false)

  const [recentCities, setRecentCities] = useState<RecentCity[]>(() => {
    const arr = loadJSON<RecentCity[]>(RECENT_KEY) ?? []
    return Array.isArray(arr) ? arr : []
  })
  useEffect(() => {
    saveJSON(RECENT_KEY, recentCities.slice(0, 50))
  }, [recentCities])

  // SAVED
  const [saved, setSaved] = useState<SavedItem[]>([])

  // STATUS
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (!error) return
    const id = setTimeout(() => setError(null), 4000)
    return () => clearTimeout(id)
  }, [error])

  // TREND
  const [trend, setTrend] = useState<TrendPoint[]>([])
  const [trendLoading, setTrendLoading] = useState(false)

  // RANGE / TRACKING
  const [range, setRange] = useState<RangeKey>('5m')
  const { windowMs, fetchLimit, pollMs, label } = RANGE_CONFIG[range]
  const [tracking, setTracking] = useState(false)

  // pentru a detecta schimbarea orașului și a curăța doar atunci
  const prevCityRef = useRef<string | null>(null)

  // Windowing + sort + convert + aliniere cu cardul
  const trendPrepared = useMemo(() => {
    const now = Date.now()
    const from = now - windowMs
    const filtered = trend
      .filter(p => {
        const t = new Date(p.ts).getTime()
        return !Number.isNaN(t) && t >= from && t <= now + 5 * MIN
      })
      .sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime())

    const arr = filtered.map(p => ({ ...p, temp: convert(p.temp) }))
    if (arr.length && currentWeather) {
      arr[arr.length - 1].temp = convert(currentWeather.temp)
    }
    return arr
  }, [trend, unit, currentWeather, windowMs])

  // Boot (o singură dată) — snapshot + trend din cache
  const bootedRef = useRef(false)
  useEffect(() => {
    if (bootedRef.current) return
    bootedRef.current = true

    const snap = loadJSON<Current>(LAST_CURRENT_KEY)
    if (snap?.city) {
      setCurrentWeather(snap)
      setHasSearched(true)
      const cachedTrend = loadJSON<TrendPoint[]>(trendKey(snap.city))
      if (Array.isArray(cachedTrend)) setTrend(cachedTrend)
      setHydratedFromCache(true)
    }

    if (!AUTO_FETCH_ON_LOAD) return

    ;(async () => {
      try {
        const lastCity = (localStorage.getItem(LAST_CITY_KEY) || '').trim()
        if (!lastCity) return
        // DOAR current; trend-ul va fi adus de efectul de mai jos
        const resp = await getWeather(lastCity)
        const nowIso = new Date().toISOString()
        const mapped: Current = {
          city: resp.city,
          temp: resp.temp_c,
          description: resp.description,
          humidity: resp.humidity,
          wind_speed: resp.wind_speed,
          ts: nowIso,
        }
        setCurrentWeather(mapped)
        setHasSearched(true)
        saveJSON(LAST_CITY_KEY, mapped.city)
        saveJSON(LAST_CURRENT_KEY, mapped)
        setHydratedFromCache(false)
      } catch {}
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reîncarcă seria când se schimbă range / oraș
  useEffect(() => {
    if (!currentWeather) return

    // dacă suntem în modul cache-only la load, încearcă trend din cache și NU apela API
    if (hydratedFromCache && !AUTO_FETCH_ON_LOAD) {
      const t = loadJSON<TrendPoint[]>(trendKey(currentWeather.city))
      if (Array.isArray(t)) setTrend(t)
      return
    }

    let mounted = true
    ;(async () => {
      setTrendLoading(true)
      try {
        const currCity = currentWeather.city.trim()
        const cityChanged = (prevCityRef.current || '').toLowerCase() !== currCity.toLowerCase()

        // ✅ curățăm punctele doar când s-a schimbat orașul
        if (cityChanged) {
          setTrend([])
        }

        // ✅ cap la 10.000 pentru a evita 422 de la backend
        const safeLimit = Math.min(fetchLimit, MAX_LIMIT)
        const pts = await getRecent(safeLimit, currCity)
        if (mounted) {
          setTrend(pts)
          saveJSON(trendKey(currCity), pts)
          prevCityRef.current = currCity
        }
      } catch {
        // ❗️ NU goli punctele la eroare; păstrează seria veche
      } finally {
        if (mounted) setTrendLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [fetchLimit, currentWeather?.city, hydratedFromCache])

  // Auto-refresh (Start) — aduce și current, și recent în același tick
  useEffect(() => {
    if (!tracking || !currentWeather) return
    let cancelled = false
    const tick = async () => {
      try {
        const resp = await getWeather(currentWeather.city)
        const nowIso = new Date().toISOString()
        const mapped: Current = {
          city: resp.city,
          temp: resp.temp_c,
          description: resp.description,
          humidity: resp.humidity,
          wind_speed: resp.wind_speed,
          ts: nowIso,
        }
        setCurrentWeather(mapped)
        saveJSON(LAST_CURRENT_KEY, mapped)

        // ✅ cap la 10.000 și aici
        const safeLimit = Math.min(fetchLimit, MAX_LIMIT)
        const pts = await getRecent(safeLimit, currentWeather.city)
        if (!cancelled) {
          setTrend(pts)
          saveJSON(trendKey(currentWeather.city), pts)
        }
      } catch {
        // ignorăm erorile: nu ștergem punctele vechi
      }
    }
    tick()
    const id = setInterval(tick, pollMs)
    return () => { cancelled = true; clearInterval(id) }
  }, [tracking, pollMs, currentWeather?.city, fetchLimit])

  // SEARCH — DOAR current; trend-ul este adus exclusiv de efectul de mai sus
  const onSearch = async (city: string) => {
    const name = (city || '').trim()
    if (!name) return
    setIsLoading(true)
    setError(null)

    try {
      const resp = await getWeather(name)

      // validare defensivă a orașului
      const apiCity = String(resp.city || '').trim()
      const wanted = name.toLowerCase()
      if (!apiCity || apiCity.toLowerCase() !== wanted) {
        throw new Error('City not found')
      }

      const nowIso = new Date().toISOString()
      const mapped: Current = {
        city: apiCity,
        temp: resp.temp_c,
        description: resp.description,
        humidity: resp.humidity,
        wind_speed: resp.wind_speed,
        ts: nowIso,
      }

      setCurrentWeather(mapped)
      setHasSearched(true)
      setHydratedFromCache(false)

      saveJSON(LAST_CITY_KEY, mapped.city)
      saveJSON(LAST_CURRENT_KEY, mapped)

      setRecentCities(prev => {
        const next = [{ city: mapped.city, ts: nowIso }, ...prev.filter(x => x.city.toLowerCase() !== mapped.city.toLowerCase())]
        return next.slice(0, 50)
      })

      // ⛔️ NU mai chemăm aici getRecent — efectul va aduce seria o singură dată
    } catch (e: any) {
      const msg = (e?.message || '').toLowerCase().includes('not found')
        ? 'City not found. Please check the spelling.'
        : (e?.message ?? 'Service unavailable. Try again.')
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // Saved toggle
  const onToggleSaved = (city: string) => {
    setSaved(prev => {
      const exists = prev.find(x => x.city.toLowerCase() === city.toLowerCase())
      if (exists) return prev.filter(x => x.city.toLowerCase() !== city.toLowerCase())
      const temp = currentWeather && currentWeather.city.toLowerCase() === city.toLowerCase() ? currentWeather.temp : 20
      return [...prev, { city, temp }]
    })
  }

  return {
    // state expus
    darkMode, setDarkMode,
    unit, setUnit, convert,

    currentWeather, hasSearched,
    recentCities, saved,

    isLoading, error, setError,

    trendPrepared, trendLoading,

    range, setRange, pollMs, pollLabel: label,
    tracking, setTracking,

    // handlers
    onSearch, onToggleSaved,
  }
}