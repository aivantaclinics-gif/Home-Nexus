import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Fan, Thermometer, Lock, Camera, Speaker, Tv, Snowflake, Power } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToggleDevice, useUpdateDevice } from "@workspace/api-client-react";
import type { Device } from "@workspace/api-client-react/src/generated/api.schemas";

const iconMap: Record<string, any> = {
  light: Lightbulb,
  fan: Fan,
  ac: Snowflake,
  thermostat: Thermometer,
  lock: Lock,
  camera: Camera,
  speaker: Speaker,
  tv: Tv,
};

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  // We use local state for immediate optimistic updates to make the UI feel instantaneous
  const [optimisticIsOn, setOptimisticIsOn] = useState(device.isOn);
  const [optimisticValue, setOptimisticValue] = useState(device.value || 0);
  
  const toggleMutation = useToggleDevice();
  const updateMutation = useUpdateDevice();

  const Icon = iconMap[device.type] || Power;
  
  const handleToggle = () => {
    setOptimisticIsOn(!optimisticIsOn);
    toggleMutation.mutate({ deviceId: device.id });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setOptimisticValue(val);
  };

  const handleValueCommit = () => {
    updateMutation.mutate({ 
      deviceId: device.id, 
      data: { value: optimisticValue } 
    });
  };

  const isLight = device.type === 'light';
  const hasSlider = device.value !== null && device.value !== undefined;

  return (
    <motion.div
      layout
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 transition-all duration-500",
        optimisticIsOn ? "glass-panel neon-border-blue" : "glass-panel bg-white/[0.02] border-white/5 opacity-80"
      )}
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
          optimisticIsOn 
            ? "bg-primary/20 text-primary neon-glow-blue" 
            : "bg-white/5 text-white/40"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        
        <button 
          onClick={handleToggle}
          className={cn(
            "w-12 h-6 rounded-full flex items-center p-1 transition-colors duration-300",
            optimisticIsOn ? "bg-primary" : "bg-white/10"
          )}
        >
          <motion.div 
            layout
            className="w-4 h-4 rounded-full bg-white shadow-sm"
            animate={{ x: optimisticIsOn ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      <div className="relative z-10">
        <h3 className="font-medium text-white text-lg">{device.name}</h3>
        <p className="text-white/50 text-sm">{optimisticIsOn ? 'ON' : 'OFF'}</p>
      </div>

      {hasSlider && optimisticIsOn && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 relative z-10"
        >
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={optimisticValue}
            onChange={handleValueChange}
            onMouseUp={handleValueCommit}
            onTouchEnd={handleValueCommit}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) ${optimisticValue}%, rgba(255,255,255,0.1) ${optimisticValue}%)`
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-white/40">
            <span>0{device.unit}</span>
            <span className="text-primary font-medium">{optimisticValue}{device.unit}</span>
          </div>
        </motion.div>
      )}

      {/* Background glow effect based on state */}
      {optimisticIsOn && (
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 blur-[40px] rounded-full pointer-events-none" />
      )}
    </motion.div>
  );
}
