import { Shield, Radio, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => (
  <header className="glass-panel border-b border-border px-6 py-3 flex items-center justify-between">
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
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">AI Crime Intelligence Platform</p>
      </div>
    </div>

    <div className="flex items-center gap-4">
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
          <span className="text-xs font-bold text-primary">AK</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-medium leading-none">Officer A. Kumar</p>
          <p className="text-[10px] text-muted-foreground">Crime Branch</p>
        </div>
        <button className="ml-2 p-1.5 rounded-md hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground">
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </header>
);

export default Header;
