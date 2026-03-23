import { useState } from "react";
import { Mic, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceControlProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function VoiceControl({ isOpen: externalOpen, onToggle }: VoiceControlProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("Listening...");

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

  const handleMicClick = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen(true);
    }
    setIsListening(true);
    setTranscript("Listening...");
    
    setTimeout(() => {
      setTranscript("Turn off all lights");
      setTimeout(() => {
        setIsListening(false);
        setTranscript("Action complete.");
        setTimeout(() => {
          if (onToggle) onToggle();
          else setInternalOpen(false);
        }, 1500);
      }, 1500);
    }, 2000);
  };

  const handleClose = () => {
    if (onToggle) onToggle();
    else setInternalOpen(false);
  };

  return (
    <>
      <motion.button
        onClick={handleMicClick}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full glass-panel-heavy bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(79,156,249,0.3)] hover:scale-105 transition-transform"
        whileTap={{ scale: 0.95 }}
      >
        <Mic className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
          >
            <button 
              onClick={handleClose}
              className="absolute top-12 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-32 h-32 flex items-center justify-center mb-12">
                {isListening && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse" />
                    <div className="absolute inset-[-20px] rounded-full border border-primary/30 animate-pulse" style={{ animationDelay: "0.5s" }} />
                  </>
                )}
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(79,156,249,0.6)]">
                  <Mic className="w-10 h-10 text-white" />
                </div>
              </div>

              <h2 className="font-display text-3xl font-light text-center mb-8 max-w-[280px] leading-tight text-white">
                {transcript}
              </h2>

              <div className="flex flex-wrap justify-center gap-3 w-full max-w-sm">
                {["Turn off lights", "Set AC to 22°C", "Lock doors", "Good night mode"].map((cmd) => (
                  <div key={cmd} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70">
                    "{cmd}"
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
