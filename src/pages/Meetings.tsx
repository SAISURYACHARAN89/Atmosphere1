import { useState } from "react";
import { ChevronDown, Clock, Users, Search, Filter } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
      eligible: true 
    },
    { 
      id: 2, 
      host: "Priya Sharma", 
      hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      title: "HealthTech Innovation Summit", 
      industries: ["HealthTech"], 
      startsIn: "1 hour",
      eligible: true 
    },
    { 
      id: 3, 
      host: "Arjun Patel", 
      hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
      title: "EV Market Disruption", 
      industries: ["EV", "CleanTech"], 
      startsIn: "2 hours",
      eligible: true 
    },
    { 
      id: 4, 
      host: "Neha Singh", 
      hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha",
      title: "Blockchain for Enterprise", 
      industries: ["Blockchain", "Fintech"], 
      startsIn: "3 hours",
      eligible: false 
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
        <div className="px-4 py-6 space-y-6">
          {/* Launch Meeting Button */}
          <div className="space-y-4">
            <Button
              onClick={() => setLaunchExpanded(!launchExpanded)}
              variant="outline"
              className={`w-full h-14 text-lg font-semibold border-2 rounded-2xl transition-all ${
                launchExpanded 
                  ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" 
                  : "bg-background border-border hover:bg-muted"
              }`}
            >
              Launch meeting
              <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${launchExpanded ? 'rotate-180' : ''}`} />
            </Button>

            {/* Launch Meeting Expanded Form */}
            {launchExpanded && (
              <div className="border-2 border-border rounded-2xl p-5 space-y-4 bg-card/50 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="meeting-title">Meeting Title</Label>
                  <Input id="meeting-title" placeholder="Enter meeting title" className="h-11" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-date">Date</Label>
                    <Input 
                      id="meeting-date" 
                      type="date" 
                      className="h-11" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-time">Time</Label>
                    <Input 
                      id="meeting-time" 
                      type="time" 
                      className="h-11" 
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
                      className="justify-start h-10"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Public
                    </Button>
                    <Button
                      variant={meetingType === "followers" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMeetingType("followers")}
                      className="justify-start h-10"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Followers Only
                    </Button>
                  </div>
                  <Button
                    variant={meetingType === "private" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMeetingType("private")}
                    className="w-full justify-start h-10"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Private (Invite Only)
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Select Industries (up to 3)</Label>
                  <ScrollArea className="h-32 border border-border rounded-lg p-3 bg-background">
                    <div className="flex flex-wrap gap-2">
                      {industryTags.map(tag => (
                        <Button
                          key={tag}
                          size="sm"
                          variant={selectedIndustries.includes(tag) ? "default" : "outline"}
                          onClick={() => toggleIndustry(tag)}
                          disabled={!selectedIndustries.includes(tag) && selectedIndustries.length >= 3}
                          className="text-xs h-8"
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

                <Button className="w-full h-11">
                  Launch Meeting
                </Button>
              </div>
            )}
          </div>

          {/* Search Public Meetings Section */}
          <div className="border-2 border-border rounded-2xl p-5 bg-card/50 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Search Public Meetings</h2>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Filter className="w-5 h-5" />
              </Button>
            </div>

            {/* Public Meetings List - Always Visible */}
            <div className="space-y-3">
              {filteredMeetings.map(meeting => (
                <div 
                  key={meeting.id}
                  className="border border-border rounded-xl p-4 bg-card hover:bg-muted/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={meeting.hostAvatar} alt={meeting.host} />
                      <AvatarFallback>{meeting.host[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Hosted by {meeting.host}</p>
                        <h3 className="font-semibold text-base mt-0.5">{meeting.title}</h3>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {meeting.industries.map((industry, idx) => (
                          <Badge key={idx} variant={idx === 0 ? "default" : "secondary"} className="text-xs">
                            {industry}
                          </Badge>
                        ))}
                        {meeting.eligible && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                            Eligible
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Starts in {meeting.startsIn}</span>
                      </div>
                    </div>

                    <Button size="sm" className="h-9 px-6">
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Search Meeting Input */}
            <div className="pt-2">
              <Label htmlFor="search-meeting" className="text-sm font-medium mb-2 block">
                Search Meeting
              </Label>
              <div className="flex gap-2">
                <Input 
                  id="search-meeting"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or host..."
                  className="h-12 flex-1"
                />
                <Button size="icon" className="h-12 w-12 flex-shrink-0">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Meetings;
