import { type DbAlert, useAlerts } from "@/hooks/useAlerts";
import { Phone, MessageSquare, MapPin, Clock, Shield, Building2, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface AlertDetailProps {
  alert: DbAlert | null;
}

const AlertDetail = ({ alert }: AlertDetailProps) => {
  const { updateAlertStatus } = useAlerts();

  if (!alert) {
    return (
      <div className="glass-panel rounded-lg h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Shield className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 opacity-20" />
          <p className="text-xs md:text-sm">Select an alert to view details</p>
        </div>
      </div>
    );
  }

  const riskColor: Record<string, string> = {
    critical: "text-risk-critical",
    high: "text-risk-high",
    medium: "text-risk-medium",
    low: "text-risk-low",
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={alert.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="glass-panel rounded-lg h-full overflow-auto p-3 md:p-4 space-y-3 md:space-y-4"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] md:text-xs text-muted-foreground mb-1">{alert.alert_code}</p>
            <h2 className="text-lg md:text-xl font-bold">{alert.crime_type}</h2>
          </div>
          <div className={`text-right ${riskColor[alert.risk_level]}`}>
            <p className="text-xl md:text-2xl font-black font-mono uppercase">{alert.risk_level}</p>
            <p className="text-[9px] md:text-[10px] uppercase tracking-widest">Risk Level</p>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-md p-3">
          <p className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground mb-1">AI Analysis</p>
          <p className="text-xs md:text-sm leading-relaxed">{alert.ai_analysis || alert.summary}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 md:gap-3 text-sm">
          <div className="flex items-center gap-2">
            {alert.source === "call" ? <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" /> : <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />}
            <div>
              <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase">Source</p>
              <p className="font-mono text-[11px] md:text-xs">{alert.source === "call" ? "Phone Call" : "SMS"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            <div>
              <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase">Time</p>
              <p className="font-mono text-[11px] md:text-xs">{new Date(alert.created_at).toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            <div>
              <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase">Location</p>
              <p className="text-[11px] md:text-xs">{alert.location_address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            <div>
              <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase">Phone</p>
              <p className="font-mono text-[11px] md:text-xs">{alert.phone_number}</p>
            </div>
          </div>
        </div>

        {alert.status !== "resolved" && (
          <div className="flex gap-2">
            {alert.status === "active" && (
              <Button size="sm" variant="secondary" className="text-xs flex-1"
                onClick={() => updateAlertStatus(alert.id, "acknowledged")}>
                Acknowledge
              </Button>
            )}
            <Button size="sm" className="text-xs flex-1 gap-1"
              onClick={() => updateAlertStatus(alert.id, "resolved")}>
              <CheckCircle className="w-3 h-3" /> Resolve
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2 font-mono text-[10px] md:text-xs text-muted-foreground">
          <span>Coords: {alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertDetail;
