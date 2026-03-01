import { Phone, MessageSquare, AlertTriangle, Shield, Users, CheckCircle } from "lucide-react";
import { stats } from "@/data/mockData";
import { motion } from "framer-motion";

const statItems = [
  { label: "Active Alerts", value: stats.activeAlerts, icon: AlertTriangle, urgent: true },
  { label: "Threats Today", value: stats.threatsDetected, icon: Shield, urgent: false },
  { label: "Calls Monitored", value: stats.totalCalls.toLocaleString(), icon: Phone, urgent: false },
  { label: "SMS Tracked", value: stats.totalSMS.toLocaleString(), icon: MessageSquare, urgent: false },
  { label: "Resolved Today", value: stats.resolvedToday, icon: CheckCircle, urgent: false },
  { label: "Officers Online", value: stats.officersOnline, icon: Users, urgent: false },
];

const StatsBar = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
    {statItems.map((item, i) => (
      <motion.div
        key={item.label}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
        className={`glass-panel rounded-lg p-3 flex items-center gap-3 ${item.urgent ? "glow-danger border-risk-high" : ""}`}
      >
        <div className={`p-2 rounded-md ${item.urgent ? "bg-risk-high/20" : "bg-primary/10"}`}>
          <item.icon className={`w-4 h-4 ${item.urgent ? "text-risk-high" : "text-primary"}`} />
        </div>
        <div>
          <p className="text-lg font-bold font-mono leading-none">{item.value}</p>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

export default StatsBar;
