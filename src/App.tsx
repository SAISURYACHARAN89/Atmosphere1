import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Trade from "./pages/Trade";
import Messages from "./pages/Messages";
import ChatDetail from "./pages/ChatDetail";
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
import SignupConfirm from "./pages/SignupConfirm";
import SetupProfileApple from "./pages/SetupProfileApple";
import SetupProfileBanana from "./pages/SetupProfileBanana";
import SetupProfileKiwi from "./pages/SetupProfileKiwi";
import RoleSelection from "./pages/RoleSelection";
import VerificationStart from "./pages/VerificationStart";
import VerificationKYC from "./pages/VerificationKYC";
import VerificationStartup from "./pages/VerificationStartup";
import VerificationInvestor from "./pages/VerificationInvestor";
import VerificationComplete from "./pages/VerificationComplete";
import NotFound from "./pages/NotFound";
import Opportunities from "./pages/Opportunities";
import Meetings from "./pages/Meetings";
import Notifications from "./pages/Notifications";
import Dashboard from "./pages/Dashboard";
import SavedContent from "./pages/SavedContent";
// import SavedReels from "./pages/SavedReels";
import SavedSellAds from "./pages/SavedSellAds";
// import SavedPosts from "./pages/SavedPosts";
import SavedCompanyCards from "./pages/SavedCompanyCards";
import KYCVerification from "./pages/KYCVerification";
import PortfolioVerification from "./pages/PortfolioVerification";
import ViewsInsight from "./pages/ViewsInsight";
import ProfileVisitsInsight from "./pages/ProfileVisitsInsight";
import FollowersInsight from "./pages/FollowersInsight";
import SavedAds from "./pages/SavedSellAds";
import SavedMedia from "./pages/SavedMedia";
import SetupProfileStartup from "./pages/SetupProfileStartup";
import GetVerified from "./pages/GetVerified";
import { Video } from "lucide-react";
import Videocontain from "./pages/Videocontain";
import StartupInvestor from "./pages/StartupInvestor";
import StartupPortfolio from "./pages/StartupPortfolio";
import DiditKycFrame from "./pages/Kyc";
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup-confirm" element={<SignupConfirm />} />
            <Route path="/setup-profile-apple" element={<SetupProfileApple />} />
            <Route path="/setup-profile-banana" element={<SetupProfileBanana />} />
            <Route path="/setup-profile-kiwi" element={<SetupProfileKiwi />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:chatId" element={<ChatDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/kyc" element={<DiditKycFrame />} />
            <Route path="/dashboard/views" element={<ViewsInsight />} />
            <Route path="/dashboard/profile-visits" element={<ProfileVisitsInsight />} />
            <Route path="/dashboard/followers" element={<FollowersInsight />} />
            <Route path="/getverified" element={<GetVerified />} />
            <Route path="/setup-profile-startup" element={<SetupProfileStartup />} />
            <Route path="/launch" element={<Launch />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reels" element={<Reels />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/startup-profile" element={<StartupProfile />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/video" element={<Videocontain />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/saved-content" element={<SavedContent />} />
            <Route path="/saved/ads" element={<SavedSellAds />} />
            <Route path="/saved/media" element={<SavedMedia />} />
            {/* <Route path="/saved/reels" element={<SavedReels />} /> */}
            {/* <Route path="/saved/sell-ads" element={<SavedSellAds />} /> */}
            {/* <Route path="/saved/posts" element={<SavedPosts />} /> */}
            <Route path="/startupinvestor" element={<StartupInvestor />} />
            <Route path="/startupportfolio" element={<StartupPortfolio />} />
            <Route path="/saved/company-cards" element={<SavedCompanyCards />} />
            <Route path="/company/:companyId" element={<CompanyProfile />} />
            <Route path="/verification-start" element={<VerificationStart />} />
            <Route path="/verification-kyc" element={<VerificationKYC />} />
            <Route path="/verification-startup" element={<VerificationStartup />} />
            <Route path="/verification-investor" element={<VerificationInvestor />} />
            <Route path="/verification-complete" element={<VerificationComplete />} />
            <Route path="/kyc-verification" element={<KYCVerification />} />
            <Route path="/portfolio-verification" element={<PortfolioVerification />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;