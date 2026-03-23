import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAuth } from "@/hooks/use-auth";

// Pages
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Rooms from "@/pages/rooms";
import RoomDetail from "@/pages/room-detail";
import Devices from "@/pages/devices";
import Automations from "@/pages/automations";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

// Protected Route Wrapper
const ProtectedRoute = ({ component: Component }: { component: any }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }
  
  return <Component />;
};

function Router() {
  return (
    <MobileLayout>
      <Switch>
        <Route path="/" component={Login} />
        <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
        <Route path="/rooms"><ProtectedRoute component={Rooms} /></Route>
        <Route path="/rooms/:id"><ProtectedRoute component={RoomDetail} /></Route>
        <Route path="/devices"><ProtectedRoute component={Devices} /></Route>
        <Route path="/automations"><ProtectedRoute component={Automations} /></Route>
        <Route path="/settings"><ProtectedRoute component={Settings} /></Route>
        <Route component={NotFound} />
      </Switch>
    </MobileLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
