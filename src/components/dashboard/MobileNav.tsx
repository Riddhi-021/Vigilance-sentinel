import { Map, FileText, AlertTriangle } from "lucide-react";

type View = "overview" | "records" | "alerts";

interface MobileNavProps {
  activeView: View;
  onChangeView: (view: View) => void;
}

const navItems: { view: View; label: string; icon: typeof Map }[] = [
  { view: "overview", label: "Map", icon: Map },
  { view: "alerts", label: "Alerts", icon: AlertTriangle },
  { view: "records", label: "Records", icon: FileText },
];

const MobileNav = ({ activeView, onChangeView }: MobileNavProps) => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-sidebar/95 backdrop-blur-md px-2 py-1.5 flex justify-around">
    {navItems.map(({ view, label, icon: Icon }) => (
      <button
        key={view}
        onClick={() => onChangeView(view)}
        className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors ${
          activeView === view
            ? "text-primary"
            : "text-muted-foreground"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="text-[10px] font-medium">{label}</span>
      </button>
    ))}
  </nav>
);

export default MobileNav;
