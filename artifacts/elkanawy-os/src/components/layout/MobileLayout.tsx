import { ReactNode } from "react";
import TabBar from "./TabBar";
import { VoiceControl } from "../ui/VoiceControl";
import { useLocation } from "wouter";

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const [location] = useLocation();
  const isLoginPage = location === "/";

  return (
    <div className="min-h-screen bg-black w-full flex justify-center overflow-hidden">
      {/* Phone container mockup for desktop viewing */}
      <div className="w-full max-w-[430px] h-[100dvh] bg-background relative overflow-hidden flex flex-col md:border-x md:border-white/5 md:shadow-2xl">
        
        {/* Abstract Background Elements */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[40%] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto hide-scrollbar relative z-10 pb-24">
          {children}
        </main>

        {/* Floating Voice Mic Overlay */}
        {!isLoginPage && <VoiceControl />}

        {/* Bottom Tab Bar */}
        {!isLoginPage && <TabBar />}
      </div>
    </div>
  );
}
