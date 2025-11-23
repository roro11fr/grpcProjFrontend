type Item = { city: string; ts: string }

export function RecentCitiesCard({
  cities,
  onPick,
}: {
  cities: Item[];
  onPick?: (city: string) => void;
}) {
  return (
    <div className="card">
      <div className="list-title">Last 5 searches</div>
      {cities.length === 0 ? (
        <div>No recent searches.</div>
      ) : (
        <ul>
          {cities.slice(0, 5).map((x, i) => (
            <li key={`${x.city}-${x.ts}-${i}`} className="list-item">
              <button type="button" className="name" onClick={() => onPick?.(x.city)}>
                {x.city}
              </button>
              <div className="t" style={{ fontWeight: 600 }}>
                {new Date(x.ts).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
