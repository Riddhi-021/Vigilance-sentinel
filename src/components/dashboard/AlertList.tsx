import { useAlerts, type DbAlert } from "@/hooks/useAlerts";
import { AlertTriangle, Phone, MessageSquare, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type RiskLevel = "critical" | "high" | "medium" | "low";

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
  const { data: alerts, isLoading } = useAlerts();

  return (
    <div className="glass-panel rounded-lg h-full flex flex-col">
      <div className="p-3 md:p-4 border-b border-border flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-risk-high" />
        <h2 className="font-semibold text-xs md:text-sm uppercase tracking-wider">Crime Alerts</h2>
        <Badge variant="destructive" className="ml-auto text-xs font-mono">
          {alerts?.filter((a) => a.status === "active").length || 0} Active
        </Badge>
      </div>
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {alerts?.map((alert, i) => (
              <motion.button
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onSelectAlert(alert)}
                className={`w-full text-left p-3 rounded-md border transition-all ${
                  selectedAlert?.id === alert.id
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-mono text-xs text-muted-foreground">{alert.alert_code}</span>
                  <Badge className={`text-[10px] px-1.5 py-0 border ${riskColors[alert.risk_level] || ""}`}>
                    {alert.risk_level.toUpperCase()}
                  </Badge>
                </div>
                <p className="font-semibold text-sm mb-1">{alert.crime_type}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{alert.summary}</p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  {alert.source === "call" ? <Phone className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                  <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 flex-shrink-0" />{alert.location_address}</span>
                  <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] flex-shrink-0 ${statusColors[alert.status] || ""}`}>
                    {alert.status}
                  </span>
                </div>
              </motion.button>
            ))}
            {(!alerts || alerts.length === 0) && (
              <p className="text-center text-muted-foreground py-8 text-sm">No alerts found</p>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default AlertList;
