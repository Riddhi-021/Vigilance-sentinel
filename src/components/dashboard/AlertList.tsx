import { AlertTriangle, Phone, MessageSquare, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAlerts, type DbAlert } from "@/hooks/useAlerts";

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

  return (
    <div className="glass-panel rounded-lg h-full flex flex-col">
      <div className="p-3 md:p-4 border-b border-border flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-risk-high" />
        <h2 className="font-semibold text-xs md:text-sm uppercase tracking-wider">Crime Alerts</h2>
        <Badge variant="destructive" className="ml-auto text-xs font-mono">
          {alerts.filter(a => a.status === "active").length} Active
        </Badge>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground text-xs">Loading alerts...</div>
          ) : alerts.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-xs">No alerts found</div>
          ) : alerts.map((alert, i) => (
            <motion.button
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectAlert(alert)}
              className={`w-full text-left p-2.5 md:p-3 rounded-md border transition-all ${
                selectedAlert?.id === alert.id
                  ? "border-primary bg-primary/10"
                  : "border-transparent hover:bg-secondary/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-mono text-[10px] md:text-xs text-muted-foreground">{alert.alert_code}</span>
                <Badge className={`text-[10px] px-1.5 py-0 border ${riskColors[alert.risk_level]}`}>
                  {alert.risk_level.toUpperCase()}
                </Badge>
              </div>
              <p className="font-semibold text-xs md:text-sm mb-1">{alert.crime_type}</p>
              <p className="text-[11px] md:text-xs text-muted-foreground line-clamp-2 mb-2">{alert.summary}</p>
              <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-[11px] text-muted-foreground">
                {alert.source === "call" ? <Phone className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 flex-shrink-0" />{alert.location_address}</span>
                <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] flex-shrink-0 ${statusColors[alert.status]}`}>
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
