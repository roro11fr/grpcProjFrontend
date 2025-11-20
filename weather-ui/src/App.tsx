import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { CurrentWeatherCard } from './components/CurrentWeatherCard'
import { TemperatureTrendCard } from './components/TemperatureTrendCard'
import { RecentCitiesCard } from './components/RecentCitiesCard'
import { SavedLocationsCard } from './components/SavedLocationsCard'
import { Footer } from './components/Footer'
import {
  mockWeatherData,
  mockRecentCities,
  mockSavedLocations,
  mockTrendData,
} from './data/mockData'

export default function App() {
  // THEME
  const [darkMode, setDarkMode] = useState<boolean>(true)
  useEffect(() => {
    // comutăm clasa `dark` pe <html> ca să funcționeze peste tot
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // STATE
  const [unit, setUnit] = useState<'C' | 'F'>('C')
  const [currentWeather, setCurrentWeather] = useState(mockWeatherData)
  const [recent, setRecent] = useState(mockRecentCities)
  const [saved, setSaved] = useState(mockSavedLocations)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(true)

  // HELPERS
  const convert = (t: number) =>
    unit === 'F' ? Math.round(t * 9 / 5 + 32) : Math.round(t)

  const onSearch = (city: string) => {
    const name = (city || '').trim()
    if (!name) return
    setIsLoading(true)
    setError(null)

    // simulare call
    setTimeout(() => {
      if (name.toLowerCase() === 'error') {
        setError('City not found / service unavailable')
        setIsLoading(false)
        return
      }
      setCurrentWeather({
        ...currentWeather,
        city: name,
        ts: new Date().toISOString(),
      })
      if (!recent.includes(name)) setRecent([name, ...recent].slice(0, 5))
      setHasSearched(true)
      setIsLoading(false)
    }, 600)
  }

  const onPickCity = (c: string) => onSearch(c)

  const onToggleSaved = (city: string) => {
    setSaved(prev => {
      const exists = prev.find(x => x.city === city)
      if (exists) return prev.filter(x => x.city !== city)
      return [...prev, { city, temp: 20 }]
    })
  }

  return (
    <div className="min-h-screen">
      <main className="app">
        <Header
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(v => !v)}
          unit={unit}
          onToggleUnit={() => setUnit(u => (u === 'C' ? 'F' : 'C'))}
          onSearch={onSearch}
        />

        {!hasSearched && !isLoading ? (
          <section className="card">
            <p>Search for a city to see the weather.</p>
          </section>
        ) : error ? (
          <section className="card" role="alert">
            <strong>Error:</strong> {error}
          </section>
        ) : (
          <div className="grid">
            {/* Col principal */}
            <div className="space-y-6">
              <div className="card card-weather">
                <CurrentWeatherCard
                  data={currentWeather}
                  unit={unit}
                  convert={convert}
                />
              </div>

              <div className="card">
                <TemperatureTrendCard data={mockTrendData} />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="card">
                <RecentCitiesCard
                  cities={recent}
                  onPick={onPickCity}
                  isLoading={isLoading}
                />
              </div>

              <div className="card">
                <SavedLocationsCard
                  items={saved}
                  unit={unit}
                  onToggleSaved={onToggleSaved}
                />
              </div>
            </aside>
          </div>
        )}

        <Footer />
      </main>
    </div>
  )
}
