import { useState } from "react";
import { motion } from "framer-motion";
import { useGetAutomations, useUpdateAutomation } from "@workspace/api-client-react";
import { Plus, Clock, Sunrise, Sunset } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Automation } from "@workspace/api-client-react/src/generated/api.schemas";

export default function Automations() {
  const { data: automations } = useGetAutomations();
  const updateMutation = useUpdateAutomation();

  const handleToggle = (id: number, currentEnabled: boolean) => {
    updateMutation.mutate({
      automationId: id,
      data: { isEnabled: !currentEnabled }
    });
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'sunrise': return <Sunrise className="w-4 h-4" />;
      case 'sunset': return <Sunset className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Mock data if API is empty
  const rules = automations?.length ? automations : [
    { id: 1, name: "Good Morning", deviceId: 1, action: "turn_on", triggerType: "schedule", triggerTime: "07:00", triggerDays: "mon,tue,wed,thu,fri", isEnabled: true, userId: 1, createdAt: "" },
    { id: 2, name: "Sunset Lights", deviceId: 2, action: "turn_on", triggerType: "sunset", isEnabled: true, userId: 1, createdAt: "" },
    { id: 3, name: "AC Off After Midnight", deviceId: 3, action: "turn_off", triggerType: "schedule", triggerTime: "00:00", triggerDays: "mon,tue,wed,thu,fri,sat,sun", isEnabled: false, userId: 1, createdAt: "" },
  ] as Automation[];

  return (
    <div className="p-6 pt-12 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-medium text-white mb-1">Routines</h1>
          <p className="text-white/50">Automate your home</p>
        </div>
        <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-[0_0_20px_rgba(79,156,249,0.4)] hover:scale-105 transition-transform">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        {rules.map((rule, i) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "glass-panel rounded-2xl p-5 transition-colors duration-300",
              rule.isEnabled ? "border-primary/30 bg-primary/5" : "opacity-70"
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">{rule.name}</h3>
                <div className="flex items-center gap-1.5 text-sm text-primary">
                  {getTriggerIcon(rule.triggerType)}
                  <span>
                    {rule.triggerType === 'schedule' ? rule.triggerTime : rule.triggerType}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => handleToggle(rule.id, rule.isEnabled)}
                className={cn(
                  "w-12 h-6 rounded-full flex items-center p-1 transition-colors duration-300",
                  rule.isEnabled ? "bg-primary" : "bg-white/10"
                )}
              >
                <motion.div 
                  layout
                  className="w-4 h-4 rounded-full bg-white shadow-sm"
                  animate={{ x: rule.isEnabled ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
            
            {rule.triggerDays && (
              <div className="flex gap-1.5 mt-4">
                {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => {
                  const isActive = rule.triggerDays?.includes(day);
                  return (
                    <div 
                      key={day}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium uppercase transition-colors",
                        isActive 
                          ? (rule.isEnabled ? "bg-primary/20 text-primary border border-primary/30" : "bg-white/10 text-white/70 border border-white/20") 
                          : "bg-transparent text-white/30 border border-white/5"
                      )}
                    >
                      {day.charAt(0)}
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
