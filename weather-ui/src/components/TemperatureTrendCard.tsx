import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export function TemperatureTrendCard({ data }: { data: Array<{ ts:string; temp_c:number }> }) {
  return (
    <section>
      <div className="chart-title">Temperature Trend</div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.12)" />
            <XAxis dataKey="ts" tickFormatter={(v)=> new Date(v).getHours()+':00'} stroke="#a3b0bf" />
            <YAxis stroke="#a3b0bf" />
            <Tooltip labelFormatter={(v) => new Date(v as string).toLocaleString()} />
            <Line type="monotone" dataKey="temp_c" stroke="#60a5fa" strokeWidth={3} dot={{ r:3, fill:'#60a5fa' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
