import { AlertTriangle, Phone, MessageSquare, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useAlerts, type DbAlert } from "@/hooks/useAlerts";
import { useState } from "react";
import { Search } from "lucide-react";

const riskColors: Record<string, string> = {
  critical: "bg-risk-critical/20 text-risk-critical border-risk-critical/40",
  high: "bg-risk-high/20 text-risk-high border-risk-high/40",
  medium: "bg-risk-medium/20 text-risk-medium border-risk-medium/40",
  low: "bg-risk-low/20 text-risk-low border-risk-low/40",
};

const statusColors: Record<string, string> = {
  active: "bg-risk-high/20 text-risk-high",
  acknowledged: "bg-risk-medium/20 text-risk-medium",
  resolved: "bg-risk-low/20 text-risk-low",
};

interface AlertListProps {
  onSelectAlert: (alert: DbAlert) => void;
  selectedAlert: DbAlert | null;
}

const AlertList = ({ onSelectAlert, selectedAlert }: AlertListProps) => {
  const { alerts, loading } = useAlerts();
  const [search, setSearch] = useState("");

  const filtered = alerts.filter(a =>
    !search || a.crime_type.toLowerCase().includes(search.toLowerCase()) ||
    a.alert_code.toLowerCase().includes(search.toLowerCase()) ||
    a.location_address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass-panel rounded-xl h-full flex flex-col">
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-risk-high" />
          <h2 className="font-semibold text-sm uppercase tracking-wider">Crime Alerts</h2>
          <Badge variant="destructive" className="ml-auto text-xs font-mono">
            {alerts.filter(a => a.status === "active").length} Active
          </Badge>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter alerts..."
            className="h-8 text-xs pl-9 bg-secondary/50 border-border" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1.5">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading alerts...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No alerts found</div>
          ) : filtered.map((alert, i) => (
            <motion.button
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onSelectAlert(alert)}
              className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                selectedAlert?.id === alert.id
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-transparent hover:bg-secondary/40"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] text-muted-foreground">{alert.alert_code}</span>
                <Badge className={`text-[10px] px-2 py-0.5 border ${riskColors[alert.risk_level]}`}>
                  {alert.risk_level.toUpperCase()}
                </Badge>
              </div>
              <p className="font-semibold text-sm mb-1.5">{alert.crime_type}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2.5 leading-relaxed">{alert.summary}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                {alert.source === "call" ? <Phone className="w-3 h-3 flex-shrink-0" /> : <MessageSquare className="w-3 h-3 flex-shrink-0" />}
                <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 flex-shrink-0" />{alert.location_address}</span>
                <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] flex-shrink-0 ${statusColors[alert.status]}`}>
                  {alert.status}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlertList;
