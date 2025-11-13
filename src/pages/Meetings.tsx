import { useState, useEffect } from "react";
import { ChevronDown, Calendar, Clock, Users } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
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

const Meetings = () => {
  const [launchExpanded, setLaunchExpanded] = useState(false);
  const [joinExpanded, setJoinExpanded] = useState(false);
  const [meetingType, setMeetingType] = useState<MeetingType>("public");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [filterDay, setFilterDay] = useState<FilterDay>("today");
  const [timeRemaining, setTimeRemaining] = useState({ hours: 2, minutes: 30, seconds: 45 });
  const [filterEligibility, setFilterEligibility] = useState(false);
  const [filterMeetingIndustries, setFilterMeetingIndustries] = useState<string[]>([]);

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
      title: "Fintech Innovation Panel", 
      industries: ["Fintech", "Blockchain"], 
      startsIn: "1 hour",
      eligible: false 
    },
    { 
      id: 3, 
      host: "Amit Kumar", 
      hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
      title: "EV Market Disruption", 
      industries: ["EV", "CleanTech"], 
      startsIn: "2 hours",
      eligible: true 
    },
  ];

  const filteredMeetings = dummyMeetings.filter(meeting => {
    const eligibilityMatch = !filterEligibility || meeting.eligible;
    const industryMatch = filterMeetingIndustries.length === 0 || 
      meeting.industries.some(ind => filterMeetingIndustries.includes(ind));
    return eligibilityMatch && industryMatch;
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
                      size="sm"
                      onClick={() => setMeetingType("public")}
                      className="justify-start"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Public
                    </Button>
                    <Button
                      variant={meetingType === "followers" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMeetingType("followers")}
                      className="justify-start"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Followers Only
                    </Button>
                  </div>
                  <Button
                    variant={meetingType === "private" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMeetingType("private")}
                    className="w-full justify-start"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Private (Invite Only)
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Select Industries (Select up to 3)</Label>
                  <ScrollArea className="h-32 border border-border rounded-md p-2">
                    <div className="flex flex-wrap gap-2">
                      {industryTags.map(tag => (
                        <Button
                          key={tag}
                          size="sm"
                          variant={selectedIndustries.includes(tag) ? "default" : "outline"}
                          onClick={() => toggleIndustry(tag)}
                          disabled={!selectedIndustries.includes(tag) && selectedIndustries.length >= 3}
                          className="text-xs"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-participants">Max Participants: 50</Label>
                  <Slider
                    id="max-participants"
                    defaultValue={[50]}
                    max={100}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>

                <Button className="w-full">
                  Launch Meeting
                </Button>
              </div>
            )}

            {/* Join Meeting Expanded Section */}
            {joinExpanded && (
              <div className="border border-border rounded-lg p-4 space-y-4 bg-card animate-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Available Meetings</h3>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Calendar className="w-4 h-4" />
                          {filterDay === "today" ? "Today" : "Yesterday"}
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-2">
                        <div className="space-y-1">
                          <Button
                            variant={filterDay === "today" ? "default" : "ghost"}
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => setFilterDay("today")}
                          >
                            Today
                          </Button>
                          <Button
                            variant={filterDay === "yesterday" ? "default" : "ghost"}
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => setFilterDay("yesterday")}
                          >
                            Yesterday
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {filterDay === "today" && (
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">Time until midnight</span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {String(timeRemaining.hours).padStart(2, '0')}:
                      {String(timeRemaining.minutes).padStart(2, '0')}:
                      {String(timeRemaining.seconds).padStart(2, '0')}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={filterEligibility ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterEligibility(!filterEligibility)}
                  >
                    Eligible Only
                  </Button>
                  {industryTags.slice(0, 6).map(industry => (
                    <Button
                      key={industry}
                      variant={filterMeetingIndustries.includes(industry) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setFilterMeetingIndustries(prev =>
                          prev.includes(industry)
                            ? prev.filter(i => i !== industry)
                            : [...prev, industry]
                        );
                      }}
                    >
                      {industry}
                    </Button>
                  ))}
                </div>

                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {filteredMeetings.map(meeting => (
                      <div
                        key={meeting.id}
                        className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={meeting.hostAvatar} />
                            <AvatarFallback>{meeting.host.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold">{meeting.title}</h4>
                            <p className="text-sm text-muted-foreground">Hosted by {meeting.host}</p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {meeting.industries.map(ind => (
                                <span key={ind} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  {ind}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Starts in {meeting.startsIn}
                              </span>
                              <Button size="sm">Join</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Meetings;
