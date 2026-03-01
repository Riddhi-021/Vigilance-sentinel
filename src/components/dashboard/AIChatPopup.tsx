import { useState } from "react";
import { Bot, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AIChatPanel from "./AIChatPanel";

const AIChatPopup = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform glow-primary"
        whileTap={{ scale: 0.9 }}
      >
        {open ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5 md:w-6 md:h-6" />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="fixed bottom-20 md:bottom-24 right-4 md:right-5 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[500px] md:h-[550px] rounded-xl shadow-2xl overflow-hidden border border-border"
          >
            <AIChatPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatPopup;
