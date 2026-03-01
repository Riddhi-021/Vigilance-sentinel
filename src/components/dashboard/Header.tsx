import { Shield, Radio, LogOut, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const Header = () => {
  const { signOut, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "OF";

  return (
    <header className="glass-panel border-b border-border px-4 md:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center glow-primary"
        >
          <Shield className="w-5 h-5 text-primary" />
        </motion.div>
        <div>
         <h1 className="font-bold text-base md:text-lg tracking-tight leading-none">Vigilance</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] hidden sm:block">AI Crime Intelligence Platform</p>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-risk-low animate-pulse" />
            <span className="text-risk-low font-mono text-[11px]">SYSTEM ONLINE</span>
          </div>
          <span className="text-border">|</span>
          <span className="font-mono text-muted-foreground text-[11px]">
            {new Date().toLocaleTimeString()} IST
          </span>
        </div>
        <div className="flex items-center gap-2 border-l border-border pl-4">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{initials}</span>
          </div>
          <div>
            <p className="text-xs font-medium leading-none">{profile?.full_name || "Officer"}</p>
            <p className="text-[10px] text-muted-foreground">{profile?.rank || "Crime Branch"}</p>
          </div>
          <button
            onClick={signOut}
            className="ml-2 p-1.5 rounded-md hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile menu toggle */}
      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-md hover:bg-secondary/50">
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-14 right-4 z-50 glass-panel rounded-lg p-4 space-y-3 md:hidden"
        >
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-risk-low animate-pulse" />
            <span className="text-risk-low font-mono text-[11px]">SYSTEM ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{initials}</span>
            </div>
            <div>
              <p className="text-xs font-medium">{profile?.full_name || "Officer"}</p>
              <p className="text-[10px] text-muted-foreground">{profile?.rank || "Crime Branch"}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full text-left text-xs text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
