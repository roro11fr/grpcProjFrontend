export const mockWeatherData = {
  city: 'Bucharest',
  temp_c: 21,
  description: 'clear sky',
  humidity: 48,
  wind_speed: 3.2,
  feels_like: 20,
  ts: new Date().toISOString(),
}

export const mockRecentCities = ['London','Paris','Madrid','Berlin']

export const mockSavedLocations = [
  { city: 'Suceava', temp: 18 },
  { city: 'Cluj-Napoca', temp: 19 },
]

export const mockTrendData = Array.from({length:8}).map((_, i) => ({
  ts: new Date(Date.now() - (7 - i) * 3 * 60 * 60 * 1000).toISOString(),
  temp_c: 16 + Math.sin(i/1.5)*4 + Math.random()
}))
