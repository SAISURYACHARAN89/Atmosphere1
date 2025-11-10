import { useState, useEffect } from "react";
import { ChevronDown, Calendar, Clock, Users, Code, TrendingUp, Filter } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type MeetingType = "public" | "followers" | "private";
type FilterDay = "today" | "yesterday";

const industryTags = [
  "AI", "ML", "Fintech", "HealthTech", "EV", "SaaS", 
  "E-commerce", "EdTech", "AgriTech", "Blockchain", "IoT", "CleanTech",
  "FoodTech", "PropTech", "InsurTech", "LegalTech", "MarTech", "RetailTech",
  "TravelTech", "Logistics", "Cybersecurity", "Gaming", "Media", "SpaceTech"
];

const Launch = () => {
  const [launchExpanded, setLaunchExpanded] = useState(false);
  const [joinExpanded, setJoinExpanded] = useState(false);
  const [meetingType, setMeetingType] = useState<MeetingType>("public");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedFundingStages, setSelectedFundingStages] = useState<string[]>([]);
  const [selectedRevenueStatus, setSelectedRevenueStatus] = useState<string[]>([]);
  const [filterEligibility, setFilterEligibility] = useState(false);
  const [filterMeetingIndustries, setFilterMeetingIndustries] = useState<string[]>([]);
  const [startupTypeFilters, setStartupTypeFilters] = useState<string[]>([]);
  const [startupIndustryFilters, setStartupIndustryFilters] = useState<string[]>([]);


  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const toggleFundingStage = (stage: string) => {
    setSelectedFundingStages(prev =>
      prev.includes(stage) 
        ? prev.filter(s => s !== stage)
        : [...prev, stage]
    );
  };

  const toggleRevenueStatus = (status: string) => {
    setSelectedRevenueStatus(prev =>
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

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

  const dummyMeetings = [
    { 
      id: 1, 
      host: "Rahul Mehta", 
      hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
      title: "SaaS Growth Strategies", 
      industries: ["SaaS", "AI"], 
      startsIn: "15 mins",
      eligible: true 
    },
    { 
      id: 2, 
      host: "Priya Sharma", 
      hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      title: "HealthTech Innovation Summit", 
      industries: ["HealthTech"], 
      startsIn: "1 hour",
      eligible: false 
    },
    { 
      id: 3, 
      host: "Arjun Patel", 
      hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
      title: "EV Market Analysis", 
      industries: ["EV", "CleanTech"], 
      startsIn: "2 hours",
      eligible: true 
    },
  ];

  const toggleMeetingIndustry = (industry: string) => {
    setFilterMeetingIndustries(prev =>
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const filteredMeetings = dummyMeetings.filter(meeting => {
    const eligibilityMatch = !filterEligibility || meeting.eligible;
    const industryMatch = filterMeetingIndustries.length === 0 || 
      meeting.industries.some(ind => filterMeetingIndustries.includes(ind));
    return eligibilityMatch && industryMatch;
  });

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
          {/* Launch and Join Buttons Section */}
          <div className="space-y-4 mb-8">
            {/* Buttons Side by Side */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  setLaunchExpanded(!launchExpanded);
                  if (joinExpanded) setJoinExpanded(false);
                }}
                variant="outline"
                className={`h-12 text-base transition-all ${
                  launchExpanded 
                    ? "bg-primary/10 border-primary/50 hover:bg-primary/15" 
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Launch Meeting
              </Button>
              <Button
                onClick={() => {
                  setJoinExpanded(!joinExpanded);
                  if (launchExpanded) setLaunchExpanded(false);
                }}
                variant="outline"
                className={`h-12 text-base transition-all ${
                  joinExpanded 
                    ? "bg-primary/10 border-primary/50 hover:bg-primary/15" 
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Join Meeting
              </Button>
            </div>

            {/* Launch Meeting Expanded Form */}
            {launchExpanded && (
              <div className="border border-border rounded-lg p-4 space-y-4 bg-card animate-in slide-in-from-top-2 duration-300">

                <div className="space-y-2">
                  <Label htmlFor="meeting-title">Meeting Title</Label>
                  <Input id="meeting-title" placeholder="Enter meeting title" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-date">Date</Label>
                    <Input 
                      id="meeting-date" 
                      type="date" 
                      className="h-11 font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-time">Time</Label>
                    <Input 
                      id="meeting-time" 
                      type="time" 
                      className="h-11 font-medium" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Meeting Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={meetingType === "public" ? "default" : "outline"}
                      onClick={() => setMeetingType("public")}
                      className="text-sm"
                    >
                      Public
                    </Button>
                    <Button
                      variant={meetingType === "private" ? "default" : "outline"}
                      onClick={() => setMeetingType("private")}
                      className="text-sm"
                    >
                      Private
                    </Button>
                  </div>
                </div>

                  {meetingType === "public" && (
                    <div className="space-y-4 pt-2 border-t">
                      <div className="space-y-2">
                        <Label>Funding Stage</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {["Pre-seed", "Seed", "Series A", "Series B"].map(stage => (
                            <Button 
                              key={stage} 
                              variant={selectedFundingStages.includes(stage) ? "default" : "outline"}
                              size="sm" 
                              className="text-xs"
                              onClick={() => toggleFundingStage(stage)}
                            >
                              {stage}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Revenue Status</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant={selectedRevenueStatus.includes("Generating") ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleRevenueStatus("Generating")}
                          >
                            Generating
                          </Button>
                          <Button 
                            variant={selectedRevenueStatus.includes("Pre-revenue") ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleRevenueStatus("Pre-revenue")}
                          >
                            Pre-revenue
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Industry Filters</Label>
                        <ScrollArea className="h-32">
                          <div className="flex flex-wrap gap-2">
                            {industryTags.map(industry => (
                              <button
                                key={industry}
                                onClick={() => toggleIndustry(industry)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                  selectedIndustries.includes(industry)
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
                    </div>
                  )}

                <Button className="w-full" size="lg">
                  Launch Meeting
                </Button>
              </div>
            )}

            {/* Join Meeting Expanded Form */}
            {joinExpanded && (
                <div className="border border-border rounded-lg p-4 space-y-4 bg-card animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">Search Public Meetings</h3>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm">Filters</h4>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="eligibility" className="text-sm">
                                  Show Only Eligible
                                </Label>
                                <input
                                  id="eligibility"
                                  type="checkbox"
                                  checked={filterEligibility}
                                  onChange={(e) => setFilterEligibility(e.target.checked)}
                                  className="h-4 w-4 rounded border-input"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm">Industries</Label>
                              <ScrollArea className="h-32">
                                <div className="flex flex-wrap gap-2">
                                  {industryTags.map(industry => (
                                    <button
                                      key={industry}
                                      onClick={() => toggleMeetingIndustry(industry)}
                                      className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                                        filterMeetingIndustries.includes(industry)
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
                                setFilterEligibility(false);
                                setFilterMeetingIndustries([]);
                              }}
                            >
                              Clear Filters
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {filteredMeetings.length > 0 ? (
                          filteredMeetings.map(meeting => (
                            <div key={meeting.id} className="bg-background rounded-lg p-4 border shadow-sm space-y-2">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1">
                                  <Avatar className="h-10 w-10 flex-shrink-0">
                                    <AvatarImage src={meeting.hostAvatar} alt={meeting.host} />
                                    <AvatarFallback>{meeting.host.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <div className="space-y-1 flex-1 min-w-0">
                                    <p className="text-sm text-muted-foreground">Hosted by {meeting.host}</p>
                                    <h4 className="font-semibold">{meeting.title}</h4>
                                  </div>
                                </div>
                                <Button size="sm" className="flex-shrink-0">Join</Button>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                {meeting.industries.map(ind => (
                                  <span key={ind} className="px-2 py-1 bg-muted rounded-full text-xs">
                                    {ind}
                                  </span>
                                ))}
                                {meeting.eligible && (
                                  <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium">
                                    Eligible
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Starts in {meeting.startsIn}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No meetings match your filters
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                <div className="pt-4 border-t space-y-2">
                  <h3 className="font-semibold text-sm">Join via Code</h3>
                  <div className="flex gap-2">
                    <Input placeholder="Enter meeting code" />
                    <Button>Join</Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Separator Line */}
          <div className="border-t border-border/40 my-6"></div>

          {/* Startup Launches Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Startup Launches</h2>
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
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Launch;
