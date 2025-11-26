import { useState, useEffect, useRef } from "react";
import { ChevronDown, Clock, Users, Plus, Video, X, Search, BadgeCheck } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

type MeetingType = "public" | "followers" | "private";
type CategoryType = "pitch" | "networking";

const industryTags = [
  "AI", "ML", "Fintech", "HealthTech", "EV", "SaaS", "E-commerce", "EdTech", "AgriTech",
  "Blockchain", "IoT", "CleanTech", "FoodTech", "PropTech", "InsurTech", "LegalTech",
  "MarTech", "RetailTech", "TravelTech", "Logistics", "Cybersecurity", "Gaming", "Media", "SpaceTech"
];

const dummyMeetings = [
  {
    id: 1, host: "Rahul Mehta", hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", title: "Drone tech startups pitch meetings...",
    industries: ["EV", "CleanTech"], category: "pitch", eligible: true, participants: 31, startTime: "12:00", endTime: "12:45", isVerified: true
  },
  {
    id: 2, host: "Priya Sharma", hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", title: "HealthTech Innovation Summit",
    industries: ["HealthTech"], category: "networking", eligible: true, participants: 18, startTime: "11:00", endTime: "11:45", isVerified: true
  },
  {
    id: 3, host: "Arjun Patel", hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun", title: "EV Market Disruption",
    industries: ["EV", "CleanTech"], category: "pitch", eligible: true, participants: 31, startTime: "12:00", endTime: "12:45", isVerified: true
  },
  {
    id: 4, host: "Neha Singh", hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha", title: "Blockchain for Enterprise",
    industries: ["Blockchain", "Fintech"], category: "networking", eligible: false, participants: 12, startTime: "13:00", endTime: "13:45", isVerified: false
  },
];

// ➤ FORMAT TIME TO AM/PM
function formatAMPM(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

function MeetingCard({
  meeting,
  onJoin,
  joinLabel,
  disabled,
  isInQueue,
  queuePosition,
  estimatedSlot,
  showRemove,
  onRemove,
}) {
  const getClockLabel = () => {
    const [sh, sm] = meeting.startTime.split(":").map(Number);
    const [eh, em] = meeting.endTime.split(":").map(Number);

    const now = new Date();
    const start = new Date(now); start.setHours(sh, sm, 0, 0);
    const end = new Date(now); end.setHours(eh, em, 0, 0);

    if (now >= start && now <= end) return "Ongoing";
    return `Starts at ${formatAMPM(meeting.startTime)}`;
  };

  return (
    <div
      className="
    relative              /* THIS FIXES THE ISSUE */
    bg-[#0d0d0d]
    border border-[#272727]
    rounded-2xl
    px-4
    py-4
    shadow-[0px_3px_12px_rgba(0,0,0,0.5)]
    w-full
    overflow-hidden        /* prevents escape */
  "
    >

      {/* REMOVE BUTTON (ONLY ON MY MEETINGS) */}
      {showRemove && (
        <button onClick={onRemove} className="absolute top-2 right-1 w-4 h-4 flex items-center justify-center rounded-full">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}


      {/* ROW 1 — AVATAR + TITLE + JOIN BUTTON */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-white/10">
            <AvatarImage src={meeting.hostAvatar} />
            <AvatarFallback>{meeting.host[0]}</AvatarFallback>
          </Avatar>

          <div>
            <p className="text-sm font-medium text-foreground w-[180px] truncate">
              {meeting.title}
            </p>

            <div className="flex items-center gap-1 mt-0.5">
              <p className="text-xs text-muted-foreground">by {meeting.host}</p>
              {meeting.isVerified && (
                <BadgeCheck className="w-3.5 h-3.5 text-primary" />
              )}
            </div>
          </div>
        </div>

        {/* JOIN BUTTON (BIG ROUND PILL) */}
        <div className="flex flex-col items-center gap-2">
        <button
          onClick={onJoin}
          disabled={disabled}
          className="
            bg-[#2C2C2C]
            px-5
            py-1.5
            rounded-full
            text-xs
            font-semibold
            text-white
            shrink-0
          "
        >
          {joinLabel}
        </button>
        <span
          className="
            px-2
            py-[2px]
            mt-2
            bg-blue-600/5
            text-gray-400
            text-[11px]
            rounded-md
          "
        >
          {meeting.category === "pitch" ? "Pitch" : "Networking"}
        </span>
      </div>
      </div>

      {/* ROW 2 — INDUSTRIES + PITCH TAG */}
      <div className="flex items-center mt-4 justify-between">

        {/* LEFT GROUP: Industry Tags, Eligible, and Clock/Time (Tight Grouping) */}
        {/* Using gap-3 to separate the block of tags from the clock information */}
        <div className="flex items-center gap-3">

          {/* Sub-Group 1: Tags and Eligible (Tight Gap) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {meeting.industries.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="
                        px-2
                        py-[2px]
                        bg-white/10
                        text-white/80
                        text-[10px]
                        rounded-md
                    "
              >
                {tag}
              </span>
            ))}
            {meeting.eligible && (
              <span
                className="
                        px-2
                        py-[2px]
                        bg-green-700/20
                        text-green-500
                        text-[11px]
                        rounded-md
                    "
              >
                Eligible
              </span>
            )}
          </div>

          {/* Sub-Group 2: Clock and Time (Immediately beside the tags) */}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {getClockLabel()}
          </div>
        </div>

        {/* RIGHT GROUP: Users/Participants and Pitch Tag (Far Right End) */}
        {/* Using gap-3 to separate the two right-end elements */}
        <div className="flex items-center gap-3">

          {/* Users and Participants Count */}
          <div className="flex items-center mr-5 gap-1 text-[10px] text-muted-foreground">
          {/* <div className="flex items-center gap-1 text-[10px] text-muted-foreground"> */}

            <Users className="w-2.5 h-2.5" />
            {meeting.participants}
          {/* </div> */}
          </div>

         
        </div>
      </div>
      
      {/* ROW 3 — TIME + PARTICIPANTS
      <div className="flex items-center justify-end text-xs text-muted-foreground">
        
        
      </div> */}

      {/* QUEUE INFO (FOR MY MEETINGS TAB) */}
      {typeof queuePosition !== "undefined" && (
        <div className="mt-2 text-xs">
          <div>
            <b>Queue Position:</b> {queuePosition}
          </div>
          <div>
            <b>Estimated:</b> {estimatedSlot}
          </div>
          <div className="text-muted-foreground">Subject to change</div>
        </div>
      )}
    </div>
  );
}


function NoMeetings() {
  return (
    <div className="text-center py-12">
      <Video className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
      <p className="text-sm text-muted-foreground">No meetings found</p>
    </div>
  );
}

// Custom Tab Button Component with Animated Underline
const TabButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 
          ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
  >
    {label}
    {/* Animated Underline */}
    <span
      className={`absolute bottom-0 left-0 h-[2px] bg-foreground transition-all duration-300 ease-in-out 
              ${isActive ? "w-full" : "w-0"}`}
    />
  </button>
);


const Meetings = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [launchExpanded, setLaunchExpanded] = useState(false);
  const [meetingType, setMeetingType] = useState<MeetingType>("public");
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [pitchDuration, setPitchDuration] = useState(10);
  const [audience, setAudience] = useState<"all" | "verified">("all");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);

  const [activeTab, setActiveTab] = useState<"public" | "my">("public");
  const [myMeetings, setMyMeetings] = useState<number[]>([]);
  const [inQueue, setInQueue] = useState<number[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState<"yes" | "no">("no");

  // Focus search bar when it appears
  useEffect(() => {
    if (showSearchBar && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchBar]);

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry].slice(0, 3)
    );
  };

  const filteredMeetings = dummyMeetings.filter(m => {
    const s = searchQuery.toLowerCase();
    return m.title.toLowerCase().includes(s) || m.host.toLowerCase().includes(s);
  });

  const publicMeetings = filteredMeetings.filter(m => !myMeetings.includes(m.id));
  const myMeetingsList = dummyMeetings.filter(m => myMeetings.includes(m.id));

  const handleJoin = (id: number) => {
    if (!myMeetings.includes(id)) {
      setMyMeetings(prev => [...prev, id]);
      setInQueue(prev => [...prev, id]);
    }
    setActiveTab("my");
  };

  const handleRemove = (id: number) => {
    setMyMeetings(prev => prev.filter(x => x !== id));
    setInQueue(prev => prev.filter(x => x !== id));
  };

  const handleToggleSearch = () => {
    // Clear search and hide bar
    if (showSearchBar) {
      setSearchQuery("");
    }
    setShowSearchBar(prev => !prev);
  }

  const handleGoToVideo = () => navigate("/video");

  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="max-w-2xl mx-auto">
        <div className="p-4 space-y-4">

          {/* Launch Meeting (Existing) */}
          <div>
            <button onClick={() => setLaunchExpanded(!launchExpanded)}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold">Launch meeting</span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${launchExpanded ? "rotate-180" : ""}`} />
            </button>

            {launchExpanded && (
              <div className="mt-3 p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                {/* ... (Launch Meeting Controls remain the same) ... */}
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input className="mt-1 h-9 bg-background" placeholder="Meeting title" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Date</Label>
                    <Input type="date" className="mt-1 h-9 bg-background" />
                  </div>
                  <div>
                    <Label className="text-xs">Time</Label>
                    <Input type="time" className="mt-1 h-9 bg-background" />
                  </div>
                </div>

                {/* Meeting Type */}
                <div>
                  <Label className="text-xs">Type</Label>
                  <div className="grid grid-cols-2 gap-10 mt-1">
                    <Button size="sm" variant={meetingType === "public" ? "default" : "outline"}
                      onClick={() => setMeetingType("public")}>Public</Button>

                    <Button size="sm" variant={meetingType === "private" ? "default" : "outline"}
                      onClick={() => setMeetingType("private")}>Private</Button>
                  </div>
                </div>

                {/* Category */}
                {meetingType === "public" && (
                  <div>
                    <Label className="text-xs">Category</Label>
                    <div className="grid grid-cols-2 gap-10 mt-1">
                      <Button size="sm" variant={category === "pitch" ? "default" : "outline"}
                        onClick={() => setCategory("pitch")}>Pitch Meeting</Button>

                      <Button size="sm" variant={category === "networking" ? "default" : "outline"}
                        onClick={() => setCategory("networking")}>Networking</Button>
                    </div>
                  </div>
                )}

                {/* Pitch settings */}
                {meetingType === "public" && category === "pitch" && (
                  <div className="space-y-3">

                    <div>
                      <div className="flex justify-between mb-1">
                        <Label className="text-xs">Time per pitch</Label>
                        <span className="text-xs">{pitchDuration} min</span>
                      </div>
                      <Slider min={1} max={60} step={1}
                        value={[pitchDuration]}
                        onValueChange={val => setPitchDuration(val[0])} />
                    </div>

                    <div>
                      <Label className="text-xs">Participants</Label>
                      <select
                        value={audience}
                        onChange={(e) => setAudience(e.target.value as "all" | "verified")}
                        className="w-full mt-1 h-9 bg-background border border-border rounded-md px-2 text-sm"
                      >
                        <option value="all">All</option>
                        <option value="verified">Startups</option>
                        <option value="verified">Investors</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Label className="text-xs">Verified Only</Label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={verifiedOnly === "yes"}
                          onChange={(e) => setVerifiedOnly(e.target.checked ? "yes" : "no")}
                          className="w-4 h-4"
                        />
                      </label>
                    </div>

                  </div>
                )}

                {/* Industries */}
                <div>
                  <Label className="text-xs">Industries (max 3)</Label>
                  <ScrollArea className="h-20 mt-1 border rounded-md p-2 bg-background">
                    <div className="flex flex-wrap gap-1.5">
                      {industryTags.map(tag => (
                        <button key={tag} onClick={() => toggleIndustry(tag)}
                          disabled={!selectedIndustries.includes(tag) && selectedIndustries.length >= 3}
                          className={`px-2 py-1 text-xs rounded-md ${selectedIndustries.includes(tag)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                            }`}>
                          {tag}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <Label className="text-xs">Max participants</Label>
                    <span className="text-xs">50</span>
                  </div>
                  <Slider min={5} max={100} step={5} defaultValue={[50]} />
                </div>

                <Button className="w-full h-9">Launch Meeting</Button>
              </div>
            )}
          </div>

          {/* Search Bar Toggle */}
          {showSearchBar && (
            <div className="relative mb-3">
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search meetings by title or host..."
                className="h-10 pl-4 pr-10 rounded-lg"
              />
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          )}

          {/* Tabs and Search Icon */}
          <div className="flex items-end justify-between  mb-3">
            <div className="flex gap-4">
              <TabButton
                label="All"
                isActive={activeTab === "public"}
                onClick={() => setActiveTab("public")}
              />
              <TabButton
                label="My meetings"
                isActive={activeTab === "my"}
                onClick={() => setActiveTab("my")}
              />
            </div>

            <button
              onClick={handleToggleSearch}
              className="flex items-center justify-center w-10 h-10  transition-colors text-muted-foreground hover:text-foreground"
            >
              {showSearchBar ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
          </div>

          {/* Public List */}
          {activeTab === "public" && (
            <div className="space-y-2.5">
              {publicMeetings.map(m => (
                <MeetingCard key={m.id} meeting={m} onJoin={() => handleJoin(m.id)}
                  joinLabel="Join" disabled={false} isInQueue={false} showRemove={false} />
              ))}
              {publicMeetings.length === 0 && <NoMeetings />}
            </div>
          )}

          {/* My Meetings */}
          {activeTab === "my" && (
            <div className="space-y-2.5">
              {myMeetingsList.map(m => {
                return (
                  <MeetingCard key={m.id} meeting={m} joinLabel="In Queue"
                    isInQueue={true} disabled={true}
                    showRemove={true} onRemove={() => handleRemove(m.id)}
                    onJoin={handleGoToVideo} />
                );
              })}
              {myMeetingsList.length === 0 && <NoMeetings />}
            </div>
          )}

        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Meetings;