import { Phone, MessageSquare, AlertTriangle, Shield, Users, CheckCircle, Loader2 } from "lucide-react";
import { useStats, useAlerts, useCallRecords, useSmsRecords } from "@/hooks/useAlerts";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const StatsBar = () => {
  const { data: stats, isLoading } = useStats();
  const { data: alerts } = useAlerts();
  const { data: calls } = useCallRecords();
  const { data: sms } = useSmsRecords();

  const statItems = [
    { label: "Active Alerts", value: stats?.activeAlerts ?? 0, icon: AlertTriangle, urgent: true, key: "activeAlerts" },
    { label: "Threats Today", value: stats?.threatsDetected ?? 0, icon: Shield, urgent: false, key: "threats" },
    { label: "Calls Monitored", value: stats?.totalCalls ?? 0, icon: Phone, urgent: false, key: "calls" },
    { label: "SMS Tracked", value: stats?.totalSMS ?? 0, icon: MessageSquare, urgent: false, key: "sms" },
    { label: "Resolved Today", value: stats?.resolvedToday ?? 0, icon: CheckCircle, urgent: false, key: "resolved" },
    { label: "Officers Online", value: stats?.officersOnline ?? 0, icon: Users, urgent: false, key: "officers" },
  ];

  const getPopoverContent = (key: string) => {
    switch (key) {
      case "activeAlerts": {
        const active = alerts?.filter(a => a.status === "active").slice(0, 5) || [];
        return active.length ? (
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Latest Active Alerts</p>
            {active.map(a => (
              <div key={a.id} className="text-xs border-b border-border/50 pb-1.5">
                <span className="font-mono text-primary">{a.alert_code}</span> — {a.crime_type}
                <p className="text-muted-foreground text-[10px] truncate">{a.summary}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-xs text-muted-foreground">No active alerts</p>;
      }
      case "threats": {
        const byType: Record<string, number> = {};
        alerts?.forEach(a => { byType[a.crime_type] = (byType[a.crime_type] || 0) + 1; });
        return (
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Threat Breakdown</p>
            {Object.entries(byType).map(([type, count]) => (
              <div key={type} className="flex justify-between text-xs">
                <span>{type}</span>
                <span className="font-mono text-primary">{count}</span>
              </div>
            ))}
          </div>
        );
      }
      case "calls": {
        const flagged = calls?.filter(c => c.status === "flagged") || [];
        return (
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Call Summary</p>
            <div className="flex justify-between text-xs"><span>Total</span><span className="font-mono">{calls?.length ?? 0}</span></div>
            <div className="flex justify-between text-xs"><span>Flagged</span><span className="font-mono text-destructive">{flagged.length}</span></div>
            {flagged.slice(0, 3).map(c => (
              <div key={c.id} className="text-[10px] text-muted-foreground truncate">{c.phone_number} — {c.caller_name || "Unknown"}</div>
            ))}
          </div>
        );
      }
      case "sms": {
        const flagged = sms?.filter(s => s.status === "flagged") || [];
        return (
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">SMS Summary</p>
            <div className="flex justify-between text-xs"><span>Total</span><span className="font-mono">{sms?.length ?? 0}</span></div>
            <div className="flex justify-between text-xs"><span>Flagged</span><span className="font-mono text-destructive">{flagged.length}</span></div>
            {flagged.slice(0, 3).map(s => (
              <div key={s.id} className="text-[10px] text-muted-foreground truncate">{s.phone_number} — {s.message?.slice(0, 40)}</div>
            ))}
          </div>
        );
      }
      case "resolved": {
        const resolved = alerts?.filter(a => a.status === "resolved").slice(0, 5) || [];
        return resolved.length ? (
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Recently Resolved</p>
            {resolved.map(a => (
              <div key={a.id} className="text-xs border-b border-border/50 pb-1">
                <span className="font-mono text-primary">{a.alert_code}</span> — {a.crime_type}
              </div>
            ))}
          </div>
        ) : <p className="text-xs text-muted-foreground">No resolved alerts today</p>;
      }
      case "officers":
        return <p className="text-xs text-muted-foreground">18 officers currently online across all stations.</p>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
      {statItems.map((item, i) => (
        <Popover key={item.key}>
          <PopoverTrigger asChild>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-panel rounded-lg p-2 md:p-3 flex items-center gap-2 md:gap-3 text-left w-full cursor-pointer hover:bg-secondary/40 transition-colors ${item.urgent ? "glow-danger border-risk-high" : ""}`}
            >
              <div className={`p-1.5 md:p-2 rounded-md ${item.urgent ? "bg-risk-high/20" : "bg-primary/10"}`}>
                <item.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${item.urgent ? "text-risk-high" : "text-primary"}`} />
              </div>
              <div>
                <p className="text-sm md:text-lg font-bold font-mono leading-none">{item.value}</p>
                <p className="text-[9px] md:text-[11px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
              </div>
            </motion.button>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-background border-border">
            {getPopoverContent(item.key)}
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
};

export default StatsBar;
