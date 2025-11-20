type RecentCitiesCardProps = {
  cities: string[];
  onPick: (city: string) => void;
  isLoading?: boolean;
};

export function RecentCitiesCard({ cities, onPick, isLoading }: RecentCitiesCardProps) {
  if (isLoading) {
    return (
      <section>
        <div className="list-title">Recent Cities</div>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section>
      <div className="list-title">Recent Cities</div>
      {cities.map((c) => (
        <div
          key={c}
          className="list-item"
          onClick={() => onPick(c)}
          style={{ cursor: "pointer" }}
        >
          <span className="name">{c}</span>
          <span>→</span>
        </div>
      ))}
    </section>
  );
}
