import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface LineChartWrapperProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  yKey: string;
  height?: number;
  color?: string;
}

export function LineChartWrapper({ data, xKey, yKey, height = 300, color = '#6366f1' }: LineChartWrapperProps) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height }} className="flex items-center justify-center border border-dashed rounded-xl text-muted-foreground text-sm">
        No chart data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
        <XAxis dataKey={xKey} tick={{ fill: 'currentColor', fontSize: 12 }} opacity={0.6} />
        <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} opacity={0.6} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
            borderRadius: '0.5rem',
            color: 'hsl(var(--foreground))',
          }}
        />
        <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
