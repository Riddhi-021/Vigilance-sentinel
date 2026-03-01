import { Map, FileText, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

type View = "overview" | "records" | "alerts";

interface SidebarProps {
  activeView: View;
  onChangeView: (view: View) => void;
}

const navItems: { view: View; label: string; icon: typeof Map }[] = [
  { view: "overview", label: "Overview", icon: Map },
  { view: "alerts", label: "Alerts", icon: AlertTriangle },
  { view: "records", label: "Records", icon: FileText },
];

const Sidebar = ({ activeView, onChangeView }: SidebarProps) => (
  <nav className="hidden md:flex flex-col w-16 lg:w-48 border-r border-border bg-sidebar py-4 px-2 lg:px-3 gap-1">
    {navItems.map(({ view, label, icon: Icon }) => (
      <button
        key={view}
        onClick={() => onChangeView(view)}
        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
          activeView === view
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        }`}
      >
        {activeView === view && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
            transition={{ type: "spring", duration: 0.4 }}
          />
        )}
        <Icon className="w-4 h-4 relative z-10 flex-shrink-0" />
        <span className="relative z-10 hidden lg:block font-medium">{label}</span>
      </button>
    ))}
  </nav>
);

export default Sidebar;
