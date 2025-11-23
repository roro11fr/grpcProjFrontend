export type Current = {
  city: string
  temp: number
  description: string
  humidity: number
  wind_speed: number
  ts: string
}

export type CurrentWeatherCardProps = {
  data: Current
  unit: 'C' | 'F'
  convert: (t: number) => number
}

export function CurrentWeatherCard({ data, unit, convert }: CurrentWeatherCardProps) {
  return (
    <section className="card card-weather">
      <div className="hero">
        <div className="city">{data.city}</div>
        <div className="updated">{data.description}</div>
        <div className="temp">
          {convert(data.temp)} °{unit}
        </div>
      </div>

      <div className="metrics">
        <div className="metric">
          <div className="k">Humidity</div>
          <div className="v">{data.humidity}%</div>
        </div>
        <div className="metric">
          <div className="k">Wind</div>
          <div className="v">{data.wind_speed.toFixed(1)} m/s</div>
        </div>
        <div className="metric">
          <div className="k">Updated</div>
          <div className="v">{new Date(data.ts).toLocaleString()}</div>
        </div>
      </div>
    </section>
  )
}
