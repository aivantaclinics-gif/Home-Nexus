import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User, Bell, Shield, Smartphone, Globe, ChevronRight } from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuth();

  const settingsGroups = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Personal Information" },
        { icon: Shield, label: "Security & Privacy" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Notifications" },
        { icon: Smartphone, label: "Connected Devices" },
        { icon: Globe, label: "Location Services" },
      ]
    }
  ];

  return (
    <div className="p-6 pt-12 pb-32">
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-display font-medium text-white mb-8"
      >
        Settings
      </motion.h1>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center mb-10"
      >
        <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary p-1 mb-4 neon-glow-blue relative">
          <img 
            src={user?.avatarUrl} 
            alt="Avatar" 
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-black" />
        </div>
        <h2 className="text-xl font-display font-medium text-white">{user?.name}</h2>
        <p className="text-white/50 text-sm">{user?.email}</p>
        <div className="mt-4 px-4 py-1.5 rounded-full bg-white/5 text-xs text-white/70 border border-white/10">
          Google Account Linked
        </div>
      </motion.div>

      <div className="space-y-8">
        {settingsGroups.map((group, gIdx) => (
          <motion.div 
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + gIdx * 0.1 }}
          >
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3 px-2">{group.title}</h3>
            <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.label} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-white font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button 
            onClick={logout}
            className="w-full p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive font-medium flex items-center justify-center gap-2 hover:bg-destructive/20 transition-colors mt-8"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
