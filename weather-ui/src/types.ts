export type Current = {
  city: string
  temp: number
  description: string
  humidity: number
  wind_speed: number
  ts: string
}

export type SavedItem = { city: string; temp: number }
export type RecentCity = { city: string; ts: string }
