import { useState } from "react";
import { ChevronDown, Clock, Users, Search, Plus, Video } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type MeetingType = "public" | "followers" | "private";

const industryTags = [
  "AI", "ML", "Fintech", "HealthTech", "EV", "SaaS", 
  "E-commerce", "EdTech", "AgriTech", "Blockchain", "IoT", "CleanTech",
  "FoodTech", "PropTech", "InsurTech", "LegalTech", "MarTech", "RetailTech",
  "TravelTech", "Logistics", "Cybersecurity", "Gaming", "Media", "SpaceTech"
];

const Meetings = () => {
  const [launchExpanded, setLaunchExpanded] = useState(false);
  const [meetingType, setMeetingType] = useState<MeetingType>("public");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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
      eligible: true,
      participants: 24
    },
    { 
      id: 2, 
      host: "Priya Sharma", 
      hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      title: "HealthTech Innovation Summit", 
      industries: ["HealthTech"], 
      startsIn: "1 hour",
      eligible: true,
      participants: 18
    },
    { 
      id: 3, 
      host: "Arjun Patel", 
      hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
      title: "EV Market Disruption", 
      industries: ["EV", "CleanTech"], 
      startsIn: "2 hours",
      eligible: true,
      participants: 31
    },
    { 
      id: 4, 
      host: "Neha Singh", 
      hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha",
      title: "Blockchain for Enterprise", 
      industries: ["Blockchain", "Fintech"], 
      startsIn: "3 hours",
      eligible: false,
      participants: 12
    },
  ];

  const filteredMeetings = dummyMeetings.filter(meeting => {
    const searchMatch = searchQuery === "" || 
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.host.toLowerCase().includes(searchQuery.toLowerCase());
    return searchMatch;
  });

  return (
    <div className="min-h-screen bg-background pb-16">
      <TopBar />

      <main className="pt-14 max-w-2xl mx-auto">
        <div className="p-4 space-y-4">
          {/* Launch Meeting Section */}
          <div>
            <button
              onClick={() => setLaunchExpanded(!launchExpanded)}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl hover:from-primary/15 hover:to-primary/10 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold text-foreground">Launch meeting</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${launchExpanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Launch Form */}
            {launchExpanded && (
              <div className="mt-3 p-4 bg-muted/30 border border-border rounded-xl space-y-3 animate-in slide-in-from-top-2 duration-200">
                <div>
                  <Label htmlFor="meeting-title" className="text-xs font-medium text-muted-foreground">Title</Label>
                  <Input id="meeting-title" placeholder="Meeting title" className="mt-1 h-9 bg-background" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="meeting-date" className="text-xs font-medium text-muted-foreground">Date</Label>
                    <Input id="meeting-date" type="date" className="mt-1 h-9 bg-background" />
                  </div>
                  <div>
                    <Label htmlFor="meeting-time" className="text-xs font-medium text-muted-foreground">Time</Label>
                    <Input id="meeting-time" type="time" className="mt-1 h-9 bg-background" />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Type</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <Button
                      variant={meetingType === "public" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMeetingType("public")}
                      className="h-8 text-xs"
                    >
                      Public
                    </Button>
                    <Button
                      variant={meetingType === "followers" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMeetingType("followers")}
                      className="h-8 text-xs"
                    >
                      Followers
                    </Button>
                    <Button
                      variant={meetingType === "private" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMeetingType("private")}
                      className="h-8 text-xs"
                    >
                      Private
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Industries (max 3)</Label>
                  <ScrollArea className="h-20 mt-1 border border-border rounded-md p-2 bg-background">
                    <div className="flex flex-wrap gap-1.5">
                      {industryTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleIndustry(tag)}
                          disabled={!selectedIndustries.includes(tag) && selectedIndustries.length >= 3}
                          className={`px-2 py-1 text-xs rounded-md transition-colors ${
                            selectedIndustries.includes(tag)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label className="text-xs font-medium text-muted-foreground">Max participants</Label>
                    <span className="text-xs font-medium text-foreground">50</span>
                  </div>
                  <Slider defaultValue={[50]} max={100} min={5} step={5} />
                </div>

                <Button className="w-full h-9 text-sm">
                  Launch Meeting
                </Button>
              </div>
            )}
          </div>

          {/* Public Meetings Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Public Meetings</h2>
              <div className="relative flex-1 max-w-xs ml-3">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="h-8 pl-8 text-xs bg-muted/50 border-0"
                />
              </div>
            </div>

            {/* Meetings List */}
            <div className="space-y-2.5">
              {filteredMeetings.map(meeting => (
                <div 
                  key={meeting.id}
                  className="group bg-card border border-border rounded-lg p-3 hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <div className="flex gap-3">
                    <Avatar className="w-11 h-11 border-2 border-background ring-1 ring-border">
                      <AvatarImage src={meeting.hostAvatar} />
                      <AvatarFallback>{meeting.host[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-foreground leading-tight truncate">
                            {meeting.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            by {meeting.host}
                          </p>
                        </div>
                        <Button size="sm" className="h-7 px-3 text-xs flex-shrink-0">
                          Join
                        </Button>
                      </div>

                      <div className="flex items-center flex-wrap gap-1.5 mb-2">
                        {meeting.industries.slice(0, 2).map((industry, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md font-medium"
                          >
                            {industry}
                          </span>
                        ))}
                        {meeting.eligible && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-green-500/10 text-green-600 text-xs rounded-md font-medium">
                            Eligible
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{meeting.startsIn}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{meeting.participants}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMeetings.length === 0 && (
              <div className="text-center py-12">
                <Video className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">No meetings found</p>
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
