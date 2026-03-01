import { Phone, MessageSquare, AlertTriangle, Shield, Users, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAlerts, useCallRecords, useSmsRecords } from "@/hooks/useAlerts";

const StatsBar = () => {
  const { alerts } = useAlerts();
  const { records: calls } = useCallRecords();
  const { records: sms } = useSmsRecords();

  const activeAlerts = alerts.filter(a => a.status === "active").length;
  const threatsDetected = alerts.length;
  const resolvedToday = alerts.filter(a => a.status === "resolved").length;

  const statItems = [
    { label: "Active Alerts", value: activeAlerts, icon: AlertTriangle, urgent: activeAlerts > 0 },
    { label: "Threats Detected", value: threatsDetected, icon: Shield, urgent: false },
    { label: "Calls Monitored", value: calls.length, icon: Phone, urgent: false },
    { label: "SMS Tracked", value: sms.length, icon: MessageSquare, urgent: false },
    { label: "Resolved", value: resolvedToday, icon: CheckCircle, urgent: false },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
      {statItems.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`glass-panel rounded-lg p-2 md:p-3 flex items-center gap-2 md:gap-3 ${item.urgent ? "glow-danger border-risk-high" : ""}`}
        >
          <div className={`p-1.5 md:p-2 rounded-md ${item.urgent ? "bg-risk-high/20" : "bg-primary/10"}`}>
            <item.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${item.urgent ? "text-risk-high" : "text-primary"}`} />
          </div>
          <div>
            <p className="text-base md:text-lg font-bold font-mono leading-none">{item.value}</p>
            <p className="text-[10px] md:text-[11px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;
