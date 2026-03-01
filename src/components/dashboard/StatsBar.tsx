import { Phone, MessageSquare, AlertTriangle, Shield, Users, CheckCircle, Loader2 } from "lucide-react";
import { useStats } from "@/hooks/useAlerts";
import { motion } from "framer-motion";

const StatsBar = () => {
  const { data: stats, isLoading } = useStats();

  const statItems = [
    { label: "Active Alerts", value: stats?.activeAlerts ?? 0, icon: AlertTriangle, urgent: true },
    { label: "Threats Today", value: stats?.threatsDetected ?? 0, icon: Shield, urgent: false },
    { label: "Calls Monitored", value: stats?.totalCalls ?? 0, icon: Phone, urgent: false },
    { label: "SMS Tracked", value: stats?.totalSMS ?? 0, icon: MessageSquare, urgent: false },
    { label: "Resolved Today", value: stats?.resolvedToday ?? 0, icon: CheckCircle, urgent: false },
    { label: "Officers Online", value: stats?.officersOnline ?? 0, icon: Users, urgent: false },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
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
            <p className="text-sm md:text-lg font-bold font-mono leading-none">{item.value}</p>
            <p className="text-[9px] md:text-[11px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;
