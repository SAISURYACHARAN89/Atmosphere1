import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Rocket, Plus, Film, Wallet } from "lucide-react";

type TabType = "home" | "launch" | "trade" | "reels" | "assets";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on a company profile that was navigated from home or reels
  const fromPath = location.state?.from;
  const isCompanyProfile = location.pathname.startsWith('/company/');
  
  const tabs = [
    { id: "home" as TabType, icon: Home, label: "Home", path: "/" },
    { id: "launch" as TabType, icon: Rocket, label: "Launch", path: "/launch" },
    { id: "trade" as TabType, icon: Plus, label: "Trade", path: "/trade" },
    { id: "reels" as TabType, icon: Film, label: "Reels", path: "/reels" },
    { id: "assets" as TabType, icon: Wallet, label: "Assets", path: "/assets" },
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    navigate(tab.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border/50 z-50 shadow-lg">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          // Keep the original tab active if we're on company profile from that tab
          const isActive = isCompanyProfile && fromPath
            ? tab.path === fromPath
            : location.pathname === tab.path;
          const isMainAction = tab.id === "trade";

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className="flex flex-col items-center justify-center gap-1 flex-1 transition-all duration-300 active:scale-95 hover:bg-muted/30 rounded-lg py-2"
              aria-label={tab.label}
            >
              {isMainAction ? (
                // Trade button - larger with gradient background
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-primary hover:shadow-xl transition-all duration-300 -mt-3">
                  <Icon
                    className="text-white"
                    strokeWidth={2}
                    size={24}
                  />
                </div>
              ) : (
                // Regular nav icons
                <Icon
                  className={`transition-colors duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                  strokeWidth={isActive ? 2.5 : 2}
                  size={24}
                  fill={isActive ? "currentColor" : "none"}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
