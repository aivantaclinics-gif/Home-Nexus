import { motion } from "framer-motion";
import { House3D } from "@/components/ui/House3D";
import { useAuth } from "@/hooks/use-auth";

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-[100dvh] w-full flex flex-col relative">
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/space-bg.png)` }}
      />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-sm text-center"
        >
          <div className="mb-2 w-16 h-1 mx-auto bg-primary rounded-full neon-glow-blue" />
          <h1 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">
            Elkanawy <span className="text-primary neon-text-blue">OS</span>
          </h1>
          <p className="text-white/60 text-lg font-light mb-12">Control Your Home Effortlessly</p>

          <House3D />

          <motion.div 
            className="mt-16 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <button
              onClick={login}
              className="w-full relative group overflow-hidden rounded-2xl p-[1px]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity blur-[2px]" />
              <div className="relative bg-background rounded-2xl px-6 py-4 flex items-center justify-center gap-3 w-full transition-all group-hover:bg-background/80 glass-panel">
                <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-white font-medium text-lg">Continue with Google</span>
              </div>
            </button>
            <p className="mt-6 text-xs text-white/40 max-w-xs mx-auto">
              Secure authentication via Google. Only authorized devices will be shown.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
