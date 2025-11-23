import { Header } from './components/Header'
import { CurrentWeatherCard } from './components/CurrentWeatherCard'
import { TemperatureTrendCard } from './components/TemperatureTrendCard'
import { RecentCitiesCard } from './components/RecentCitiesCard'
import { Footer } from './components/Footer'
import { useWeatherController } from './hooks/useWeatherController'
import { type RangeKey, RANGE_CONFIG } from './constants/range'

export default function App() {
  const c = useWeatherController()

  return (
    <div className="min-h-screen">
      <main className="app">
        <Header
          darkMode={c.darkMode}
          onToggleDarkMode={() => c.setDarkMode(v => !v)}
          unit={c.unit}
          onToggleUnit={() => c.setUnit(u => (u === 'C' ? 'F' : 'C'))}
          onSearch={c.onSearch}
        />

        {c.error && (
          <section className="card" role="alert" style={{ borderLeft: '4px solid #d93025' }}>
            <strong style={{ color: '#d93025' }}>Error:</strong> {c.error}
          </section>
        )}

        {!c.hasSearched && !c.isLoading ? (
          <section className="card">
            <p>Search for a city to see the weather.</p>
          </section>
        ) : (
          <div className="grid">
            <div className="space-y-6">
              <section className="card card-weather">
                <CurrentWeatherCard
                  data={
                    c.currentWeather ?? {
                      city: '—',
                      temp: 0,
                      description: '—',
                      humidity: 0,
                      wind_speed: 0,
                      ts: new Date().toISOString(),
                    }
                  }
                  unit={c.unit}
                  convert={c.convert}
                />
              </section>

              <section className="card">
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    marginBottom: 12,
                    justifyContent: 'space-between',
                  }}
                >
                  <strong className="chart-title">Recent temperature</strong>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {(['5m', '30m', '1h', '1d', '7d'] as RangeKey[]).map(r => (
                      <button
                        key={r}
                        type="button"
                        className={`pill ${c.range === r ? 'active' : ''}`}
                        onClick={() => c.setRange(r)}
                      >
                        {RANGE_CONFIG[r].label}
                      </button>
                    ))}

                    <button
                      type="button"
                      className="pill"
                      onClick={() => c.setTracking(v => !v)}
                      disabled={!c.currentWeather}
                      title="Auto-refresh"
                    >
                      {c.tracking ? 'Stop' : 'Start'}
                    </button>

                    <span className="muted" style={{ fontSize: 12 }}>
                      {c.pollLabel}
                    </span>
                  </div>
                </div>

                <TemperatureTrendCard
                  data={c.trendPrepared}
                  unit={c.unit}
                  range={c.range}
                  isLoading={c.trendLoading}
                />
              </section>
            </div>

            <aside className="space-y-6">
              <RecentCitiesCard
                cities={c.recentCities.slice(0, 5)}
                onPick={(city) => c.onSearch(city)}
              />

            </aside>
          </div>
        )}

        <Footer />
      </main>
    </div>
  )
}
