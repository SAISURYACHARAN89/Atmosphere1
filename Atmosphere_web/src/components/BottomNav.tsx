import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Rocket,
  TrendingUp,
  Film,
  User,
  Search,
  Briefcase,
  Calendar,
  Heart,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

type AppMode = "left" | "right";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* ----------------------------------------------------
      NEW LOGIC → Detect when user is previewing reels
  ---------------------------------------------------- */
  const previewFrom = location.state?.preview ?? null;
  const isPreviewReels = location.pathname === "/reels" && !!previewFrom;

  /* Existing logic */
  const fromPath = location.state?.from;
  const isCompanyProfile = location.pathname.startsWith("/company/");
  const isStartupProfile = location.pathname.startsWith("/startup-profile/");
  const isNotificationsPage = location.pathname === "/notifications";
  const isMessagesPage = location.pathname === "/messages";

  const leftModePages = ["/", "/search", "/reels", "/profile"];
  const rightModePages = ["/launch", "/trade", "/opportunities", "/meetings"];

  const [appMode, setAppMode] = useState<AppMode>(() => {
    const stored = localStorage.getItem("navMode");
    if (stored === "left" || stored === "right") return stored;
    return rightModePages.includes(location.pathname) ? "right" : "left";
  });

  const [lastLeftPage, setLastLeftPage] = useState(() => {
    return leftModePages.includes(location.pathname) ? location.pathname : "/";
  });

  const [lastRightPage, setLastRightPage] = useState(() => {
    return rightModePages.includes(location.pathname)
      ? location.pathname
      : "/launch";
  });

  useEffect(() => {
    if (leftModePages.includes(location.pathname)) {
      setLastLeftPage(location.pathname);
    } else if (rightModePages.includes(location.pathname)) {
      setLastRightPage(location.pathname);
    }
  }, [location.pathname]);

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

  const leftModeSidebarTabs = [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "search", icon: Search, label: "Search", path: "/search" },
    { id: "likes", icon: Heart, label: "Likes", path: "/notifications" },
    { id: "messages", icon: MessageCircle, label: "Messages", path: "/messages" },
    { id: "reels", icon: Film, label: "Reels", path: "/reels" },
    { id: "profile", icon: User, label: "Profile", path: "/profile" },
  ];

  const rightModeSidebarTabs = [
    { id: "launch", icon: Rocket, label: "Launch", path: "/launch" },
    { id: "trade", icon: TrendingUp, label: "Trade", path: "/trade" },
    { id: "likes", icon: Heart, label: "Likes", path: "/notifications" },
    { id: "messages", icon: MessageCircle, label: "Messages", path: "/messages" },
    { id: "opportunities", icon: Briefcase, label: "Opportunities", path: "/opportunities" },
    { id: "meetings", icon: Calendar, label: "Meetings", path: "/meetings" },
  ];

  const tabs = appMode === "left" ? leftModeTabs : rightModeTabs;
  const sidebarTabs = appMode === "left" ? leftModeSidebarTabs : rightModeSidebarTabs;

  const handleTabClick = (tab: typeof tabs[0]) => {
    navigate(tab.path, { state: {} });
  };

  const toggleMode = () => {
    if (appMode === "left") {
      setAppMode("right");
      localStorage.setItem("navMode", "right");
      navigate(lastRightPage);
    } else {
      setAppMode("left");
      localStorage.setItem("navMode", "left");
      navigate(lastLeftPage);
    }
  };

  const shouldHideMobileNav =
    isCompanyProfile ||
    isStartupProfile ||
    isNotificationsPage ||
    isMessagesPage;

  const isTabActive = (tabPath: string) => {
    if (isPreviewReels) return tabPath === "/search";
    if (isCompanyProfile && fromPath) return tabPath === fromPath;
    return location.pathname === tabPath;
  };

  return (
    <>
      {/* MOBILE NAV */}
      {!shouldHideMobileNav && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border/50 z-50 shadow-lg">
          <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-2">
            {tabs.slice(0, 2).map((tab) => {
              const Icon = tab.icon;
              const isActive = isTabActive(tab.path);

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className="flex flex-col items-center justify-center gap-1 flex-1 transition-all duration-300"
                >
                  <Icon
                    className={`${isActive ? "text-white fill-white" : "text-muted-foreground"}`}
                    strokeWidth={isActive ? 2.5 : 2}
                    size={24}
                    fill={isActive ? "currentColor" : "none"}
                  />
                </button>
              );
            })}

            {/* Toggle Mode */}
            <button
              onClick={toggleMode}
              className="flex flex-col items-center justify-center gap-1 flex-1 transition-all duration-300"
            >
              <div className="relative w-14 h-7 bg-muted rounded-full p-1">
                <div
                  className={`absolute top-1 w-5 h-5 bg-primary rounded-full transition-transform duration-300 ${
                    appMode === "left" ? "left-1" : "left-8"
                  }`}
                />
              </div>
            </button>

            {tabs.slice(2, 4).map((tab) => {
              const Icon = tab.icon;
              const isActive = isTabActive(tab.path);

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className="flex flex-col items-center justify-center gap-1 flex-1 transition-all duration-300"
                >
                  <Icon
                    className={`${isActive ? "text-white fill-white" : "text-muted-foreground"}`}
                    strokeWidth={isActive ? 2.5 : 2}
                    size={24}
                    fill={isActive ? "currentColor" : "none"}
                  />
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* DESKTOP SIDEBAR */}
      <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 w-20 bg-background/80 backdrop-blur-lg z-50">
        <div className="flex flex-col items-center justify-center w-full h-full gap-6">


          {/* Top Half Icons */}
          <div className="flex flex-col items-center gap-6">
            {sidebarTabs.slice(0, Math.ceil(sidebarTabs.length / 2)).map((tab) => {
              const Icon = tab.icon;
              const isActive = isTabActive(tab.path);

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className="flex items-center justify-center transition-all duration-300 w-12 h-12"
                >
                  <Icon
                    className={`${isActive ? "text-white fill-white" : "text-muted-foreground"}`}
                    strokeWidth={isActive ? 2.5 : 2}
                    size={28}
                    fill={isActive ? "currentColor" : "none"}
                  />
                </button>
              );
            })}
          </div>

          {/* Center Toggle */}
          <button onClick={toggleMode} className="my-4">
            <div className="relative w-14 h-7 bg-muted rounded-full p-1">
              <div
                className={`absolute top-1 w-5 h-5 bg-primary rounded-full transition-transform duration-300 ${
                  appMode === "left" ? "left-1" : "left-8"
                }`}
              />
            </div>
          </button>

          {/* Bottom Half Icons */}
          <div className="flex flex-col items-center gap-6">
            {sidebarTabs.slice(Math.ceil(sidebarTabs.length / 2)).map((tab) => {
              const Icon = tab.icon;
              const isActive = isTabActive(tab.path);

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className="flex items-center justify-center transition-all duration-300 w-12 h-12"
                >
                  <Icon
                    className={`${isActive ? "text-white fill-white" : "text-muted-foreground"}`}
                    strokeWidth={isActive ? 2.5 : 2}
                    size={28}
                    fill={isActive ? "currentColor" : "none"}
                  />
                </button>
              );
            })}
          </div>

        </div>
      </nav>
    </>
  );
};

export default BottomNav;
