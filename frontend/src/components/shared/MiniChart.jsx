import { AreaChart, Area, ResponsiveContainer } from "recharts";

export const MiniChart = ({ data, dataKey, color = "hsl(var(--primary))" }) => {
  return (
    <ResponsiveContainer width="100%" height={50}>
      <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#gradient-${dataKey})`}
          dot={false}
          isAnimationActive={true}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
