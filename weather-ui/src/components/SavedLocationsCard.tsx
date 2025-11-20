type SavedItem = { city: string; temp: number };

type SavedLocationsCardProps = {
  items: SavedItem[];
  unit: "C" | "F";
  onToggleSaved: (city: string) => void;
  isLoading?: boolean;
};

export function SavedLocationsCard({
  items,
  unit,
  onToggleSaved,
  isLoading,
}: SavedLocationsCardProps) {
  if (isLoading) {
    return (
      <section>
        <div className="list-title">Saved Locations</div>
        <p>Loading...</p>
      </section>
    );
  }

  const toUnit = (t: number) => (unit === "F" ? Math.round(t * 9 / 5 + 32) : t);

  return (
    <section>
      <div className="list-title">Saved Locations</div>
      {items.map((x) => (
        <div
          key={x.city}
          className="list-item"
          onClick={() => onToggleSaved(x.city)}
          style={{ cursor: "pointer" }}
        >
          <span className="name">{x.city}</span>
          <span className="t">
            {toUnit(x.temp)}°{unit}
          </span>
        </div>
      ))}
    </section>
  );
}
