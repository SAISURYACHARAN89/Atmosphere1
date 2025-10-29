import { useState } from "react";
import { Home, Rocket, Plus, Play, DollarSign } from "lucide-react";

type TabType = "home" | "launch" | "trade" | "reels" | "assets";

const BottomNav = () => {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const tabs = [
    { id: "home" as TabType, icon: Home, label: "Home" },
    { id: "launch" as TabType, icon: Rocket, label: "Launch" },
    { id: "trade" as TabType, icon: Plus, label: "Trade" },
    { id: "reels" as TabType, icon: Play, label: "Reels" },
    { id: "assets" as TabType, icon: DollarSign, label: "Assets" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isMainAction = tab.id === "trade";

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center gap-1 flex-1 hover:opacity-70"
              aria-label={tab.label}
            >
              {isMainAction ? (
                // Trade button - larger with square background
                <div className="w-10 h-10 rounded-lg border border-foreground flex items-center justify-center">
                  <Icon
                    className="text-foreground"
                    strokeWidth={isActive ? 2 : 1.5}
                    size={24}
                  />
                </div>
              ) : (
                // Regular nav icons
                <Icon
                  className="text-foreground"
                  strokeWidth={isActive ? 2 : 1.5}
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
