import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine
} from 'recharts'
import type { TrendPoint } from '../api'
import React from 'react'

type RangeKey = '5m' | '30m' | '1h' | '1d' | '7d'

function splitDate(ts: string) {
  const d = new Date(ts)
  const date = d.toLocaleDateString([], { month: 'short', day: '2-digit' }) // ex. Nov 22
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // ex. 10:24 PM
  return { date, time }
}

// Tick personalizat: 1 rând pt interval scurt, 2 rânduri pt 1d/7d
function XTick({
  x, y, payload, range,
}: any & { range: RangeKey }) {
  const ts = String(payload.value)
  if (range === '5m') {
    const t = new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    return (
      <g transform={`translate(${x},${y})`}>
        <text dy={12} textAnchor="middle" fill="currentColor">{t}</text>
      </g>
    )
  }
  if (range === '30m' || range === '1h') {
    const t = new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return (
      <g transform={`translate(${x},${y})`}>
        <text dy={12} textAnchor="middle" fill="currentColor">{t}</text>
      </g>
    )
  }
  // 1d / 7d -> data pe primul rând, ora pe al doilea
  const { date, time } = splitDate(ts)
  return (
    <g transform={`translate(${x},${y})`}>
      <text dy={4} textAnchor="middle" fill="currentColor">{date}</text>
      <text dy={18} textAnchor="middle" fill="currentColor">{time}</text>
    </g>
  )
}

export function TemperatureTrendCard({
  data,
  unit,
  range,
  isLoading,
}: { data: TrendPoint[]; unit: 'C' | 'F'; range: RangeKey; isLoading?: boolean }) {
  const nowIso = new Date().toISOString()

  return (
    <section className="card">
      <div className="chart-title">Recent temperature</div>
      {isLoading ? (
        <div>Loading…</div>
      ) : data.length === 0 ? (
        <div>No recent data yet.</div>
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="ts"
                tick={<XTick range={range} />}
                interval="preserveStartEnd"
                minTickGap={10}
                tickMargin={8}
                height={range === '1d' || range === '7d' ? 44 : 28}
              />
              <YAxis
                tickFormatter={(v) => `${Number(v).toFixed(1)}°${unit}`}
                domain={['auto', 'auto']}
                allowDecimals
                width={56}
              />
              <Tooltip
                labelFormatter={(v) => new Date(String(v)).toLocaleString()}
                formatter={(value: any, _name, p) => [
                  `${Number(value).toFixed(1)}°${unit}`,
                  p?.payload?.city ?? 'Temperature',
                ]}
              />
              <ReferenceLine x={nowIso} strokeOpacity={0.5} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="temp" dot={{ r: 3 }} activeDot={{ r: 5 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}
