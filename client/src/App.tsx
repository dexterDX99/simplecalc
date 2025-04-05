import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Calculator from "@/pages/Calculator";
import Investments from "@/pages/Investments";
import Profile from "@/pages/Profile";
import BottomNavigation from "./components/BottomNavigation";

function Router() {
  return (
    <>
      <div className="pb-16"> {/* Add padding to bottom to accommodate the navigation */}
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/investments" component={Investments} />
          <Route path="/profile" component={Profile} />
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <BottomNavigation />
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
