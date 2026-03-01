import { type Alert } from "@/data/mockData";
import { callRecords, smsRecords } from "@/data/mockData";
import { Phone, MessageSquare, MapPin, Clock, Shield, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface AlertDetailProps {
  alert: Alert | null;
}

const AlertDetail = ({ alert }: AlertDetailProps) => {
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

  const sourceData = alert.source === "call"
    ? callRecords.find(c => c.id === alert.sourceId)
    : smsRecords.find(s => s.id === alert.sourceId);

  const riskColor = {
    critical: "text-risk-critical",
    high: "text-risk-high",
    medium: "text-risk-medium",
    low: "text-risk-low",
  }[alert.riskLevel];

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
            <p className="font-mono text-xs text-muted-foreground mb-1">{alert.id}</p>
            <h2 className="text-xl font-bold">{alert.crimeType}</h2>
          </div>
          <div className={`text-right ${riskColor}`}>
            <p className="text-2xl font-black font-mono uppercase">{alert.riskLevel}</p>
            <p className="text-[10px] uppercase tracking-widest">Risk Level</p>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-md p-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">AI Analysis</p>
          <p className="text-sm leading-relaxed">{alert.summary}</p>
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
              <p className="font-mono text-xs">{new Date(alert.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Location</p>
              <p className="text-xs">{alert.location.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Assigned Station</p>
              <p className="text-xs">{alert.nearestStation}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            {alert.source === "call" ? "Call Transcript" : "Message Content"}
          </p>
          <div className="bg-background/50 rounded-md p-3 border border-border">
            <p className="font-mono text-xs leading-relaxed">
              {alert.source === "call" && sourceData && "transcript" in sourceData
                ? sourceData.transcript
                : sourceData && "message" in sourceData
                ? sourceData.message
                : "No content available"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span>Phone: {alert.phoneNumber}</span>
          <span className="mx-1">|</span>
          <span>Coords: {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertDetail;
