import { motion } from "framer-motion";
import { useGetDevices, useGetRooms, useGetAutomations, useToggleDevice } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import {
  Lightbulb, Fan, Thermometer, Lock, Camera, Speaker, Tv, Snowflake,
  Power, Zap, Home, ChevronRight, Wifi, Moon, Sun
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const iconMap: Record<string, any> = {
  light: Lightbulb, fan: Fan, ac: Snowflake, thermostat: Thermometer,
  lock: Lock, camera: Camera, speaker: Speaker, tv: Tv,
};

const energyData = [
  { day: "Mon", kw: 3.2 }, { day: "Tue", kw: 4.1 }, { day: "Wed", kw: 2.8 },
  { day: "Thu", kw: 5.2 }, { day: "Fri", kw: 3.9 }, { day: "Sat", kw: 6.1 },
  { day: "Sun", kw: 4.5 },
];

const scenes = [
  { id: "morning", label: "Good Morning", icon: Sun, color: "from-amber-500/20 to-orange-500/10", border: "border-amber-500/20", text: "text-amber-400" },
  { id: "night", label: "Good Night", icon: Moon, color: "from-indigo-500/20 to-purple-500/10", border: "border-indigo-500/20", text: "text-indigo-400" },
  { id: "away", label: "Away Mode", icon: Lock, color: "from-primary/20 to-primary/5", border: "border-primary/20", text: "text-primary" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data: devices, isLoading: devicesLoading } = useGetDevices({});
  const { data: rooms } = useGetRooms();
  const { data: automations } = useGetAutomations();
  const toggleMutation = useToggleDevice();

  const [optimisticStates, setOptimisticStates] = useState<Record<number, boolean>>({});

  const getDeviceState = (device: any) =>
    optimisticStates[device.id] !== undefined ? optimisticStates[device.id] : device.isOn;

  const handleToggle = (device: any) => {
    const newState = !getDeviceState(device);
    setOptimisticStates((prev) => ({ ...prev, [device.id]: newState }));
    toggleMutation.mutate({ deviceId: device.id });
  };

  const activeDevices = devices?.filter(d => getDeviceState(d)) || [];
  const totalDevices = devices?.length || 0;
  const totalPower = activeDevices.reduce((acc, d) => acc + (d.powerUsage || 0), 0);
  const activeAutomations = automations?.filter(a => a.isEnabled).length || 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const firstName = user?.name?.split(" ")[0] || "User";

  const featuredDevices = devices?.slice(0, 4) || [];

  return (
    <div className="relative min-h-full pb-36">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute top-32 right-0 w-[200px] h-[200px] bg-secondary/5 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-2">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-1"
        >
          <div>
            <p className="text-white/50 text-sm font-medium tracking-wide uppercase">
              {greeting}
            </p>
            <h1 className="text-2xl font-display font-semibold text-white mt-0.5">
              {firstName}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <Wifi className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400 text-xs font-medium">Online</span>
            </div>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full ring-2 ring-primary/40" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/40">
                <span className="text-primary font-bold text-sm">{firstName[0]}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Stats Row */}
      <div className="px-6 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: "Active", value: activeDevices.length, total: totalDevices, unit: "devices", color: "primary" },
            { label: "Power", value: (totalPower / 1000).toFixed(1), unit: "kW", color: "secondary" },
            { label: "Rules", value: activeAutomations, unit: "active", color: "chart-3" },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass-panel rounded-2xl p-3 text-center"
            >
              <p className={cn(
                "text-xl font-bold font-display",
                i === 0 ? "text-primary" : i === 1 ? "text-secondary" : "text-[hsl(var(--chart-3))]"
              )}>
                {stat.value}
              </p>
              <p className="text-white/30 text-[10px] font-medium uppercase tracking-wider mt-0.5">
                {stat.unit}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Quick Scenes */}
      <div className="px-6 mt-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-white/60 text-xs font-medium uppercase tracking-widest mb-3">Scenes</h2>
          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
            {scenes.map((scene) => {
              const Icon = scene.icon;
              return (
                <button
                  key={scene.id}
                  className={cn(
                    "flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-2xl border bg-gradient-to-br transition-all duration-300",
                    "hover:scale-[1.02] active:scale-95",
                    scene.color, scene.border
                  )}
                >
                  <Icon className={cn("w-4 h-4", scene.text)} />
                  <span className={cn("text-sm font-medium whitespace-nowrap", scene.text)}>{scene.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Energy Chart */}
      <div className="px-6 mt-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-white font-medium text-sm">Energy Usage</h2>
              <p className="text-white/40 text-xs mt-0.5">Last 7 days</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-primary font-bold text-sm">{(totalPower / 1000).toFixed(1)} kW</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={energyData}>
              <defs>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(213,94%,64%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(213,94%,64%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <Tooltip
                contentStyle={{ background: "rgba(15,17,30,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px", color: "#fff" }}
                formatter={(v: any) => [`${v} kW`, "Usage"]}
              />
              <Area
                type="monotone"
                dataKey="kw"
                stroke="hsl(213,94%,64%)"
                strokeWidth={2}
                fill="url(#energyGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quick Toggle Devices */}
      <div className="px-6 mt-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white/60 text-xs font-medium uppercase tracking-widest">Devices</h2>
            <Link href="/devices">
              <button className="flex items-center gap-1 text-primary text-xs font-medium">
                See all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          {devicesLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {(featuredDevices.length > 0 ? featuredDevices : [
                { id: 1, name: "Ceiling Light", type: "light", isOn: true, value: 80, unit: "%" },
                { id: 2, name: "AC Unit", type: "ac", isOn: true, value: 22, unit: "°C" },
                { id: 3, name: "Bedroom Fan", type: "fan", isOn: false, value: 3, unit: "spd" },
                { id: 4, name: "Smart Lock", type: "lock", isOn: false, value: null, unit: null },
              ] as any[]).slice(0, 4).map((device, i) => {
                const isOn = getDeviceState(device);
                const Icon = iconMap[device.type] || Power;
                return (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    onClick={() => handleToggle(device)}
                    className={cn(
                      "relative overflow-hidden rounded-2xl p-4 cursor-pointer transition-all duration-300 border",
                      isOn
                        ? "bg-primary/10 border-primary/30 shadow-[0_0_20px_rgba(79,156,249,0.15)]"
                        : "bg-white/[0.03] border-white/5"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300",
                      isOn ? "bg-primary/20" : "bg-white/5"
                    )}>
                      <Icon className={cn("w-5 h-5", isOn ? "text-primary" : "text-white/40")} />
                    </div>

                    <p className="text-white text-sm font-medium leading-tight">{device.name}</p>
                    {device.value !== null && device.value !== undefined && (
                      <p className={cn("text-xs mt-0.5", isOn ? "text-primary/80" : "text-white/30")}>
                        {device.value}{device.unit}
                      </p>
                    )}

                    {/* Toggle dot */}
                    <div className={cn(
                      "absolute top-3 right-3 w-2 h-2 rounded-full transition-all duration-300",
                      isOn ? "bg-primary shadow-[0_0_6px_rgba(79,156,249,0.9)]" : "bg-white/20"
                    )} />

                    {isOn && (
                      <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-primary/20 blur-[30px] rounded-full pointer-events-none" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Rooms overview */}
      <div className="px-6 mt-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white/60 text-xs font-medium uppercase tracking-widest">Rooms</h2>
            <Link href="/rooms">
              <button className="flex items-center gap-1 text-primary text-xs font-medium">
                See all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(rooms || [
              { id: 1, name: "Living Room", deviceCount: 5, activeCount: 2 },
              { id: 2, name: "Bedroom", deviceCount: 4, activeCount: 1 },
            ] as any[]).slice(0, 2).map((room: any, i: number) => (
              <Link key={room.id} href={`/rooms/${room.id}`}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="glass-panel rounded-2xl p-4 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4 text-primary/80" />
                    <span className="text-white text-sm font-medium">{room.name}</span>
                  </div>
                  <p className="text-white/40 text-xs">
                    {room.activeCount} / {room.deviceCount} active
                  </p>
                  <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-primary/60 rounded-full transition-all duration-500"
                      style={{ width: room.deviceCount > 0 ? `${(room.activeCount / room.deviceCount) * 100}%` : "0%" }}
                    />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
