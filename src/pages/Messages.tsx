import { User, Plus, ArrowLeft, ChevronDown, Search, X, Camera } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BottomNav from "@/components/BottomNav";
import Cropper from "react-easy-crop";
import { Dialog as CropDialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type TabType = "all" | "groups";

interface Message {
  id: number;
  name: string;
  preview: string;
  type: "All" | "Investors" | "Ad Replies" | "Startup's";
}

interface Group {
  id: number;
  name: string;
  members: number;
  lastMessage: string;
}

const Messages = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [filter, setFilter] = useState<string>("All");
  const [groupSearch, setGroupSearch] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [newGroupDescription, setNewGroupDescription] = useState<string>("");
  const [newGroupType, setNewGroupType] = useState<string>("Public");
  const [showCropper, setShowCropper] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleBackClick = () => {
    const previousMode = localStorage.getItem('messagesPreviousMode') || 'left';
    if (previousMode === 'right') {
      navigate('/launch');
    } else {
      navigate('/');
    }
  };

  const messages: Message[] = [
  {
    id: 1,
    name: "Aditya chowdary",
    preview: "Hey mr rajesh, would love to talk to you about...",
    type: "Investors",
  },
  {
    id: 2,
    name: "Ramesh paul",
    preview: "Hey mr rajesh, would love to talk to you about...",
    type: "Ad Replies",
  },
  {
    id: 3,
    name: "Priya Sharma",
    preview: "Looking forward to our meeting tomorrow...",
    type: "Startup's",
  },
  {
    id: 4,
    name: "Vikram Singh",
    preview: "The pitch deck looks great! Just a few suggestions...",
    type: "Investors",
  },
  {
    id: 5,
    name: "Ananya Desai",
    preview: "Can we schedule a call this week?",
    type: "All",
  },
  {
    id: 6,
    name: "Karthik Reddy",
    preview: "Thanks for the introduction! Would love to connect...",
    type: "Ad Replies",
  },
  {
    id: 7,
    name: "Neha Gupta",
    preview: "Your startup idea is really innovative...",
    type: "Startup's",
  },
];

  // IMAGE UPLOAD STATE
  const [groupImage, setGroupImage] = useState<string | null>(null);

  // IMAGE UPLOAD HANDLER
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const imgURL = URL.createObjectURL(file);
  setCropImageSrc(imgURL);
  setShowCropper(true);
};
const getCroppedImg = async (imageSrc: string, cropPixels: any) => {
  const img = document.createElement("img");
  img.src = imageSrc;
  await new Promise((res) => (img.onload = res));

  const canvas = document.createElement("canvas");
  const diameter = Math.min(cropPixels.width, cropPixels.height);

  canvas.width = diameter;
  canvas.height = diameter;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.beginPath();
  ctx.arc(diameter / 2, diameter / 2, diameter / 2, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(
    img,
    cropPixels.x,
    cropPixels.y,
    diameter,
    diameter,
    0,
    0,
    diameter,
    diameter
  );

  return canvas.toDataURL("image/jpeg");
};
const onCropComplete = (croppedArea: any, croppedAreaPixelsVal: any) => {
  setCroppedAreaPixels(croppedAreaPixelsVal);
};
const handleCropSave = async () => {
  if (!cropImageSrc || !croppedAreaPixels) return;

  const croppedImg = await getCroppedImg(cropImageSrc, croppedAreaPixels);
  setGroupImage(croppedImg as string);

  setShowCropper(false);
};

  const groups: Group[] = [
    {
      id: 1,
      name: "Startup Founders Network",
      members: 156,
      lastMessage: "New funding opportunities available",
    },
    {
      id: 2,
      name: "Tech Investors Hub",
      members: 89,
      lastMessage: "Monthly meetup scheduled for next week",
    },
    {
      id: 3,
      name: "AI & ML Enthusiasts",
      members: 234,
      lastMessage: "Check out this new research paper",
    },
  ];

  const searchSuggestions: Group[] = [
    { id: 4, name: "AI Startups", members: 445, lastMessage: "" },
    { id: 5, name: "Drone Space Gis", members: 89, lastMessage: "" },
    { id: 6, name: "FinTech Innovators", members: 312, lastMessage: "" },
    { id: 7, name: "SaaS Founders", members: 567, lastMessage: "" },
  ];

  const filteredSearchGroups = searchSuggestions.filter(group =>
    group.name.toLowerCase().includes(groupSearch.toLowerCase())
  );

  const handleCreateGroup = () => {
    // Handle group creation logic
    setShowCreateForm(false);
    setNewGroupName("");
    setNewGroupDescription("");
    setNewGroupType("Public");
  };

  const handleJoinGroup = (group: Group) => {
    // Handle join group logic
    setSelectedGroup(null);
  };
  const filteredMessages =
  filter === "All"
    ? messages
    : messages.filter((msg) => msg.type === filter);


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-background z-50">
        <div className="max-w-2xl mx-auto flex items-center px-4 h-14">
          <button
            onClick={handleBackClick}
            className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div className="flex-1 flex items-center justify-center gap-1.5">
            <h1 className="text-lg font-semibold">johnanderson</h1>
            <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Tabs */}
      <div className="fixed top-14 left-0 right-0 bg-background z-40 border-b border-border/40">
        <div className="max-w-2xl mx-auto flex items-center px-4">
          <button
            onClick={() => setActiveTab("all")}
            className="flex-1 py-3.5 relative flex items-center justify-center gap-1"
          >
            <span
              className={`text-sm font-medium transition-colors ${
                activeTab === "all" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {filter === "All" ? "All mail" : filter}
            </span>

            {activeTab === "all" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-1 hover:bg-muted/50 rounded p-0.5 transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="min-w-[140px]">
                  <DropdownMenuItem onClick={() => setFilter("All")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("Investors")}>
                    Investors
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("Ad Replies")}>
                    Ad Replies
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("Startup's")}>
                    Startup's
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {activeTab === "all" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className="flex-1 py-3.5 text-center relative"
          >
            <span className={`text-sm font-medium transition-colors ${
              activeTab === "groups" ? "text-foreground" : "text-muted-foreground"
            }`}>
              Groups
            </span>
            {activeTab === "groups" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          
        </div>
      </div>

      {/* Content */}
      <main className="pt-[7.5rem] pb-8">
        <div className="max-w-2xl mx-auto">
          {activeTab === "all" ? (
            // All Mail View
            <div className="px-4 space-y-1">
              {filteredMessages.map((message) => (
                <button 
                  key={message.id}
                  onClick={() => navigate(`/messages/${message.id}`)}
                  className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-muted/30 active:bg-muted/50 transition-all rounded-xl text-left group"
                >
                  {/* Avatar */}
                  <div className="
                    w-14 h-14 rounded-full 
                    bg-gradient-to-br from-primary/20 to-primary/10 
                    flex items-center justify-center flex-shrink-0 
                    group-hover:from-primary/30 group-hover:to-primary/20 
                    transition-all 
                    -ml-2 sm:ml-0
                  ">
                    <User className="w-7 h-7 text-primary" strokeWidth={2.5} />
                  </div>



                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1.5 text-[15px]">
                      {message.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate leading-relaxed">
                      {message.preview}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            // Groups View
            <div className="px-4 py-2">
              {/* Search Bar and Create Button */}
              <div className="mb-6 flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                  <Input
                    placeholder="Search groups..."
                    value={groupSearch}
                    onChange={(e) => setGroupSearch(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    className="h-11 pl-10 pr-10 rounded-xl border-border/60 focus:border-primary/40 transition-colors text-[15px]"
                  />
                  {groupSearch && (
                    <button
                      onClick={() => setGroupSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Button
                  size="icon"
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="h-11 w-11 flex-shrink-0 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              {/* Create Group Form */}
              {showCreateForm && (
                <div className="mb-6 p-5 bg-gradient-to-br from-muted/30 to-muted/20 rounded-2xl space-y-4 border border-border/50 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base">Create New Group</h3>
                    <button 
                      onClick={() => setShowCreateForm(false)}
                      className="p-1.5 rounded-lg hover:bg-background/50 transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                   <div className="flex justify-center">
                    <label className="relative w-24 h-24 rounded-full bg-muted flex items-center justify-center cursor-pointer overflow-hidden border">
                      {groupImage ? (
                        <img src={groupImage} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-muted-foreground" />
                      )}
{/* 
                      <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
                        {/* <Camera className="w-4 h-4" /> */}
                      {/* </div> */} 

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <CropDialog open={showCropper} onOpenChange={setShowCropper}>
                    <DialogContent className="p-0 max-w-md overflow-hidden rounded-xl">
                      <div className="relative w-full h-[350px] bg-black">
                        {cropImageSrc && (
                          <Cropper
                            image={cropImageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                          />
                        )}
                      </div>

                      <div className="p-4 flex items-center justify-between">
                        <Button variant="ghost" onClick={() => setShowCropper(false)}>
                          Cancel
                        </Button>

                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.1"
                          value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))}
                          className="mx-3 w-full"
                        />

                        <Button onClick={handleCropSave}>Save</Button>
                      </div>
                    </DialogContent>
                  </CropDialog>

                  </div>
                  <Input
                    placeholder="Group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="h-11 rounded-xl border-border/60 text-[15px]"
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    className="min-h-[90px] rounded-xl border-border/60 text-[15px] resize-none"
                  />
                  <div className="relative">
                    <select
                      value={newGroupType}
                      onChange={(e) => setNewGroupType(e.target.value)}
                      className="
                        flex h-11 w-full rounded-xl border border-border/60 bg-background 
                        pl-5 pr-10 text-[15px]
                        appearance-none
                        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all
                      "
                    >
                      <option>All</option>
                      <option>Verified</option>
                      <option>Private</option>
                    </select>

                    {/* Custom Arrow - Move left by controlling right- position */}
                    <ChevronDown
                      className="w-5 h-5 text-muted-foreground absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none"
                    />
                    </div>

                  <Button 
                    onClick={handleCreateGroup} 
                    className="w-full h-11 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    Create Group
                  </Button>
                </div>
              )}

              {/* Search Results or Groups List */}
              {isSearchFocused || groupSearch ? (
                // Search Results
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground mb-4 px-1 uppercase tracking-wide">
                    {groupSearch ? "Search Results" : "Suggested Groups"}
                  </p>
                  {filteredSearchGroups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroup(group)}
                      className="w-full px-4 py-3.5 flex items-center gap-4 hover:bg-muted/30 active:bg-muted/50 transition-all rounded-xl text-left group"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                        <User className="w-7 h-7 text-primary" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1 text-[15px]">
                          {group.name}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium">
                          {group.members.toLocaleString()} members
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                // Groups List
                <div className="space-y-2">
                  {groups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => navigate(`/messages/g${group.id}`)}
                      className="w-full px-4 py-4 flex items-center gap-4 hover:bg-muted/30 active:bg-muted/50 transition-all rounded-xl text-left group"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                        <User className="w-7 h-7 text-primary" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1.5 text-[15px]">
                          {group.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-1.5 font-medium">
                          {group.members.toLocaleString()} members
                        </p>
                        <p className="text-sm text-muted-foreground truncate leading-relaxed">
                          {group.lastMessage}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Group Preview Dialog */}
      <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-primary" strokeWidth={2.5} />
              </div>
              <div className="flex-1 pt-1">
                <h3 className="font-semibold text-lg mb-1.5">{selectedGroup?.name}</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {selectedGroup?.members.toLocaleString()} members
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Join this group to connect with like-minded professionals and stay updated with the latest discussions.
            </p>
          </div>
          <DialogFooter className="pt-2">
            <Button 
              onClick={() => selectedGroup && handleJoinGroup(selectedGroup)} 
              className="w-full h-11 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              Join Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <BottomNav />
    </div>
  );
};

export default Messages;
