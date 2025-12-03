import { useState, useEffect } from "react";
import { ChevronDown, Code, TrendingUp, Filter, ChevronRight, Flame, Heart } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FilterDay = "today" | "Last 7 days" ;

const industryTags = [
  "AI", "ML", "Fintech", "HealthTech", "EV", "SaaS", 
  "E-commerce", "EdTech", "AgriTech", "Blockchain", "IoT", "CleanTech",
  "FoodTech", "PropTech", "InsurTech", "LegalTech", "MarTech", "RetailTech",
  "TravelTech", "Logistics", "Cybersecurity", "Gaming", "Media", "SpaceTech"
];

const topStartups = [
  {
    id: 1,
    name: "Airbound Pvt. Ltd.",
    initials: "AR",
    color: "bg-gradient-to-br from-yellow-400 to-orange-500",
    tagline: "Revolutionizing last-mile delivery with drone technology",
    likes: 1200,
    logo: "",
  },
  {
    id: 2,
    name: "Syko Analytics",
    initials: "SY",
    color: "bg-gradient-to-br from-gray-300 to-gray-500",
    tagline: "AI-powered customer behavior prediction platform",
    likes: 950,
    logo: "",
  },
  {
    id: 3,
    name: "GreenWave Energy",
    initials: "GW",
    color: "bg-gradient-to-br from-orange-300 to-yellow-200",
    tagline: "Sustainable energy solutions for urban infrastructure",
    likes: 870,
    logo: "",
  },
  {
    id: 4,
    name: "MediConnect",
    initials: "MC",
    color: "bg-blue-500",
    tagline: "Connecting patients with specialists through telemedicine",
    likes: 820,
    logo: "",
  },
  {
    id: 5,
    name: "Stellar Dynamics",
    initials: "SD",
    color: "bg-indigo-500",
    tagline: "Next-gen satellite communication systems",
    likes: 790,
    logo: "",
  },
  {
    id: 6,
    name: "PayFlow Solutions",
    initials: "PF",
    color: "bg-amber-500",
    tagline: "Digital payment infrastructure for emerging markets",
    likes: 760,
    logo: "",
  },
  {
    id: 7,
    name: "FoodFlow",
    initials: "FF",
    color: "bg-green-500",
    tagline: "Smart logistics for food supply chains",
    likes: 740,
    logo: "",
  },
  {
    id: 8,
    name: "CodeMentor AI",
    initials: "CM",
    color: "bg-purple-500",
    tagline: "AI-powered coding mentorship platform",
    likes: 720,
    logo: "",
  },
  {
    id: 9,
    name: "NeuralHealth",
    initials: "NH",
    color: "bg-pink-500",
    tagline: "Neural network diagnostics for healthcare",
    likes: 700,
    logo: "",
  },
  {
    id: 10,
    name: "LogiChain Systems",
    initials: "LC",
    color: "bg-teal-500",
    tagline: "Blockchain-based supply chain transparency",
    likes: 680,
    logo: "",
  },
];

const Launch = () => {
  const [filterDay, setFilterDay] = useState<FilterDay>("today");
  const [timeRemaining, setTimeRemaining] = useState({ hours: 2, minutes: 30, seconds: 45 });
  const [startupTypeFilters, setStartupTypeFilters] = useState<string[]>([]);
  const [startupIndustryFilters, setStartupIndustryFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

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
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              <Flame className="w-7 h-7 text-orange-500 animate-pulse" />
              Hottest Startups This Week
            </h2>
            <p className="text-muted-foreground text-sm">
              Discover the top 10 most liked companies in the past 7 days.
            </p>
          </div>

          {/* Podium for Top 3 */}
          <div className="flex items-end justify-center gap-6 mb-10">
            {/* 2nd Place */}
            <div className="flex flex-col items-center w-32">
              <div className={`w-20 h-20 rounded-xl shadow-lg flex items-center justify-center text-2xl font-bold text-white ${topStartups[1].color}`}>
                {topStartups[1].initials}
              </div>
              <div className="bg-gray-300 w-16 h-8 rounded-b-xl flex items-center justify-center mt-[-8px]">
                <span className="font-semibold text-gray-700">2</span>
              </div>
              <div className="mt-2 text-center">
                <div className="font-semibold text-base truncate">{topStartups[1].name}</div>
                <div className="text-xs text-muted-foreground truncate">{topStartups[1].tagline}</div>
                <div className="flex items-center justify-center gap-1 text-xs mt-1">
                  <Heart className="w-4 h-4 text-pink-500" />
                  {topStartups[1].likes}
                </div>
              </div>
            </div>
            {/* 1st Place */}
            <div className="flex flex-col items-center w-36">
              <div className={`w-24 h-24 rounded-2xl shadow-xl flex items-center justify-center text-3xl font-bold text-white ${topStartups[0].color} border-4 border-yellow-400`}>
                {topStartups[0].initials}
              </div>
              <div className="bg-yellow-400 w-20 h-10 rounded-b-2xl flex items-center justify-center mt-[-10px]">
                <span className="font-bold text-yellow-900 text-lg">1</span>
              </div>
              <div className="mt-2 text-center">
                <div className="font-bold text-lg truncate">{topStartups[0].name}</div>
                <div className="text-xs text-muted-foreground truncate">{topStartups[0].tagline}</div>
                <div className="flex items-center justify-center gap-1 text-xs mt-1">
                  <Heart className="w-4 h-4 text-pink-500" />
                  {topStartups[0].likes}
                </div>
              </div>
            </div>
            {/* 3rd Place */}
            <div className="flex flex-col items-center w-32">
              <div className={`w-20 h-20 rounded-xl shadow-lg flex items-center justify-center text-2xl font-bold text-white ${topStartups[2].color}`}>
                {topStartups[2].initials}
              </div>
              <div className="bg-orange-300 w-16 h-8 rounded-b-xl flex items-center justify-center mt-[-8px]">
                <span className="font-semibold text-orange-700">3</span>
              </div>
              <div className="mt-2 text-center">
                <div className="font-semibold text-base truncate">{topStartups[2].name}</div>
                <div className="text-xs text-muted-foreground truncate">{topStartups[2].tagline}</div>
                <div className="flex items-center justify-center gap-1 text-xs mt-1">
                  <Heart className="w-4 h-4 text-pink-500" />
                  {topStartups[2].likes}
                </div>
              </div>
            </div>
          </div>

          {/* Grid for 4th-10th */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {topStartups.slice(3).map((startup, idx) => (
              <div key={startup.id} className="bg-card border border-border rounded-xl shadow-sm p-4 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white ${startup.color}`}>
                  {startup.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base truncate">{startup.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{startup.tagline}</div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <Heart className="w-4 h-4 text-pink-500" />
                    {startup.likes}
                  </div>
                </div>
                <Button size="sm" variant="outline" className="rounded-full px-3 py-1 flex items-center gap-1">
                  View
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Launch;
