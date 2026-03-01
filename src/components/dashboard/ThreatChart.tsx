import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useAlerts } from "@/hooks/useAlerts";

const riskColors: Record<string, string> = {
  critical: "hsl(0, 90%, 45%)",
  high: "hsl(0, 75%, 55%)",
  medium: "hsl(38, 95%, 55%)",
  low: "hsl(142, 70%, 45%)",
};

const ThreatChart = () => {
  const { data: alerts } = useAlerts();

  const chartData = ["critical", "high", "medium", "low"].map((level) => ({
    name: level.charAt(0).toUpperCase() + level.slice(1),
    count: alerts?.filter((a) => a.risk_level === level).length || 0,
    level,
  }));

  return (
    <div className="glass-panel rounded-lg p-4 h-full flex flex-col">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Threat Distribution
      </h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 15%, 18%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.level} fill={riskColors[entry.level]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ThreatChart;
