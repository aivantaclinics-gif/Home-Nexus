import { motion } from "framer-motion";
import { useGetRooms } from "@workspace/api-client-react";
import { RoomCard } from "@/components/rooms/RoomCard";

export default function Rooms() {
  const { data: rooms, isLoading } = useGetRooms();

  return (
    <div className="p-6 pt-12 pb-32">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-medium text-white mb-2">Spaces</h1>
        <p className="text-white/50">Manage your home environments</p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-white/5" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {rooms?.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <RoomCard room={room} />
            </motion.div>
          )) || [
            { id: 1, name: "Living Room", icon: "sofa", userId: 1, deviceCount: 5, activeCount: 2, createdAt: "" },
            { id: 2, name: "Master Bedroom", icon: "bed", userId: 1, deviceCount: 4, activeCount: 1, createdAt: "" },
            { id: 3, name: "Kitchen", icon: "chef-hat", userId: 1, deviceCount: 6, activeCount: 0, createdAt: "" },
            { id: 4, name: "Bathroom", icon: "bath", userId: 1, deviceCount: 2, activeCount: 2, createdAt: "" }
          ].map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <RoomCard room={r as any} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
