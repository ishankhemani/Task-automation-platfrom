import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface AreaChartWrapperProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  yKey: string;
  height?: number;
  color?: string;
}

export function AreaChartWrapper({ data, xKey, yKey, height = 260, color = '#3b82f6' }: AreaChartWrapperProps) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height }} className="flex items-center justify-center border border-dashed rounded-xl text-muted-foreground text-sm w-full">
        No chart data available
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${yKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey={xKey} tick={{ fill: 'currentColor', fontSize: 10 }} opacity={0.7} interval="preserveStartEnd" />
          <YAxis tick={{ fill: 'currentColor', fontSize: 10 }} opacity={0.7} width={35} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '0.5rem',
              color: 'hsl(var(--foreground))',
              fontSize: '0.75rem',
            }}
          />
          <Area type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#gradient-${yKey})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
