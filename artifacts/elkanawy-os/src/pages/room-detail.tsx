import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { useGetRoom, useGetDevices } from "@workspace/api-client-react";
import { DeviceCard } from "@/components/devices/DeviceCard";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function RoomDetail() {
  const [, params] = useRoute("/rooms/:id");
  const roomId = params?.id ? parseInt(params.id) : 0;
  
  const { data: room } = useGetRoom(roomId);
  const { data: devices } = useGetDevices({ roomId });

  return (
    <div className="p-6 pt-12 pb-32">
      <Link href="/rooms" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Spaces</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-display font-semibold text-white mb-2">{room?.name || "Room"}</h1>
        <p className="text-white/50">{devices?.length || 0} Devices Connected</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {devices?.map((device, i) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <DeviceCard device={device} />
          </motion.div>
        )) || [
          { id: 1, name: "Main Light", type: "light", isOn: true, roomId, userId: 1, createdAt: "", updatedAt: "", value: 100, unit: "%" },
          { id: 2, name: "Accent Light", type: "light", isOn: false, roomId, userId: 1, createdAt: "", updatedAt: "", value: 50, unit: "%" },
          { id: 3, name: "Thermostat", type: "thermostat", isOn: true, roomId, userId: 1, createdAt: "", updatedAt: "", value: 21, unit: "°C" }
        ].map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <DeviceCard device={d as any} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
