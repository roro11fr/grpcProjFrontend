import { useState } from 'react'

type Props = {
  darkMode: boolean
  onToggleDarkMode: () => void
  unit: 'C' | 'F'
  onToggleUnit: () => void
  onSearch: (city: string) => Promise<void> | void
}

export function Header({ darkMode, onToggleDarkMode, unit, onToggleUnit, onSearch }: Props) {
  const [city, setCity] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(city)
  }

  return (
    <header className="header">
      <h1>WeatherNow</h1>
      <form onSubmit={submit} className="searchbar">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search for a city..."
        />
        <button type="submit">Get Weather</button>
      </form>
      <div className="searchbar">
        <button type="button" onClick={onToggleUnit}>°{unit}</button>
        <button type="button" onClick={onToggleDarkMode}>{darkMode ? 'Light' : 'Dark'}</button>
      </div>
    </header>
  )
}
