import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Trade from "./pages/Trade";
import Messages from "./pages/Messages";
import Search from "./pages/Search";
import Launch from "./pages/Launch";
import CompanyProfile from "./pages/CompanyProfile";
import Reels from "./pages/Reels";
import Profile from "./pages/Profile";
import StartupProfile from "./pages/StartupProfile";
import Assets from "./pages/Assets";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RoleSelection from "./pages/RoleSelection";
import NotFound from "./pages/NotFound";
import Opportunities from "./pages/Opportunities";
import Meetings from "./pages/Meetings";
import Notifications from "./pages/Notifications";
import Dashboard from "./pages/Dashboard";
import SavedContent from "./pages/SavedContent";
import SavedReels from "./pages/SavedReels";
import SavedSellAds from "./pages/SavedSellAds";
import SavedPosts from "./pages/SavedPosts";
import SavedCompanyCards from "./pages/SavedCompanyCards";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/search" element={<Search />} />
          <Route path="/launch" element={<Launch />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/startup-profile" element={<StartupProfile />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/saved-content" element={<SavedContent />} />
          <Route path="/saved/reels" element={<SavedReels />} />
          <Route path="/saved/sell-ads" element={<SavedSellAds />} />
          <Route path="/saved/posts" element={<SavedPosts />} />
          <Route path="/saved/company-cards" element={<SavedCompanyCards />} />
          <Route path="/company/:companyId" element={<CompanyProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
