export function CurrentWeatherCard({ data, unit, convert }:
  { data: any; unit:'C'|'F'; convert:(t:number)=>number }) {
  return (
    <section className="hero">
      <div className="city">{data.city}, RO</div>
      <div className="updated">Last updated: {new Date(data.ts).toLocaleString()}</div>
      <div className="temp">{convert(data.temp_c)}°{unit}</div>
      <div className="hero-sub">{data.description}</div>
      <div className="metrics">
        <div className="metric"><div className="k">Humidity</div><div className="v">{data.humidity}%</div></div>
        <div className="metric"><div className="k">Wind</div><div className="v">{data.wind_speed} m/s</div></div>
        <div className="metric"><div className="k">Feels Like</div><div className="v">{convert(data.feels_like)}°{unit}</div></div>
      </div>
    </section>
  )
}
