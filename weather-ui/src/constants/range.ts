export type RangeKey = '5m' | '30m' | '1h' | '1d' | '7d'

export const MIN = 60_000
export const H   = 3_600_000

export const RANGE_CONFIG: Record<
  RangeKey,
  { windowMs: number; fetchLimit: number; pollMs: number; label: string }
> = {
  '5m' : { windowMs: 5 * MIN,   fetchLimit: 3000,   pollMs: 60_000,    label: '5m' },
  '30m': { windowMs: 30 * MIN,  fetchLimit: 6000,   pollMs: 60_000,    label: '30m' },
  '1h' : { windowMs: 60 * MIN,  fetchLimit: 12000,  pollMs: 60_000,    label: '1h' },
  '1d' : { windowMs: 24 * H,    fetchLimit: 20000,  pollMs: H,         label: '1d' },
  '7d' : { windowMs: 7  * 24*H, fetchLimit: 100000, pollMs: H,         label: '7d' },
}

export const pollLabelFor = (pollMs: number) =>
  pollMs >= H ? `every ${pollMs / H}h` : `every ${Math.round(pollMs / MIN)}m`
