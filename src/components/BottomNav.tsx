import { useNavigate, useLocation } from "react-router-dom";
import { Home, Rocket, TrendingUp, Film, User, Search, Briefcase, Calendar, Heart, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

type AppMode = "left" | "right";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on a company profile that was navigated from home or reels
  const fromPath = location.state?.from;
  const isCompanyProfile = location.pathname.startsWith('/company/');
  
  // Determine mode based on current page
  const leftModePages = ["/", "/search", "/reels", "/profile"];
  const rightModePages = ["/launch", "/trade", "/opportunities", "/meetings"];
  
  const appMode: AppMode = rightModePages.includes(location.pathname) ? "right" : "left";

  // Initialize with current page if it matches a mode, otherwise use defaults
  const [lastLeftPage, setLastLeftPage] = useState(() => {
    return leftModePages.includes(location.pathname) ? location.pathname : "/";
  });
  const [lastRightPage, setLastRightPage] = useState(() => {
    return rightModePages.includes(location.pathname) ? location.pathname : "/launch";
  });

  // Track the last visited page for each mode
  useEffect(() => {
    if (leftModePages.includes(location.pathname)) {
      setLastLeftPage(location.pathname);
    } else if (rightModePages.includes(location.pathname)) {
      setLastRightPage(location.pathname);
    }
  }, [location.pathname, leftModePages, rightModePages]);
  
  const leftModeTabs = [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "search", icon: Search, label: "Search", path: "/search" },
    { id: "likes", icon: Heart, label: "Likes", path: "/notifications" },
    { id: "messages", icon: MessageCircle, label: "Messages", path: "/messages" },
    { id: "reels", icon: Film, label: "Reels", path: "/reels" },
    { id: "profile", icon: User, label: "Profile", path: "/profile" },
  ];

  const rightModeTabs = [
    { id: "launch", icon: Rocket, label: "Launch", path: "/launch" },
    { id: "trade", icon: TrendingUp, label: "Trade", path: "/trade" },
    { id: "likes", icon: Heart, label: "Likes", path: "/notifications" },
    { id: "messages", icon: MessageCircle, label: "Messages", path: "/messages" },
    { id: "opportunities", icon: Briefcase, label: "Opportunities", path: "/opportunities" },
    { id: "meetings", icon: Calendar, label: "Meetings", path: "/meetings" },
  ];

  const tabs = appMode === "left" ? leftModeTabs : rightModeTabs;

  const handleTabClick = (tab: typeof tabs[0]) => {
    navigate(tab.path);
  };

  const toggleMode = () => {
    // Navigate to the last visited page of the other mode
    if (appMode === "left") {
      navigate(lastRightPage);
    } else {
      navigate(lastLeftPage);
    }
  };

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border/50 z-50 shadow-lg">
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

      {/* iPad/Desktop left sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 bg-background/80 backdrop-blur-lg z-50">
        <div className="flex flex-col items-center justify-center gap-6 w-full py-4">
          {/* First 2 tabs */}
          {tabs.slice(0, 2).map((tab) => {
            const Icon = tab.icon;
            const isActive = isCompanyProfile && fromPath
              ? tab.path === fromPath
              : location.pathname === tab.path;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className="flex items-center justify-center transition-all duration-300 w-12 h-12"
                aria-label={tab.label}
              >
                <Icon
                  className={`transition-colors duration-300 ${
                    isActive 
                      ? 'text-white fill-white' 
                      : 'text-muted-foreground'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                  size={28}
                  fill={isActive ? "currentColor" : "none"}
                />
              </button>
            );
          })}

          {/* Likes (3rd tab) */}
          {tabs[2] && (() => {
            const tab = tabs[2];
            const Icon = tab.icon;
            const isActive = isCompanyProfile && fromPath
              ? tab.path === fromPath
              : location.pathname === tab.path;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className="flex items-center justify-center transition-all duration-300 w-12 h-12"
                aria-label={tab.label}
              >
                <Icon
                  className={`transition-colors duration-300 ${
                    isActive 
                      ? 'text-white fill-white' 
                      : 'text-muted-foreground'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                  size={28}
                  fill={isActive ? "currentColor" : "none"}
                />
              </button>
            );
          })()}

          {/* Mode toggle switch */}
          <button
            onClick={toggleMode}
            className="flex items-center justify-center transition-all duration-300"
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

          {/* Messages (4th tab) */}
          {tabs[3] && (() => {
            const tab = tabs[3];
            const Icon = tab.icon;
            const isActive = isCompanyProfile && fromPath
              ? tab.path === fromPath
              : location.pathname === tab.path;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className="flex items-center justify-center transition-all duration-300 w-12 h-12"
                aria-label={tab.label}
              >
                <Icon
                  className={`transition-colors duration-300 ${
                    isActive 
                      ? 'text-white fill-white' 
                      : 'text-muted-foreground'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                  size={28}
                  fill={isActive ? "currentColor" : "none"}
                />
              </button>
            );
          })()}

          {/* Last 2 tabs (Reels/Profile or Opportunities/Meetings) */}
          {tabs.slice(4, 6).map((tab) => {
            const Icon = tab.icon;
            const isActive = isCompanyProfile && fromPath
              ? tab.path === fromPath
              : location.pathname === tab.path;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className="flex items-center justify-center transition-all duration-300 w-12 h-12"
                aria-label={tab.label}
              >
                <Icon
                  className={`transition-colors duration-300 ${
                    isActive 
                      ? 'text-white fill-white' 
                      : 'text-muted-foreground'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                  size={28}
                  fill={isActive ? "currentColor" : "none"}
                />
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
