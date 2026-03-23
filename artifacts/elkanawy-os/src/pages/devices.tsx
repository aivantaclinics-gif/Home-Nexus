import { useState } from "react";
import { motion } from "framer-motion";
import { useGetDevices } from "@workspace/api-client-react";
import { DeviceCard } from "@/components/devices/DeviceCard";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const filters = ["All", "Lights", "Climate", "Security", "Media"];

export default function Devices() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { data: devices, isLoading } = useGetDevices();

  return (
    <div className="p-6 pt-12 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display font-medium text-white">Devices</h1>
        <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 pb-2 -mx-6 px-6">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "px-5 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300",
              activeFilter === f 
                ? "bg-primary text-white shadow-[0_0_15px_rgba(79,156,249,0.4)] font-medium" 
                : "bg-white/5 text-white/50 hover:bg-white/10"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 animate-pulse">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 rounded-2xl bg-white/5" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {devices?.map((device, i) => (
             <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <DeviceCard device={device} />
            </motion.div>
          )) || [
            { id: 1, name: "Chandelier", type: "light", isOn: true, roomId: 1, userId: 1, createdAt: "", updatedAt: "", value: 100, unit: "%" },
            { id: 2, name: "Smart Lock", type: "lock", isOn: true, roomId: 1, userId: 1, createdAt: "", updatedAt: "" },
            { id: 3, name: "Thermostat", type: "thermostat", isOn: false, roomId: 1, userId: 1, createdAt: "", updatedAt: "", value: 24, unit: "°C" },
            { id: 4, name: "TV", type: "tv", isOn: true, roomId: 1, userId: 1, createdAt: "", updatedAt: "" },
            { id: 5, name: "Kitchen LED", type: "light", isOn: false, roomId: 1, userId: 1, createdAt: "", updatedAt: "", value: 0, unit: "%" },
            { id: 6, name: "Bedroom AC", type: "ac", isOn: false, roomId: 1, userId: 1, createdAt: "", updatedAt: "", value: 22, unit: "°C" },
          ].map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <DeviceCard device={d as any} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
