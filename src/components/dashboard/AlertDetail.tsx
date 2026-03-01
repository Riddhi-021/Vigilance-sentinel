import { type DbAlert } from "@/hooks/useAlerts";
import { Phone, MessageSquare, MapPin, Clock, Shield, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AlertDetailProps {
  alert: DbAlert | null;
}

const AlertDetail = ({ alert }: AlertDetailProps) => {
  const { toast } = useToast();

  if (!alert) {
    return (
      <div className="glass-panel rounded-lg h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Select an alert to view details</p>
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

  const handleStatusChange = async (newStatus: string) => {
    const { error } = await supabase
      .from("alerts")
      .update({ status: newStatus })
      .eq("id", alert.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Status updated", description: `Alert marked as ${newStatus}` });
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={alert.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="glass-panel rounded-lg h-full overflow-auto p-4 space-y-4"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs text-muted-foreground mb-1">{alert.alert_code}</p>
            <h2 className="text-lg md:text-xl font-bold">{alert.crime_type}</h2>
          </div>
          <div className={`text-right ${riskColor[alert.risk_level] || ""}`}>
            <p className="text-xl md:text-2xl font-black font-mono uppercase">{alert.risk_level}</p>
            <p className="text-[10px] uppercase tracking-widest">Risk Level</p>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-md p-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">AI Analysis</p>
          <p className="text-sm leading-relaxed">{alert.ai_analysis || alert.summary}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            {alert.source === "call" ? <Phone className="w-4 h-4 text-primary" /> : <MessageSquare className="w-4 h-4 text-primary" />}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Source</p>
              <p className="font-mono text-xs">{alert.source === "call" ? "Phone Call" : "SMS"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Time</p>
              <p className="font-mono text-xs">{new Date(alert.created_at).toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Location</p>
              <p className="text-xs">{alert.location_address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Phone</p>
              <p className="font-mono text-xs">{alert.phone_number}</p>
            </div>
          </div>
        </div>

        {/* Status actions */}
        <div className="flex gap-2 pt-2">
          {alert.status !== "acknowledged" && (
            <button
              onClick={() => handleStatusChange("acknowledged")}
              className="flex-1 text-xs px-3 py-2 rounded-md bg-risk-medium/20 text-risk-medium hover:bg-risk-medium/30 transition-colors font-medium"
            >
              Acknowledge
            </button>
          )}
          {alert.status !== "resolved" && (
            <button
              onClick={() => handleStatusChange("resolved")}
              className="flex-1 text-xs px-3 py-2 rounded-md bg-risk-low/20 text-risk-low hover:bg-risk-low/30 transition-colors font-medium"
            >
              Resolve
            </button>
          )}
          {alert.status !== "active" && (
            <button
              onClick={() => handleStatusChange("active")}
              className="flex-1 text-xs px-3 py-2 rounded-md bg-risk-high/20 text-risk-high hover:bg-risk-high/30 transition-colors font-medium"
            >
              Reactivate
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span>Coords: {alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertDetail;
