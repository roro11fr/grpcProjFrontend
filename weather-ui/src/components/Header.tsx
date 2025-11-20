export function Header({ darkMode, onToggleDarkMode, unit, onToggleUnit, onSearch }:
  { darkMode:boolean; onToggleDarkMode:()=>void; unit:'C'|'F'; onToggleUnit:()=>void; onSearch:(q:string)=>void }) {
  return (
    <header className="header">
      <h1>WeatherNow</h1>
      <div className="searchbar">
        <input placeholder="Search for a city..." onKeyDown={(e)=>{ if(e.key==='Enter'){ onSearch((e.target as HTMLInputElement).value) } }} />
        <button onClick={()=> onSearch((document.querySelector('.searchbar input') as HTMLInputElement)?.value || '')}>Get Weather</button>
        <button onClick={onToggleUnit}>{unit}°</button>
        <button onClick={onToggleDarkMode}>{darkMode ? 'Light' : 'Dark'}</button>
      </div>
    </header>
  )
}
