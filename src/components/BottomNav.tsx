import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Rocket, TrendingUp, Film, User, Search, Briefcase, Calendar } from "lucide-react";

type AppMode = "left" | "right";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [appMode, setAppMode] = useState<AppMode>("left");

  // Check if we're on a company profile that was navigated from home or reels
  const fromPath = location.state?.from;
  const isCompanyProfile = location.pathname.startsWith('/company/');
  
  const leftModeTabs = [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "search", icon: Search, label: "Search", path: "/search" },
    { id: "reels", icon: Film, label: "Reels", path: "/reels" },
    { id: "profile", icon: User, label: "Profile", path: "/profile" },
  ];

  const rightModeTabs = [
    { id: "launch", icon: Rocket, label: "Launch", path: "/launch" },
    { id: "trade", icon: TrendingUp, label: "Trade", path: "/trade" },
    { id: "opportunities", icon: Briefcase, label: "Opportunities", path: "/opportunities" },
    { id: "meetings", icon: Calendar, label: "Meetings", path: "/meetings" },
  ];

  const tabs = appMode === "left" ? leftModeTabs : rightModeTabs;

  const handleTabClick = (tab: typeof tabs[0]) => {
    navigate(tab.path);
  };

  const toggleMode = () => {
    setAppMode(prev => prev === "left" ? "right" : "left");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border/50 z-50 shadow-lg">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-2">
        {/* First two tabs */}
        {tabs.slice(0, 2).map((tab) => {
          const Icon = tab.icon;
          const isActive = isCompanyProfile && fromPath
            ? tab.path === fromPath
            : location.pathname === tab.path;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className="flex flex-col items-center justify-center gap-1 flex-1 transition-all duration-300"
              aria-label={tab.label}
            >
              <Icon
                className={`transition-colors duration-300 ${
                  isActive 
                    ? 'text-white fill-white' 
                    : 'text-muted-foreground'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
                size={24}
                fill={isActive ? "currentColor" : "none"}
              />
            </button>
          );
        })}

        {/* Central mode toggle switch */}
        <button
          onClick={toggleMode}
          className="flex flex-col items-center justify-center gap-1 flex-1 transition-all duration-300"
          aria-label="Toggle mode"
        >
          <div className="relative w-14 h-7 bg-muted rounded-full p-1">
            <div 
              className={`absolute top-1 w-5 h-5 bg-primary rounded-full transition-transform duration-300 ease-out ${
                appMode === "left" ? "left-1" : "left-8"
              }`}
            />
          </div>
        </button>

        {/* Last two tabs */}
        {tabs.slice(2, 4).map((tab) => {
          const Icon = tab.icon;
          const isActive = isCompanyProfile && fromPath
            ? tab.path === fromPath
            : location.pathname === tab.path;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className="flex flex-col items-center justify-center gap-1 flex-1 transition-all duration-300"
              aria-label={tab.label}
            >
              <Icon
                className={`transition-colors duration-300 ${
                  isActive 
                    ? 'text-white fill-white' 
                    : 'text-muted-foreground'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
                size={24}
                fill={isActive ? "currentColor" : "none"}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
