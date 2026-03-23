import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import type { Room } from "@workspace/api-client-react/src/generated/api.schemas";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const isActive = room.activeCount > 0;

  return (
    <Link href={`/rooms/${room.id}`} className="block outline-none">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="glass-panel rounded-2xl p-5 relative overflow-hidden group cursor-pointer"
      >
        <div className="flex justify-between items-center relative z-10">
          <div>
            <h3 className="text-xl font-display font-medium text-white mb-1">{room.name}</h3>
            <p className="text-white/50 text-sm">
              {room.activeCount} / {room.deviceCount} Active
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-primary transition-colors" />
          </div>
        </div>

        {isActive && (
          <div className="absolute top-0 left-0 w-2 h-full bg-primary shadow-[0_0_15px_#4f9cf9]" />
        )}
      </motion.div>
    </Link>
  );
}
