import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function House3D() {
  return (
    <div className="relative w-64 h-64 mx-auto perspective-1000 flex items-center justify-center my-12">
      <motion.div 
        className="relative w-48 h-48 preserve-3d"
        initial={{ rotateX: 60, rotateZ: -45, y: 50, opacity: 0 }}
        animate={{ rotateX: 60, rotateZ: -45, y: 0, opacity: 1 }}
        transition={{ duration: 1.5, type: "spring" }}
      >
        {/* Base shadow */}
        <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full transform translate-z-[-20px]" />
        
        {/* Floor Plate */}
        <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl shadow-xl glass-panel" />

        {/* Walls & Structure */}
        <div className="absolute inset-4 preserve-3d">
          {/* Main Module */}
          <motion.div 
            className="absolute inset-8 bg-gradient-to-tr from-white/5 to-white/10 border border-white/20 rounded-xl preserve-3d glass-panel"
            style={{ transform: 'translateZ(40px)' }}
          >
            {/* Glowing Core (Represents Smart Hub) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/20 border border-primary/50 neon-glow-blue flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse-ring" />
            </div>

            {/* Simulated Lights (Windows) */}
            <div className="absolute top-2 left-2 w-4 h-1 bg-primary/80 rounded-full shadow-[0_0_10px_#4f9cf9]" />
            <div className="absolute bottom-4 right-2 w-1 h-6 bg-secondary/80 rounded-full shadow-[0_0_10px_#8b5cf6]" />

            {/* Animated Air Waves (AC simulation) */}
            <div className="absolute top-[-20px] left-1/4 flex flex-col gap-1 preserve-3d" style={{ transform: 'translateZ(20px) rotateX(-90deg)' }}>
               <div className="w-8 h-1 bg-white/30 rounded-full animate-air-wave" style={{ animationDelay: '0s' }} />
               <div className="w-6 h-1 bg-white/30 rounded-full animate-air-wave" style={{ animationDelay: '0.4s' }} />
               <div className="w-10 h-1 bg-white/30 rounded-full animate-air-wave" style={{ animationDelay: '0.8s' }} />
            </div>
          </motion.div>

          {/* Secondary Module */}
          <motion.div 
            className="absolute top-[-10px] right-0 w-16 h-16 bg-white/5 border border-white/10 rounded-lg preserve-3d backdrop-blur-md"
            style={{ transform: 'translateZ(25px)' }}
          >
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
