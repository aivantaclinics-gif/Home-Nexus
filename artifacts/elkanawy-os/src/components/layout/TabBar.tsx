import { Home, Grid2X2, Cpu, Settings, Thermometer } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "dashboard", icon: Home, label: "Home", path: "/dashboard" },
  { id: "rooms", icon: Grid2X2, label: "Rooms", path: "/rooms" },
  { id: "devices", icon: Thermometer, label: "Devices", path: "/devices" },
  { id: "automations", icon: Cpu, label: "Rules", path: "/automations" },
  { id: "settings", icon: Settings, label: "Settings", path: "/settings" },
];

export default function TabBar() {
  const [location] = useLocation();

  return (
    <div className="absolute bottom-0 w-full z-40 px-4 pb-6 pt-4 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
      <div className="glass-panel-heavy rounded-full p-2 flex justify-between items-center pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {tabs.map((tab) => {
          const isActive = location === tab.path;
          const Icon = tab.icon;

          return (
            <Link 
              key={tab.id} 
              href={tab.path}
              className="relative flex-1 py-3 flex flex-col items-center justify-center gap-1 group outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 bg-primary/10 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon 
                className={cn(
                  "w-6 h-6 transition-all duration-300 relative z-10",
                  isActive 
                    ? "text-primary drop-shadow-[0_0_8px_rgba(79,156,249,0.8)] scale-110" 
                    : "text-muted-foreground group-hover:text-white"
                )} 
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span className={cn(
                "text-[10px] font-medium transition-colors relative z-10",
                isActive ? "text-primary" : "text-muted-foreground/0 group-hover:text-white/50 opacity-0 group-hover:opacity-100"
              )}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
