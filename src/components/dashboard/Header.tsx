import { Shield, Radio, LogOut, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const Header = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Officer";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <header className="border-b border-border bg-sidebar px-4 md:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center glow-primary"
        >
          <Shield className="w-5 h-5 text-primary" />
        </motion.div>
        <div>
          <h1 className="font-bold text-lg tracking-tight leading-none">VigiBot Sentinel</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] hidden sm:block">AI Crime Intelligence</p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-5">
        <div className="flex items-center gap-2">
          <Radio className="w-3 h-3 text-risk-low animate-pulse" />
          <span className="text-risk-low font-mono text-[11px]">ONLINE</span>
          <span className="text-border mx-1">|</span>
          <span className="font-mono text-muted-foreground text-[11px]">
            {new Date().toLocaleTimeString()} IST
          </span>
        </div>
        <div className="flex items-center gap-3 border-l border-border pl-5">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{initials}</span>
          </div>
          <div>
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-[10px] text-muted-foreground">Crime Branch</p>
          </div>
          <button onClick={signOut} className="ml-1 p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground" title="Sign out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <button className="md:hidden p-2 rounded-lg hover:bg-secondary/50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-14 right-4 z-50 glass-panel rounded-xl p-4 space-y-3 md:hidden shadow-xl"
        >
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-risk-low animate-pulse" />
            <span className="text-risk-low font-mono text-xs">ONLINE</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{initials}</span>
            </div>
            <p className="text-sm font-medium">{displayName}</p>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full pt-2 border-t border-border">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
