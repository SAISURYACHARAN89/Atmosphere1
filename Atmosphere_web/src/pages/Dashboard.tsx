import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Users,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();

  // insights list
  const insights = [
    {
      title: "Views",
      value: 0,
      icon: Eye,
      color: "text-blue-500",
      route: "views",
    },
    {
      title: "Profile visits",
      value: 20,
      icon: Users,
      color: "text-green-500",
      route: "profile-visits",
    },
  ];

  // ---------------------
  // DATE RANGE OVERLAY
  // ---------------------
  const [showRange, setShowRange] = useState(false);
  const [selectedRange, setSelectedRange] = useState("Last 30 days");

  const ranges = ["Last 7 days", "Last 30 days", "Last 90 days"];

  const pickerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !(pickerRef.current as any).contains(e.target)) {
        setShowRange(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-4 h-14 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <h1 className="text-lg font-semibold flex-1">
            Professional dashboard
          </h1>

          <Button variant="ghost" size="icon">
            <ChevronRight className="opacity-0" />
          </Button>
        </div>
      </header>

      {/* MAIN */}
      <main className="pt-16 pb-10 px-4">
        <div className="max-w-2xl mx-auto relative">

          {/* --------------------------- */}
          {/* DATE SELECTOR FLOATING UI   */}
          {/* --------------------------- */}
          <div className="relative mb-3" ref={pickerRef}>
            <div
              onClick={() => setShowRange(!showRange)}
              className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-2xl text-sm cursor-pointer border border-border/50"
            >
              {selectedRange}

              {showRange ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>

            {/* FLOATING DROPDOWN */}
            {showRange && (
              <div
                className="absolute left-0 mt-2 w-44 bg-card border border-border/50 rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {ranges.map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setSelectedRange(range);
                      setShowRange(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-muted/40 transition-colors"
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SMALL DATE DISPLAY RIGHT */}
          

          {/* INSIGHTS TITLE */}
          <h2 className="text-base font-semibold mb-3">Insights</h2>

          {/* --------------------------- */}
          {/* INSIGHTS LIST */}
          {/* --------------------------- */}
          <div className="bg-card rounded-xl border border-border/40">
            {insights.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-4 border-b last:border-b-0 cursor-pointer"
                  onClick={() => navigate("/dashboard/" + item.route)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${item.color}`} />
                    <span className="text-sm text-foreground">{item.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.value}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* SPACING */}
          <div className="h-6" />

          {/* --------------------------- */}
          {/* FOLLOWERS BREAKDOWN */}
          {/* --------------------------- */}
          <div
            className="bg-card rounded-xl border border-border/40 p-4 cursor-pointer"
            // onClick={() => navigate("/dashboard/followers")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">834</p>
                <p className="text-sm text-muted-foreground">Followers</p>
                <p className="text-xs text-red-500 mt-1">-1.1% vs Oct 17</p>
              </div>

              {/* <ChevronRight className="h-5 w-5 text-muted-foreground" /> */}
            </div>

            <div className="mt-5 border-t pt-4">
              <p className="font-semibold text-sm mb-3">Growth</p>

              <div className="flex items-center justify-between text-sm py-1">
                <span className="text-muted-foreground">Overall</span>
                <span>-10</span>
              </div>

              <div className="flex items-center justify-between text-sm py-1">
                <span className="text-muted-foreground">Follows</span>
                <span className="text-green-500">20</span>
              </div>

              <div className="flex items-center justify-between text-sm py-1">
                <span className="text-muted-foreground">Unfollows</span>
                <span className="text-red-500">30</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
