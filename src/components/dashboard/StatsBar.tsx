import { Phone, MessageSquare, AlertTriangle, Shield, CheckCircle } from "lucide-react";
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
    { label: "Threats Detected", value: threatsDetected, icon: Shield },
    { label: "Calls Monitored", value: calls.length, icon: Phone },
    { label: "SMS Tracked", value: sms.length, icon: MessageSquare },
    { label: "Resolved", value: resolvedToday, icon: CheckCircle },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
      {statItems.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className={`glass-panel rounded-xl p-4 md:p-5 flex items-center gap-3 ${
            item.urgent ? "glow-danger border-risk-high" : ""
          }`}
        >
          <div className={`p-2.5 rounded-lg ${item.urgent ? "bg-risk-high/20" : "bg-primary/10"}`}>
            <item.icon className={`w-5 h-5 ${item.urgent ? "text-risk-high" : "text-primary"}`} />
          </div>
          <div>
            <p className="text-xl md:text-2xl font-bold font-mono leading-none">{item.value}</p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">{item.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;
