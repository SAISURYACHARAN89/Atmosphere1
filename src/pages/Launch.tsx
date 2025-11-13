import { useState, useEffect } from "react";
import { ChevronDown, Code, TrendingUp, Filter } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type FilterDay = "today" | "yesterday";

const industryTags = [
  "AI", "ML", "Fintech", "HealthTech", "EV", "SaaS", 
  "E-commerce", "EdTech", "AgriTech", "Blockchain", "IoT", "CleanTech",
  "FoodTech", "PropTech", "InsurTech", "LegalTech", "MarTech", "RetailTech",
  "TravelTech", "Logistics", "Cybersecurity", "Gaming", "Media", "SpaceTech"
];

const Launch = () => {
  const [filterDay, setFilterDay] = useState<FilterDay>("today");
  const [timeRemaining, setTimeRemaining] = useState({ hours: 2, minutes: 30, seconds: 45 });
  const [startupTypeFilters, setStartupTypeFilters] = useState<string[]>([]);
  const [startupIndustryFilters, setStartupIndustryFilters] = useState<string[]>([]);

  useEffect(() => {
    if (filterDay === "today") {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else if (prev.hours > 0) {
            return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
          }
          return prev;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [filterDay]);

  const toggleStartupType = (type: string) => {
    setStartupTypeFilters(prev =>
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleStartupIndustry = (industry: string) => {
    setStartupIndustryFilters(prev =>
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const startupTypes = ["Revenue Generating", "Pre-seed", "Seed", "Series A", "Series B", "Series C"];
  const startupMainFilters = ["AI", "ML", "SaaS", "Manufacturing", "SpaceTech", "Fintech", "HealthTech", "CleanTech"];

  const dummyStartups = [
    {
      id: 1,
      name: "Airbound Pvt. Ltd.",
      initials: "AR",
      color: "bg-blue-500",
      tagline: "Revolutionizing last-mile delivery with drone technology",
      valuation: "$5M",
      revenue: "$200K MRR",
      fundingRounds: "Pre-seed, Seed",
      lookingForFunds: true,
      type: "Seed",
      industries: ["AI", "Manufacturing"]
    },
    {
      id: 2,
      name: "Syko Analytics",
      initials: "SY",
      color: "bg-purple-500",
      tagline: "AI-powered customer behavior prediction platform",
      valuation: "$12M",
      revenue: "$500K MRR",
      fundingRounds: "Seed, Series A",
      lookingForFunds: false,
      type: "Series A",
      industries: ["AI", "ML", "SaaS"]
    },
    {
      id: 3,
      name: "GreenWave Energy",
      initials: "GW",
      color: "bg-green-500",
      tagline: "Sustainable energy solutions for urban infrastructure",
      valuation: "$8M",
      revenue: "Pre-revenue",
      fundingRounds: "Pre-seed",
      lookingForFunds: true,
      type: "Pre-seed",
      industries: ["CleanTech"]
    },
    {
      id: 4,
      name: "MediConnect",
      initials: "MC",
      color: "bg-red-500",
      tagline: "Connecting patients with specialists through telemedicine",
      valuation: "$15M",
      revenue: "$1M MRR",
      fundingRounds: "Seed, Series A, Series B",
      lookingForFunds: false,
      type: "Series B",
      industries: ["HealthTech", "SaaS"]
    },
    {
      id: 5,
      name: "Stellar Dynamics",
      initials: "SD",
      color: "bg-indigo-500",
      tagline: "Next-gen satellite communication systems",
      valuation: "$20M",
      revenue: "$800K MRR",
      fundingRounds: "Series A",
      lookingForFunds: true,
      type: "Series A",
      industries: ["SpaceTech", "Manufacturing"]
    },
    {
      id: 6,
      name: "PayFlow Solutions",
      initials: "PF",
      color: "bg-amber-500",
      tagline: "Digital payment infrastructure for emerging markets",
      valuation: "$10M",
      revenue: "$600K MRR",
      fundingRounds: "Seed",
      lookingForFunds: false,
      type: "Revenue Generating",
      industries: ["Fintech", "SaaS"]
    },
  ];

  const filteredStartups = dummyStartups.filter(startup => {
    const typeMatch = startupTypeFilters.length === 0 || startupTypeFilters.includes(startup.type);
    const industryMatch = startupIndustryFilters.length === 0 || 
      startup.industries.some(ind => startupIndustryFilters.includes(ind));
    return typeMatch && industryMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="pt-14 pb-16">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Startup Launches Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Startup Launches</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setFilterDay(filterDay === "today" ? "yesterday" : "today")}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  {filterDay === "today" ? "Today" : "Yesterday"}
                  <ChevronDown className="w-4 h-4" />
                </button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Filter className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Filters</h4>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Type</Label>
                        <div className="flex flex-wrap gap-2">
                          {startupTypes.map(type => (
                            <button
                              key={type}
                              onClick={() => toggleStartupType(type)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                startupTypeFilters.includes(type)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-foreground hover:bg-muted/80"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Main Filters</Label>
                        <ScrollArea className="h-32">
                          <div className="flex flex-wrap gap-2">
                            {startupMainFilters.map(industry => (
                              <button
                                key={industry}
                                onClick={() => toggleStartupIndustry(industry)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                  startupIndustryFilters.includes(industry)
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-foreground hover:bg-muted/80"
                                }`}
                              >
                                {industry}
                              </button>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setStartupTypeFilters([]);
                          setStartupIndustryFilters([]);
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {filterDay === "today" ? (
              <div className="bg-card border rounded-lg p-6 shadow-sm">
                <div className="text-center space-y-6 py-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Next Launch Starting In</h3>
                    <p className="text-sm text-muted-foreground">Airbound Pvt. Ltd. - Drone Delivery Platform</p>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-lg bg-primary/10 border-2 border-primary flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary">{String(timeRemaining.hours).padStart(2, '0')}</span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-2">Hours</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-lg bg-primary/10 border-2 border-primary flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary">{String(timeRemaining.minutes).padStart(2, '0')}</span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-2">Minutes</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-lg bg-primary/10 border-2 border-primary flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary">{String(timeRemaining.seconds).padStart(2, '0')}</span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-2">Seconds</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-3">3 more launches scheduled today</p>
                    <Button className="w-full">Set Reminder</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStartups.length > 0 ? (
                  filteredStartups.map(startup => (
                    <div key={startup.id} className="bg-card border rounded-lg p-4 shadow-sm space-y-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-lg ${startup.color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                          {startup.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base">{startup.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{startup.tagline}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                          {startup.type}
                        </span>
                        {startup.industries.map(ind => (
                          <span key={ind} className="px-2 py-1 bg-muted rounded-full text-xs">
                            {ind}
                          </span>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Valuation:</span>
                          <span className="font-medium">{startup.valuation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Revenue:</span>
                          <span className="font-medium">{startup.revenue}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Funding Rounds: </span>
                          <span className="font-medium">{startup.fundingRounds}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Looking for Funds:</span>
                          <span className={`font-medium ${startup.lookingForFunds ? 'text-green-600' : 'text-muted-foreground'}`}>
                            {startup.lookingForFunds ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No startups match your filters
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Launch;
