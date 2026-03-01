import { type DbAlert, useAlerts } from "@/hooks/useAlerts";
import { Phone, MessageSquare, MapPin, Clock, Shield, Building2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface AlertDetailProps {
  alert: DbAlert | null;
}

const AlertDetail = ({ alert }: AlertDetailProps) => {
  const { updateAlertStatus } = useAlerts();

  if (!alert) {
    return (
      <div className="glass-panel rounded-xl h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground p-8">
          <Shield className="w-16 h-16 mx-auto mb-4 opacity-15" />
          <p className="text-base font-medium mb-1">No Alert Selected</p>
          <p className="text-sm opacity-70">Click an alert from the list to view its details and AI analysis</p>
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
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="glass-panel rounded-xl h-full overflow-auto p-5 md:p-6 space-y-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs text-muted-foreground mb-2">{alert.alert_code}</p>
            <h2 className="text-2xl font-bold tracking-tight">{alert.crime_type}</h2>
          </div>
          <div className={`text-right ${riskColor[alert.risk_level]}`}>
            <p className="text-3xl font-black font-mono uppercase leading-none">{alert.risk_level}</p>
            <p className="text-[10px] uppercase tracking-widest mt-1 opacity-70">Risk Level</p>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-border/50">
          <p className="text-[10px] uppercase tracking-widest text-primary font-semibold mb-2">🤖 AI Analysis</p>
          <p className="text-sm leading-relaxed text-foreground/90">{alert.ai_analysis || alert.summary}</p>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { icon: alert.source === "call" ? Phone : MessageSquare, label: "Source", value: alert.source === "call" ? "Phone Call" : "SMS" },
            { icon: Clock, label: "Time", value: new Date(alert.created_at).toLocaleString() },
            { icon: MapPin, label: "Location", value: alert.location_address },
            { icon: Building2, label: "Phone", value: alert.phone_number },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20">
              <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="font-mono text-xs mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        {alert.status !== "resolved" && (
          <div className="flex gap-3 pt-2">
            {alert.status === "active" && (
              <Button size="lg" variant="secondary" className="flex-1"
                onClick={() => updateAlertStatus(alert.id, "acknowledged")}>
                Acknowledge
              </Button>
            )}
            <Button size="lg" className="flex-1 gap-2"
              onClick={() => updateAlertStatus(alert.id, "resolved")}>
              <CheckCircle className="w-4 h-4" /> Mark Resolved
            </Button>
          </div>
        )}

        {/* Coordinates */}
        <p className="font-mono text-[11px] text-muted-foreground pt-2 border-t border-border/30">
          Coordinates: {alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}
        </p>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertDetail;
