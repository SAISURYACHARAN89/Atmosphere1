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

type MeetingType = "public" | "followers" | "private";
type FilterDay = "today" | "yesterday";

const industryTags = [
  "AI", "ML", "Fintech", "HealthTech", "EV", "SaaS", 
  "E-commerce", "EdTech", "AgriTech", "Blockchain", "IoT", "CleanTech"
];

const Launch = () => {
  const [launchExpanded, setLaunchExpanded] = useState(false);
  const [joinExpanded, setJoinExpanded] = useState(false);
  const [meetingType, setMeetingType] = useState<MeetingType>("public");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [valuationRange, setValuationRange] = useState([0, 100]);
  const [filterDay, setFilterDay] = useState<FilterDay>("today");
  const [timeRemaining, setTimeRemaining] = useState({ hours: 2, minutes: 30, seconds: 45 });

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

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const dummyMeetings = [
    { id: 1, host: "Rahul Mehta", title: "SaaS Growth Strategies", industries: ["SaaS", "AI"], startsIn: "15 mins" },
    { id: 2, host: "Priya Sharma", title: "HealthTech Innovation Summit", industries: ["HealthTech"], startsIn: "1 hour" },
    { id: 3, host: "Arjun Patel", title: "EV Market Analysis", industries: ["EV", "CleanTech"], startsIn: "2 hours" },
  ];

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
      lookingForFunds: true
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
      lookingForFunds: false
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
      lookingForFunds: true
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
      lookingForFunds: false
    },
  ];

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
                className="h-12 text-base bg-muted hover:bg-muted/80"
              >
                Launch Meeting
              </Button>
              <Button
                onClick={() => {
                  setJoinExpanded(!joinExpanded);
                  if (launchExpanded) setLaunchExpanded(false);
                }}
                variant="outline"
                className="h-12 text-base bg-muted hover:bg-muted/80"
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

                <div className="flex gap-3">
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor="meeting-date" className="text-xs text-muted-foreground">Date</Label>
                    <Input 
                      id="meeting-date" 
                      type="date" 
                      className="h-10 text-sm border-muted bg-muted/50 focus:bg-background" 
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor="meeting-time" className="text-xs text-muted-foreground">Time</Label>
                    <Input 
                      id="meeting-time" 
                      type="time" 
                      className="h-10 text-sm border-muted bg-muted/50 focus:bg-background" 
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
                        <Label>Company Valuation Range (in millions)</Label>
                        <div className="px-2">
                          <Slider
                            value={valuationRange}
                            onValueChange={setValuationRange}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>${valuationRange[0]}M</span>
                            <span>${valuationRange[1]}M</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Funding Stage</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {["Pre-seed", "Seed", "Series A", "Series B"].map(stage => (
                            <Button key={stage} variant="outline" size="sm" className="text-xs">
                              {stage}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Revenue Status</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm">Generating</Button>
                          <Button variant="outline" size="sm">Pre-revenue</Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Industry Filters</Label>
                        <ScrollArea className="h-24">
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
                    <h3 className="font-semibold text-sm">Search Public Meetings</h3>
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {dummyMeetings.map(meeting => (
                          <div key={meeting.id} className="bg-background rounded-lg p-4 border shadow-sm space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Hosted by {meeting.host}</p>
                                <h4 className="font-semibold">{meeting.title}</h4>
                              </div>
                              <Button size="sm">Join</Button>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {meeting.industries.map(ind => (
                                <span key={ind} className="px-2 py-1 bg-muted rounded-full text-xs">
                                  {ind}
                                </span>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Starts in {meeting.startsIn}
                            </p>
                          </div>
                        ))}
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
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setFilterDay(filterDay === "today" ? "yesterday" : "today")}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  {filterDay === "today" ? "Today" : "Yesterday"}
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-muted rounded-md transition-colors">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {filterDay === "today" ? (
              <div className="bg-card border rounded-lg p-6 shadow-sm">
                <Tabs defaultValue="upcoming" className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="upcoming">Upcoming Launches</TabsTrigger>
                    <TabsTrigger value="live">Live Now</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upcoming" className="space-y-4 mt-4">
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
                  </TabsContent>

                  <TabsContent value="live" className="mt-4">
                    <div className="text-center py-12 space-y-3">
                      <Clock className="w-12 h-12 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">No live launches at the moment</p>
                      <p className="text-sm text-muted-foreground">Check back soon!</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="space-y-4">
                {dummyStartups.map(startup => (
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
                ))}
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
