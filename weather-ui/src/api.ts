export type TrendPoint = { ts: string; temp: number; city: string };

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export async function getWeather(city: string) {
  const url = new URL(`${API_BASE}/api/weather`);
  url.searchParams.set("city", city);
  const r = await fetch(url.toString());
  if (!r.ok) throw new Error(`weather ${r.status}`);
  return await r.json();
}

export async function getRecent(limit = 10, city?: string): Promise<TrendPoint[]> {
  const url = new URL(`${API_BASE}/api/recent`);
  url.searchParams.set("limit", String(limit));
  if (city) url.searchParams.set("city", city);

  const r = await fetch(url.toString());
  if (!r.ok) throw new Error(`recent ${r.status}`);
  const data = await r.json();

  const items = Array.isArray(data) ? data : (data.items ?? []);
  return (items as any[]).map((x) => ({
    ts: x.ts,
    temp: x.temp ?? x.temp_c ?? x.temperature ?? 0,
    city: x.city ?? "",
  }));
}