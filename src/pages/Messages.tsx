import { User, Plus, ArrowLeft, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TabType = "all" | "groups";

interface Message {
  id: number;
  name: string;
  preview: string;
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

  const messages: Message[] = [
    {
      id: 1,
      name: "Aditya chowdary",
      preview: "Hey mr rajesh, would love to talk to you about...",
    },
    {
      id: 2,
      name: "Ramesh paul",
      preview: "Hey mr rajesh, would love to talk to you about...",
    },
    {
      id: 3,
      name: "Priya Sharma",
      preview: "Looking forward to our meeting tomorrow...",
    },
    {
      id: 4,
      name: "Vikram Singh",
      preview: "The pitch deck looks great! Just a few suggestions...",
    },
    {
      id: 5,
      name: "Ananya Desai",
      preview: "Can we schedule a call this week?",
    },
    {
      id: 6,
      name: "Karthik Reddy",
      preview: "Thanks for the introduction! Would love to connect...",
    },
    {
      id: 7,
      name: "Neha Gupta",
      preview: "Your startup idea is really innovative...",
    },
  ];

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-background z-50">
        <div className="max-w-2xl mx-auto flex items-center px-4 h-14">
          <button
            onClick={() => navigate(-1)}
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
      <div className="fixed top-14 left-0 right-0 bg-background z-40">
        <div className="max-w-2xl mx-auto flex items-center px-4">
          <button
            onClick={() => setActiveTab("all")}
            className="flex-1 py-3 relative flex items-center justify-center gap-1"
          >
            <span className={`font-semibold transition-colors ${
              activeTab === "all" ? "text-foreground" : "text-muted-foreground"
            }`}>
              All mail
            </span>
            {activeTab === "all" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-1 hover:bg-muted/50 rounded p-0.5">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
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
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-foreground" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className="flex-1 py-3 text-center relative"
          >
            <span className={`font-semibold transition-colors ${
              activeTab === "groups" ? "text-foreground" : "text-muted-foreground"
            }`}>
              Groups
            </span>
            {activeTab === "groups" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-foreground" />
            )}
          </button>
          
          {/* Create/Join Group Button - Only show in Groups tab */}
          {activeTab === "groups" && (
            <Button 
              size="sm" 
              className="ml-2"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Group
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="pt-28 pb-8">
        <div className="max-w-2xl mx-auto">
          {activeTab === "all" ? (
            // All Mail View
            <>
              {messages.map((message) => (
                <button key={message.id} className="w-full px-4 py-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-success/30 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-success" strokeWidth={2} />
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">
                      {message.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {message.preview}
                    </p>
                  </div>
                </button>
              ))}
            </>
          ) : (
            // Groups View
            <div className="px-4">
              {/* Groups List */}
              {groups.map((group) => (
                <button key={group.id} className="w-full py-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left rounded-lg">
                  {/* Group Avatar */}
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary" strokeWidth={2} />
                  </div>

                  {/* Group Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">
                      {group.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-1">
                      {group.members} members
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {group.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Messages;
